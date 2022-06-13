/**
 * 该文件只允许在服务端引入
 */

import path from "path";

import { Blog, Result, UserInfo } from "../types";
import { newLokiCached } from "./database";
import { Log } from '@/utils/log';
import { shouldNumber, shouldString } from "@/utils";

const log = new Log("数据驱动");

const DB = newLokiCached(path.join(path.resolve("."), "db", "loki.json"));


async function getUser(params: { token: string }): Promise<Result<UserInfo>> {
  const c = DB.getUsersCollection();

  var info = c.findOne({ "token": { "$eq": params.token } });
  if (!!info) {
    return Promise.resolve({
      success: true,
      data: info,
    });
  }
  
  return Promise.resolve({
    success: false,
    message:"请重新登录"
  });
}

function setUser(params: { token: string, info: UserInfo }) {
  const c = DB.getUsersCollection();
  const cSetting = DB.getSettingsCollection();

  const adminObj = cSetting.findOne({ "key": { "$eq": "admin" } });
  const adminArr = !!adminObj?shouldString(adminObj.value).split(","):[];

  const { token, info } = params;
  if (!info.admin) {
    info.admin = adminArr.indexOf(info.id.toString()) !== -1;
  }
  
  log.log(`set token ${token} for ${info.name}, admin ${info.admin}`);

  // remove deprecated token and insert new info
  c.chain().find({ "id": { "$eq": info.id } }).remove();
  c.insertOne({ ...info, token });
}

/**
 * 获取标签列表
 * @returns 标签列表
 */
async function getTags(_: {}): Promise<Result<string[]>> {
  const tags = new Set<string>();

  const c = DB.getBlogsCollection();
  const blogs = await c.find({});
  for (const blog of blogs) {
    if (!!blog.tags) {
      for (const tag of blog.tags) {
        tags.add(tag);
      }
    }
  }

  log.log(`${blogs.length} 篇博客, ${tags.size} 个标签`);

  return {
    success: true,
    data: Array.from(tags),
  };
}

/**
 * 获取标签列表（包括博客数目）
 * @returns 标签列表
 */
async function getTagsWithCount(_: {}): Promise<Result<{ tag: string, count: number }[]>> {
  const resp = await getBlogs({ size: -1, status: 0 });

  if (!resp.success) {
    return { success: false, message: resp.message };
  }

  if (!resp.data) {
    return { success: false, message: "no data" };
  }
 
  const blogs = resp.data.blogs;
  const dict:{[tag:string]: number} = {};
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
async function getBlogs(params: { search?: string, tags?: string[], offset?: number, size?: number, status?: 0 | 1 | -1 }): Promise<Result<{ total: number, blogs: Blog[] }>> {
  const c = DB.getBlogsCollection();

  var chain = c.chain();
 
  var { search, tags, offset, size, status=1 } = params;
  if (!!search) {
    search = search.toLowerCase();
  }
    
  if (status === 1) {
    chain = chain.find({ "enabled": { "$eq": true } });
  } else if (status === -1) {
    chain = chain.find({ "enabled": { "$eq": false } });
  }

  
  if (!!search) {
    chain = chain.where((blog) => 
      blog.name.toLowerCase().indexOf(search as string) !== -1 ||
      blog.url.toLowerCase().indexOf(search as string) !== -1
    );
  
  }
  if (!!tags && tags.length > 0) {
    chain = chain.where((blog) =>
      tags?.filter((tag) => !!blog.tags &&
        blog.tags.indexOf(tag) !== -1).length === tags?.length
    );
  }

  // 符合的数目
  const total = chain.count();

  chain.simplesort("idx");
  if (typeof offset === "number") {
    chain = chain.offset(offset); 
  }
  if (typeof size === "number" && size > 0) {
    chain = chain.limit(size);
  }

  log.log(`匹配 ${total} 篇博客`);

  // 格式标准化
  const blogs = chain.data().map((blog) => (
    {
      id: shouldString(blog.id, ""),
      idx: blog.idx,
      name: blog.name,
      url: blog.url,
      tags: !!blog.tags? blog.tags:[],
      sign: shouldString(blog.sign, ""),
      feed: shouldString(blog.feed, ""),
      status: `${blog.status}`,
      repeat: false,
      enabled: !!blog.enabled,
      sitemap: shouldString(blog.sitemap, ""),
      arch: shouldString(blog.arch, ""), 
      join_time:  shouldNumber(blog.join_time, 0), 
      update_time: shouldNumber(blog.update_time, 0), 
      saveweb_id: shouldString(blog.saveweb_id),
    } as Blog
  ));

  return{
    success: true,
    data: {
      total,
      blogs,
    }
  };

}

/**
 * 修改 id 为 @id 的博客数据
 * @param id 博客 ID
 * @param blog 新博客数据
 * @returns 返回修改结果
 */
async function updateBlog(params: { id: string, blog: Blog }): Promise<Result> {
  const c = DB.getBlogsCollection();
  const now = (new Date()).getTime();

  c.findAndUpdate(
    { id: { "$eq": params.id } },
    (oldBlog:Blog) => {
      const obj:Blog = {
        ...params.blog,
        join_time: oldBlog.join_time,
        update_time: now,
      };
      for (const key of Object.keys(obj) as (keyof Blog)[]) {
        oldBlog[key] = obj[key] as never;
      }
    }
  );

  return { success: true, message: "修改成功", };
}

/**
 * 插入一条新的博客数据
 * @param blog 博客数据
 * @returns 返回插入结果
 */
async function addBlog(params: { blog: Blog }): Promise<Result<Blog>> {
  const c = DB.getBlogsCollection();

  if (c.find({ "id": { "$eq": params.blog.id } }).length >0) {
    return { success: false, message: "博客已存在" };
  }

  const now = (new Date()).getTime();

  c.insertOne({
    ...params.blog,
    idx: c.max("idx") + 1,
    join_time: now,
    update_time: now,
  });
 
  return { success: true, message: "添加成功", };
}

/**
 * 删除 id 为 @id 博客
 * @param id 博客 ID
 * @returns 返回删除结果
 */
async function deleteBlog(params: { id: string }): Promise<Result<Blog>> {
  const c = DB.getBlogsCollection();
  c.chain().find({ "id": { "$eq": params.id } }).remove();
  
  return { success: true, message: "删除成功", };
}

/**
 * 重命名 @tag 标签为 @newTag
 * @param tag 标签名称
 * @param newTag 新标签名称
 * @returns 返回删除结果
 */
async function renameTag(params: { tag: string, newTag: string }): Promise<Result<null>> {
  const c = DB.getBlogsCollection();

  c.chain().find({ "tags": { "$contains": params.tag } }).update((blog) => { 
    blog.tags[blog.tags.indexOf(params.tag)] = params.newTag;
  });

  return { success: true, message: "重命名成功", };
}

/**
 * 删除 @tag 标签
 * @param tag 标签名称
 * @returns 返回删除结果
 */
async function deleteTag(params: { tag: string }): Promise<Result<null>> {
  const c = DB.getBlogsCollection();

  c.chain().find({ "tags": { "$contains": params.tag } }).update((blog) => { 
    blog.tags = blog.tags.filter((tag) => tag !== params.tag);
  });

  return { success: true, message: "删除成功", };
}

/**
 * 获取配置项
 * @param key 配置名称
 * @returns 配置项内容
 */
async function getSetting(params: { key: string }): Promise<Result<{ key: string, value: any }>> {
  const c = DB.getSettingsCollection();
  const setting = c.findOne({ key: { "$eq": params.key } });
  
  return !!setting?{ success: true, data: setting }: { success:false, message:`不存在 key ${params.key}` };
}


/**
 * 设置配置项
 * @param key 配置名称
 * @param value 配置项内容
 */
async function setSetting(params: { key: string, value:any }): Promise<Result<null>> {
  const c = DB.getSettingsCollection();

  const obj = c.findOne({ key: { "$eq": params.key } });
  if (!!obj) {
    obj.value = params.value;
    c.update(obj);
  } else {
    c.insertOne(params);
  }
  
  return { success:true, message:"设置成功" };
}

/**
 * 清楚 Token
 */
async function clearToken(): Promise<Result<null>> {
  const c = DB.getUsersCollection();

  c.chain().find().remove();
  
  return { success:true, message:"清理成功" };
}


export default exports = {
  // db,
  // getBlogCount,
  getBlogs,
  updateBlog,
  addBlog,
  deleteBlog,
  getTags,
  getTagsWithCount,
  renameTag,
  deleteTag,

  getUser,
  setUser,
  clearToken,

  getSetting,
  setSetting,
};
