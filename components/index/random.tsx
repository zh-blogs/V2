import React from "react";
import { Table, TableColumnsType, Button } from "antd";
import { TeamOutlined } from "@ant-design/icons";

import { Blog, showNotification } from "@/utils";
import { Flex } from "@/components/flex";
import { getRandomBlogs } from "@/utils/api";

const cols: TableColumnsType<Blog> = [
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

export function RandomBlogs() {
  const [blogs, setBlogs] = React.useState<Blog[]>([]);
  const [loading, setLoading] = React.useState(false);

  const get10 = React.useCallback(() => {
    setLoading(true);
    getRandomBlogs({})
      .then((result) => {
        if (showNotification(result) && !!result.data) {
          setBlogs(result.data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setBlogs, setLoading]);

  React.useEffect(() => {
    get10();
  }, [get10]);

  return (
    <Flex direction="TB" fullWidth>
      <Button
        icon={<TeamOutlined />}
        loading={loading}
        onClick={() => {
          get10();
        }}
      >
        再来十个
      </Button>
      <Table<Blog>
        rowKey="url"
        columns={cols}
        dataSource={blogs}
        loading={loading}
        pagination={false}
      />
    </Flex>
  );
}
