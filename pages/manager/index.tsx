import React from 'react';
import { Table, Input, Collapse, TableColumnsType, notification, Radio } from 'antd';
import Link from 'next/link';
import { CheckOutlined, CloseOutlined, GithubOutlined } from '@ant-design/icons';
import { Card, Loading, Form, FormItemProps, Switch, Button } from '@/components/antd';
import { getUserInfo, getTags, getBlogs, updateBlog, deleteBlog } from '@/utils/api';
import { UserInfo, Blog, showNotification, shouldString, shouldNumber, getDomain, Combine } from '@/utils';
import { Tag }from'@/components/tag';
import { Flex } from '@/components/flex';
import styles from './index.module.scss';
import Cookie from 'js-cookie';

export default function Manager() {
  const [token, setToken] = React.useState("");
  const [info, setInfo] = React.useState<UserInfo>();
  const [loading, setLoading] = React.useState(false);
    
  React.useEffect(() => {
    setLoading(true);
    const token = Cookie.get("token");
    if (!!token) {
      getUserInfo({ token: token }).then((resp) => { 
        if (!!resp.success && !!resp.data) {
          setToken(token);
          setInfo(resp.data);
        } else {
          setToken("");
        }
      });
    } else {
      setToken("");
    }
    
    setLoading(false);
  }, [setToken]);
  
  return <Card shadow>
    <Loading loading={loading}>
      {!!token && !!info ?
        !!info.admin ?
          <Admin info={info} />
          : <Flex direction="TB">
            <p>Hi, {info.name}({info.id})。你不是项目组成员，请联系管理员添加权限。</p>
            <Flex direction="TB">
              <span>为管理员提供如下信息</span>
              <span>name: {info.name}</span>
              <span>id: {info.id}</span>
              <span>email: {info.email}
              </span>
            </Flex>
          </Flex>
        :<Login/>
      }
    </Loading>
  </Card>;
}


function Login() {
  return <Link href="/api/user/github_connect?from=/manager" passHref><Button icon={<GithubOutlined/>}>登录</Button></Link>;
  // return <Form
  //   forms={[
  //     { key: "token", label: "Token" },
  //   ]}
  //   onFinish={(values) => { 
  //     const token = values.token;
  //     Cookie.set("token", token);
     
  //     location.reload();
  //   }}
  // />;
}



function Admin(props:{info:UserInfo}) {
  const { info } = props;
    
  const cacheRef = React.useRef<{ [key: string]: Blog[] }>({});

  const [blogs, setBlogs] = React.useState<Blog[]>([]);
  const [totalBlogs, setTotalBlogs] = React.useState(0);

  const [loading, setLoading] = React.useState(false);

  const [allowScripts, setAllowScripts] = React.useState(false);
  const [allowSameOrigin, setAllowSameOrigin]= React.useState(false);

  const [params, setParams] = React.useState<Combine< Required<Parameters<typeof getBlogs>[0]>, {page:number}>>({
    search:"",
    tags: [] as string[],
    page : 1,
    offset: 0,
    size: 10,
    status: 0,
  });

  const [allTags, setAllTags] = React.useState<string[]>([]);
  const [selectedTags, setSelectedTags] = React.useState<string[]>( [] );
  const unselectedTags = React.useMemo(() => {
    var set = new Set(allTags);
    for (const tag of selectedTags) {
      set.delete(tag as never);
    }
    
    return Array.from(set);
  }, [allTags, selectedTags]);
 

  const addTag = React.useCallback(
    (tag: string) => {
      const newTags = [...selectedTags, tag];
      setSelectedTags(newTags);
      setParams({ ...params, tags: newTags });
    },
    [params, selectedTags, setSelectedTags]
  );

  const removeTag = React.useCallback(
    (tag: string) => {
      const newTags = selectedTags.filter((t) => t !== tag);
      setSelectedTags(newTags);
      setParams({ ...params, tags: newTags });
    },
    [params, selectedTags, setSelectedTags]
  );

  React.useEffect(() => {
    // 加载标签列表
    getTags({}).then((result) => {
      if (showNotification(result) && !!result.data) {
        setAllTags(result.data);
      }
    });
  }, []);


  // query 改变时，更新列表
  const getPage = React.useCallback(() => {
    // 加载指定页码
    const key = JSON.stringify(params);
    if (!!cacheRef.current[key] && cacheRef.current[key].length > 0) {
      setBlogs(cacheRef.current[key]);
    } else {
      setLoading(true);
    }
    getBlogs(params)
      .then((res) => {
        if (showNotification(res) && !!res.data) {
          setBlogs(res.data.blogs);
          setTotalBlogs(res.data.total);
          // 更新缓存
          cacheRef.current = { ...cacheRef.current, [key]: res.data.blogs };
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params, cacheRef, setBlogs, setLoading]);

  React.useEffect(() => {
    getPage();
  }, [getPage]);

    
  const [edit, setEdit] = React.useState<Blog>();
  const [form] = Form.useForm();
    
  const forms = React.useMemo(() => [
    {
      key: 'id',
      label: 'ID',
      required: true,
      readonly:true,
    },
    {
      key: 'url',
      label: '博客首页',
      required: true,
      rules: [
        {
          validator: async (_, value:string) => {
            // 判断博客重复
            const resp = await getBlogs({ search: getDomain(value), status: 0 });
            if (!!resp.success && !!resp.data) {
              const blogs = resp.data.blogs;
              const matchBlogs = blogs.filter(
                (blog) => getDomain(blog.url) === getDomain(value) && !!edit&& blog.id !== edit.id
              );
              if (matchBlogs.length > 0) {
                return Promise.reject(
                  `该博客已存在, 请勿重复添加。已找到的匹配博客: ${matchBlogs
                    .map((blog) => `${blog.name}(${blog.url})`)
                    .join(',')}`
                );
              }
            }
          },
        },
      ],
    },
    {
      key: 'name',
      label: '博客名称',
      required: true,
    },
    {
      key: 'sign',
      label: '博客描述',
    },
    {
      key: 'logo',
      label: '博客头像',
    },
    {
      key: 'feed',
      label: 'RSS 订阅地址',
    },
    {
      key: 'tags',
      label: '分类',
      select: allTags,
      mode: 'tags',
    },
    {
      key: 'enabled',
      label: '展示',
      render: () => <Switch/>
    },
  ] as FormItemProps[], [allTags, edit]);
    
  const cols: TableColumnsType<Blog> = React.useMemo(() => [
    {
      title: "#",
      dataIndex: "idx",
      key: "idx",
    },
    {
      title: "标题",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "链接",
      dataIndex: "url",
      key: "url",
      render: (url) => (
        <a
          href={url}
          hrefLang="zh"
          target="_blank"
          type="text/html"
          rel="noreferrer"
        >
          {url}
        </a>
      ),
    },
    {
      title: "描述",
      dataIndex: "sign",
      key: "sign",
    },
    {
      title: "Rss",
      dataIndex: "rss",
      key: "rss",
    },
    {
      title: "标签",
      dataIndex: "tags",
      key: "tags",
      render: (tags:string[]) => <Flex direction="LR" mainSize="small" subSize="small" mainAxis="flex-start" subAxis="flex-start">{tags.map((tag) => <Tag key={tag} tag={tag}/>)}</Flex>
    },
    {
      title: "展示",
      dataIndex: "enabled",
      key: "enabled",
      render: (enabled) => !!enabled ? <CheckOutlined style={{ color: "green" }}/>:<CloseOutlined style={{ color: "red" }}/>
    },
    {
      title: "操作",
      dataIndex: "op",
      key: "op",
      render: (_, record) => (
        <Flex direction="LR" mainSize="small" subSize="small">
          <Button onClick={() => {
            setEdit(record);
            form.setFieldsValue({
              id: record.id,
              url: record.url,
              name: record.name,
              sign: record.sign,
              logo: record.logo,
              feed: record.feed,
              tags: record.tags,
              status: record.status,
              repeat: record.repeat,
              enabled: record.enabled,
            });
          }}
          type="primary" text="修改"/>
          <Button onClick={async () => { 
            const resp = await deleteBlog({ id: record.id as string });
            if (resp.success) {
              notification.success({ message: "删除成功", description: resp.message });
              getPage();
            }else {
              notification.error({ message:"删除失败", description: resp.message });
            }
          }}
          type="primary" danger confirm="确认删除?" text="删除"/>
        </Flex>
      ),
    },
  ], [setEdit, form, getPage]);  
    
  return (
    <Flex fullWidth direction="TB">
      <p>Hi, {info.name} !</p>
      <Radio.Group
        onChange={(e) => {
          if (!!e.target) {
            setParams({ ...params, status: shouldNumber(e.target.value, 0) as (0 | 1 | -1) });
          }
        }}
        value={params.status}
      >
        <Radio.Button value={0}>查看全部</Radio.Button>
        <Radio.Button value={1}>展示</Radio.Button>
        <Radio.Button value={-1}>隐藏</Radio.Button>
      </Radio.Group>
      <Input
        placeholder="输入名称或网址筛选博客"
        defaultValue={shouldString(params.search)}
        onBlur={(e) => {
          if (!!e && !!e.target) {
            setParams({ ...params, search: e.target.value.toLowerCase() });
          }
        }}
        onKeyUp={(e) => {
          if (!!e && !!e.target && e.key === "Enter") {
            const search = (
                  e.target as HTMLInputElement
            ).value.toLowerCase();
            setParams({ ...params, search });
          }
        }}
      />    
      <Flex
        direction="LR"
        mainSize="small"
        subSize="small"
        mainAxis="flex-start"
      >
        {selectedTags.map((tag) => (
          <Tag key={tag} tag={tag} onClose={() => removeTag(tag)} />
        ))}
      </Flex>
      <Collapse ghost>
        <Collapse.Panel header="标签选择" key="tags">
          <Flex
            direction="LR"
            mainSize="small"
            subSize="small"
            mainAxis="flex-start"
          >
            {unselectedTags.map((tag) => (
              <Tag key={tag} tag={tag} onClick={() => addTag(tag)} />
            ))}
          </Flex>
        </Collapse.Panel>
      </Collapse>
      <Table
        loading={loading}
        rowKey={(record) => `${record.id}-${record.url}`}
        style={{ width: "100%" }}
        columns={cols}
        dataSource={blogs}
        rowClassName={(record) => record.repeat? styles.repeat:"" }
        pagination={{
          showLessItems: true,
          hideOnSinglePage: true,
          current: shouldNumber(params.page),
          total: totalBlogs,
          pageSize: params.size,
          pageSizeOptions: [5, 10, 20, 50],
          showSizeChanger: true,
          onChange: (page, size) => {
            setParams({ ...params, page, size, offset: (page - 1) * params.size });
          },
        }}
      />
          
      {!!edit && <Form form={form} forms={forms} onFinish={async (values) => {
        const resp = await updateBlog({ id: values.id, blog: values });
        if (resp.success) {
          notification.success({ message: "修改成功", description: resp.message });
          getPage();
        }else {
          notification.error({ message:"修改失败", description: resp.message });
        }
      }
      } />}
      {!!edit && <Flex direction="LR" mainAxis="flex-start" mainSize="middle" subSize="small">
        <Flex direction="LR" mainAxis="flex-start" mainSize="small" subSize="small">
          <b>允许运行脚本</b>
          <span>（部分站点可能需要 JS 渲染页面）</span>
          <Switch value={allowScripts} onChange={(value) => setAllowScripts(value)} />
        </Flex>
        <Flex direction="LR" mainAxis="flex-start" mainSize="small" subSize="small">
          <b>允许同源</b>
          <span>（部分站点可能需要获取 cookie 信息）</span>
          <Switch value={allowSameOrigin} onChange={(value) => setAllowSameOrigin(value)} />
        </Flex>
      </Flex>}
      {!!edit && <iframe src={edit.url} style={{ width: "100%", height: "50vh" }} sandbox={[
        allowSameOrigin&&"allow-same-origin",
        allowScripts&& "allow-scripts",
      ].filter((item) => !!item).join(" ")}/>}
    </Flex>
  );
}

