/**
 * 该文件只允许在服务端引入
 */
import { Blog, Result, UserInfo } from '../../types';
import { newLokiCached, DatabaseLoki } from '../lokijs/wrapper';
import { OtsClient } from './wrapper';
import { shouldNumber, shouldString } from '@/utils';
import { Log } from '@/utils/log';
import fs from 'fs';
import path from 'path';
import TableStore from 'tablestore';
import { v4 as uuid } from 'uuid';

const OTS_TABLE_PARAMS_USER = {
  tableName: 'user',
  primaryKeys: ['id', 'login', 'token'],
};
const OTS_TABLE_PARAMS_SETTING = { tableName: 'setting', primaryKeys: ['key'] };

export class OTSDB {
  log!: Log;
  client!: OtsClient;
  DB!: DatabaseLoki;

  constructor() {
    this.log = new Log('数据驱动');

    this.DB = newLokiCached(path.join(path.resolve('.'), 'db', 'loki.json'));
    this.getClient();
  }

  isInitializing = false;

  async getClient() {
    if (!this.client) {
      if (!this.isInitializing) {
        this.isInitializing = true;

        const {
          OTS_ACCESS_KEY_ID,
          OTS_SECRET_ACCESS_KEY,
          OTS_ENDPOINT,
          OTS_INSTANCE_NAME,
          OTS_STS_TOKEN,
        } = JSON.parse(
          (
            await fs.readFileSync(
              path.join(path.resolve('.'), 'db', 'setting.json')
            )
          ).toString('utf8')
        );

        this.client = new OtsClient({
          accessKeyId: OTS_ACCESS_KEY_ID,
          secretAccessKey: OTS_SECRET_ACCESS_KEY,
          stsToken: OTS_STS_TOKEN,
          endpoint: OTS_ENDPOINT,
          instancename: OTS_INSTANCE_NAME,
        });
      } else {
        while (!this.client) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }
    }

    return this.client;
  }

  async getUser(params: { token: string }): Promise<Result<UserInfo>> {
    const client = await this.getClient();

    try {
      const data = await client.quickQueryRows<{
        id: number;
        login: string;
        token: string;
        info: string;
      }>({ ...OTS_TABLE_PARAMS_USER, data: { token: params.token } });

      if (data.length > 0) {
        const record = data[0];
        const info = JSON.parse(record?.info?.toString() || '');

        return { success: true, data: info };
      }

      throw new Error('ots returns no data');
    } catch (err) {
      this.log.error('error:', err);

      return { success: false, message: '请重新登录' };
    }
  }

  async setUser(params: { token: string; info: UserInfo }) {
    const client = await this.getClient();

    const data = await client.quickQueryRow<{ key: string; value: string }>({
      ...OTS_TABLE_PARAMS_SETTING,
      data: { key: 'admin' },
    });
    const adminArr = data?.value?.toString()?.split(',') || [];

    const { token, info } = params;
    if (!info.admin) {
      info.admin = adminArr.indexOf(info.id.toString()) !== -1;
    }

    this.log.log(`set token ${token} for ${info.name}, admin ${info.admin}`);

    const idRecords = await client.quickQueryRows<{
      id: number;
      login: string;
      token: string;
      info: string;
    }>({
      ...OTS_TABLE_PARAMS_USER,
      data: { id: TableStore.Long.fromNumber(info.id) },
    });

    if (idRecords.length > 0) {
      await client.batchQuickDeleteRows(
        idRecords.map((row) => ({ ...OTS_TABLE_PARAMS_USER, data: row }))
      );
    }

    await client.quickPutRow({
      ...OTS_TABLE_PARAMS_USER,
      data: {
        id: TableStore.Long.fromNumber(info.id),
        login: info.login,
        token,
        info: JSON.stringify(info),
      },
    });
  }

  /**
   * 获取标签列表
   * @returns 标签列表
   */
  async getTags(_: {}): Promise<Result<string[]>> {
    const tags = new Set<string>();

    const c = this.DB.getBlogsCollection();
    const blogs = await c.find({});
    for (const blog of blogs) {
      if (!!blog.tags) {
        for (const tag of blog.tags) {
          tags.add(tag);
        }
      }
    }

    this.log.log(`${blogs.length} 篇博客, ${tags.size} 个标签`);

    return {
      success: true,
      data: Array.from(tags),
    };
  }

  /**
   * 获取标签列表（包括博客数目）
   * @returns 标签列表
   */
  async getTagsWithCount(_: {}): Promise<
    Result<{ tag: string; count: number }[]>
  > {
    const resp = await this.getBlogs({ size: -1, status: 0 });

    if (!resp.success) {
      return { success: false, message: resp.message };
    }

    if (!resp.data) {
      return { success: false, message: 'no data' };
    }

    const blogs = resp.data.blogs;
    const dict: { [tag: string]: number } = {};
    for (const blog of blogs) {
      for (const tag of blog.tags) {
        if (!dict[tag]) {
          dict[tag] = 0;
        }
        dict[tag]++;
      }
    }

    const tags = Object.keys(dict).map((tag) => ({ tag, count: dict[tag] }));

    return {
      success: true,
      data: tags,
    };
  }

  /**
   * 获取博客数据
   * @param search 筛选关键字
   * @param tags 筛选标签
   * @param offset 偏移量
   * @param size 返回数目（-1 全量返回）
   * @returns 博客数据
   */
  async getBlogs(params: {
    search?: string;
    tags?: string[];
    offset?: number;
    size?: number;
    status?: 0 | 1 | -1 | 2;
  }): Promise<Result<{ total: number; blogs: Blog[] }>> {
    var { search, tags, offset, size, status = 1 } = params;

    const queries = [];
    const searchQuery: TableStore.SearchParams['searchQuery'] = {
      offset: 0,
      limit: 100,
      query: { queryType: TableStore.QueryType.BOOL_QUERY, query: {} },
      getTotalCount: true,
    };

    if (!!offset) {
      searchQuery.offset = offset;
    }
    if (!!size && size > 0) {
      searchQuery.limit = size;
    }
    if (!!search) {
      queries.push({
        queryType: TableStore.QueryType.BOOL_QUERY,
        query: {
          shouldQueries: [
            {
              queryType: TableStore.QueryType.WILDCARD_QUERY,
              query: { fieldName: 'name', text: `%${search.toLowerCase()}%` },
            },
            {
              queryType: TableStore.QueryType.WILDCARD_QUERY,
              query: { fieldName: 'url', text: `%${search.toLowerCase()}%` },
            },
          ],
        },
      });
    }

    if (status === 1) {
      queries.push({ query: { fieldName: 'enabled', term: true } });
    } else if (status === -1) {
      queries.push({ query: { fieldName: 'enabled', term: false } });
    } else if (status === 2) {
      queries.push({ query: { fieldName: 'recommend', term: true } });
    }

    if (!!tags && tags.length > 0) {
      queries.push({
        queryType: TableStore.QueryType.BOOL_QUERY,
        query: {
          shouldQueries: tags.map((tag) => ({
            queryType: TableStore.QueryType.WILDCARD_QUERY,
            query: { fieldName: 'name', text: `%${tag}%` },
          })),
        },
      });
    }

    const resp = await this.client.search({
      tableName: 'blogs',
      indexName: 'blogs_index',
      searchQuery: {
        ...searchQuery,
        query: {
          queryType: TableStore.QueryType.BOOL_QUERY,
          query: { mustQueries: queries },
        },
      },
      columnToGet: { returnType: TableStore.ColumnReturnType.RETURN_ALL },
    });

   
  
    
    return {
      success: true,
      data: {
        total: 0,
        blogs: [],
      },
    };
  }

  /**
   * 修改 id 为 @id 的博客数据
   * @param id 博客 ID
   * @param blog 新博客数据
   * @returns 返回修改结果
   */
  async updateBlog(params: { id: string; blog: Blog }): Promise<Result> {
    const c = this.DB.getBlogsCollection();
    const now = new Date().getTime();

    c.findAndUpdate({ id: { $eq: params.id } }, (oldBlog: Blog) => {
      const obj: Blog = {
        ...params.blog,
        join_time: oldBlog.join_time,
        update_time: now,
      };
      for (const key of Object.keys(obj) as (keyof Blog)[]) {
        oldBlog[key] = obj[key] as never;
      }
    });

    return { success: true, message: '修改成功' };
  }

  /**
   * 插入一条新的博客数据
   * @param blog 博客数据
   * @returns 返回插入结果
   */
  async addBlog(params: { blog: Blog }): Promise<Result<Blog>> {
    const c = this.DB.getBlogsCollection();

    if (!params?.blog?.id) {
      params.blog.id = uuid();
    }

    const now = new Date().getTime();

    c.insertOne({
      ...params.blog,
      idx: c.max('idx') + 1,
      join_time: now,
      update_time: now,
    });

    return { success: true, message: '添加成功' };
  }

  /**
   * 删除 id 为 @id 博客
   * @param id 博客 ID
   * @returns 返回删除结果
   */
  async deleteBlog(params: { id: string }): Promise<Result<Blog>> {
    const c = this.DB.getBlogsCollection();
    c.chain()
      .find({ id: { $eq: params.id } })
      .remove();

    return { success: true, message: '删除成功' };
  }

  /**
   * 重命名 @tag 标签为 @newTag
   * @param tag 标签名称
   * @param newTag 新标签名称
   * @returns 返回删除结果
   */
  async renameTag(params: {
    tag: string;
    newTag: string;
  }): Promise<Result<null>> {
    const c = this.DB.getBlogsCollection();

    c.chain()
      .find({ tags: { $contains: params.tag } })
      .update((blog) => {
        blog.tags[blog.tags.indexOf(params.tag)] = params.newTag;
      });

    return { success: true, message: '重命名成功' };
  }

  /**
   * 删除 @tag 标签
   * @param tag 标签名称
   * @returns 返回删除结果
   */
  async deleteTag(params: { tag: string }): Promise<Result<null>> {
    const c = this.DB.getBlogsCollection();

    c.chain()
      .find({ tags: { $contains: params.tag } })
      .update((blog) => {
        blog.tags = blog.tags.filter((tag) => tag !== params.tag);
      });

    return { success: true, message: '删除成功' };
  }

  /**
   * 获取配置项
   * @param key 配置名称
   * @returns 配置项内容
   */
  async getSetting(params: {
    key: string;
  }): Promise<Result<{ key: string; value: any }>> {
    const c = this.DB.getSettingsCollection();
    const setting = c.findOne({ key: { $eq: params.key } });

    return !!setting
      ? { success: true, data: setting }
      : { success: false, message: `不存在 key ${params.key}` };
  }

  /**
   * 设置配置项
   * @param key 配置名称
   * @param value 配置项内容
   */
  async setSetting(params: { key: string; value: any }): Promise<Result<null>> {
    const c = this.DB.getSettingsCollection();

    const obj = c.findOne({ key: { $eq: params.key } });
    if (!!obj) {
      obj.value = params.value;
      c.update(obj);
    } else {
      c.insertOne(params);
    }

    return { success: true, message: '设置成功' };
  }

  /**
   * 清除 Token
   */
  async clearToken(): Promise<Result<null>> {
    const client = await this.getClient();

    const data = await client.getRange({
      tableName: 'user',
      direction: TableStore.Direction.FORWARD,
      inclusiveStartPrimaryKey: [
        { id: TableStore.INF_MIN },
        { login: TableStore.INF_MIN },
        { token: TableStore.INF_MIN },
      ],
      exclusiveEndPrimaryKey: [
        { id: TableStore.INF_MAX },
        { login: TableStore.INF_MAX },
        { token: TableStore.INF_MAX },
      ],
      limit: 50,
    });

    if (data.rows.length > 0) {
      await Promise.all(
        data.rows.map(
          async (row) =>
            await client.deleteRow({
              tableName: 'user',
              condition: new TableStore.Condition(
                TableStore.RowExistenceExpectation.IGNORE,
                null
              ),
              primaryKey:
                row.primaryKey?.map((pk) => ({ [pk.name]: pk.value })) || [],
            })
        )
      );
    }

    return { success: true, message: '清理成功' };
  }

  async checkPermission(token: string) {
    const permission = await this.getUser({ token });

    return !!permission.success && !!permission.data && !!permission.data.admin;
  }
}