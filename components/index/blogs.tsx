import React from "react";

import { Table, TableColumnsType, Input, Button, Collapse } from "antd";
import { RocketOutlined } from "@ant-design/icons";

import {
  Blog,
  showNotification,
  useQuery,
  shouldString,
  shouldNumber,
  shouldArraySplit,
} from "@/utils";
import { Tag } from "@/components/tag";
import { Flex } from "@/components/flex";
import { getBlogs, getTags } from "@/utils/api";

const pageSize = 10;

const cols: TableColumnsType<Blog> = [
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
];
export function Blogs() {
  const cacheRef = React.useRef<{ [key: string]: Blog[] }>({});
  const [blogs, setBlogs] = React.useState<Blog[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [query, setQuery] = useQuery({ page: "1", tags: "", search: "" });

  const [allTags, setAllTags] = React.useState<string[]>([]);
  const [selectedTags, setSelectedTags] = React.useState<string[]>(
    shouldArraySplit(query.selectedTags)
  );
  const unselectedTags = React.useMemo(() => {
    var set = new Set(allTags);
    for (const tag of selectedTags) {
      set.delete(tag as never);
    }
    
    return Array.from(set);
  }, [allTags, selectedTags]);
  React.useEffect(() => {
    // 同步标签到 query
    console.log("tags");
    setQuery({ tags: selectedTags.join(","), page:"1" });
  }, [selectedTags, setQuery]);

  const addTag = React.useCallback(
    (tag: string) => {
      setSelectedTags([...selectedTags, tag]);
    },
    [selectedTags, setSelectedTags]
  );

  const removeTag = React.useCallback(
    (tag: string) => {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    },
    [selectedTags, setSelectedTags]
  );

  React.useEffect(() => {
    // 加载标签列表
    getTags({}).then((result) => {
      if (showNotification(result) && !!result.data) {
        setAllTags(result.data);
      }
    });
  }, []);

  const getParams = React.useCallback(() => {
    const search = shouldString(query.search);
    const page = shouldNumber(query.page, 1);
    const tagsString = shouldString(query.tags);
    const tags = tagsString.split(",");
    
    return {
      search,
      tags,
      offset: (page - 1) * pageSize,
      size: pageSize,
    };
  }, [query]);

  const [totalBlogs, setTotalBlogs] = React.useState(0);


  // query 改变时，更新列表
  const getPage = React.useCallback(() => {
    // 加载指定页码
    const params = getParams();
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
  }, [cacheRef, setBlogs, setLoading, getParams]);

  React.useEffect(() => {
    getPage();
  }, [getPage]);

  return (
    <Flex fullWidth direction="TB">
      <Flex direction="LR">
        <Flex.Item style={{ flex: "auto" }}>
          <Input
            placeholder="输入名称或网址筛选博客"
            defaultValue={shouldString(query.search)}
            onBlur={(e) => {
              if (!!e && !!e.target) {
                setQuery({ search: e.target.value.toLowerCase(), page: "1" });
              }
            }}
            onKeyUp={(e) => {
              if (!!e && !!e.target && e.key === "Enter") {
                const search = (
                  e.target as HTMLInputElement
                ).value.toLowerCase();
                setQuery({ search, page: "1" });
              }
            }}
          />
        </Flex.Item>
        <Button type="primary" icon={<RocketOutlined />} href="/go">
          随机博客跳转
        </Button>
      </Flex>
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
        rowKey="url"
        style={{ width: "100%" }}
        columns={cols}
        dataSource={blogs}
        pagination={{
          showLessItems: true,
          hideOnSinglePage: true,
          simple: true,
          current: shouldNumber(query.page),
          total: totalBlogs,
          pageSize,
          showSizeChanger: false,
          onChange: (page) => {
            setQuery({ ...query, page: shouldString(page) });
          },
        }}
      />
    </Flex>
  );
}
