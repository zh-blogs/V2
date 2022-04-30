import React from "react";
import { NextPage } from "next";

import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { Tabs, Tab, Card, } from "@/components/antd";
import { Flex } from '@/components/flex';

import { RandomBlogs } from "@/components/index/random";
import { AboutTab } from "@/components/index/about";
import { Blogs } from "@/components/index/blogs";
import { useQuery, shouldString } from "@/utils";
import Link from "next/link";

const Home: NextPage<{
  inititalQuery: { [key: string]: string | string[] };
}> = (props) => {
  const { inititalQuery } = props;
  const [query, setQuery] = useQuery({ tab: "random", ...inititalQuery });
  const { tab } = query;
  const tabs: Tab<any>[] = React.useMemo(
    () =>
      [
        {
          key: "random",
          tab: "随机博客推荐",
          render: (_, blogs) => <RandomBlogs />,
        },
        {
          key: "blog_list",
          tab: "博客列表",
          render: (_, blogs) => <Blogs />,
        },
        { key: "about", tab: "关于", render: (_, blogs) => <AboutTab /> },
      ] as Tab[],
    []
  );

  return (
    <Card bordered={false} shadow>
      <Flex direction="LR" mainAxis="flex-start" subAxis="center" mainSize="large">
        <Flex.Item style={{ textAlign:"center", margin:"auto" }}>
          <img src="/logo.png" alt="logo" width={150} />
        </Flex.Item>
        <Flex.Item style={{ flex:"auto" }}>
          <Flex direction="TB" fullWidth mainSize="large" >
            <span style={{ fontSize:"2em", fontWeight:"bold" }}>中文博客列表导航项目</span>  
            <Flex direction="LR" subSize="large">
              <span>尝试链接几乎所有的中文博客</span>
              <Link href="/manager/join" passHref>
                <Button type="primary" icon={<PlusOutlined />}>
                申请加入
                </Button>
              </Link></Flex>
          </Flex>
        </Flex.Item>
      </Flex>
       
      <Tabs<any>
        tabs={tabs}
        activeKey={shouldString(tab, "random")}
        onChange={(tab) => setQuery({ ...query, tab })}
      />
    </Card>
  );
};

Home.getInitialProps = async (ctx) => {
  console.log(ctx.query);
  
  return {
    inititalQuery: ctx.query as { [key: string]: string | string[] },
  };
};

export default Home;
