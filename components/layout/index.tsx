import React from 'react';
import { GithubOutlined, HomeFilled, PlusCircleFilled, RocketFilled, SettingFilled } from "@ant-design/icons";
import { classConcat, ComponentProps, Context } from "@/utils";
import styles from "./layout.module.scss";
import { Flex } from "@/components/flex";
import { Card } from '@/components/antd';
import Link from "next/link";

export type LayoutProps = ComponentProps<{}>;

export default function Layout(props: LayoutProps) {
  const { children } = props;
  const ctx = React.useContext(Context);
  
  return (
    <>
      <Flex
        className={classConcat(
          styles.layout,
          ctx.layoutClassName,
        )}
        style={ctx.layoutStyle}
        fullWidth
        mainSize={0}
        subSize="large"
        subAxis="center"
      >
        {children}
        <Footer />
      </Flex>
    </>
  );
}

function Footer() {
  const menus = [
    { name: "首页", icon: <HomeFilled />, path: "/" },
    { name: "博客登记", icon: <PlusCircleFilled />, path: "/manager/join" },
    { name: "随机跳转", icon: <RocketFilled />, path: "/go" },
    { name: "后台管理", icon:<SettingFilled />, path:"/manager" },
  ];
  
  return (
    <Flex className={styles.footer} direction="TB" >
      <Flex direction="LR" className={styles.menus} mainSize={0} subSize={0} mainAxis="space-around">
        {menus.map((menu) => <Link key={menu.path} href={menu.path} passHref>
          <a>
            <Card className={styles.menu}>
              <Flex direction="TB" mainSize="small" >
                <span className={styles.icon}>{menu.icon}</span>
                <span className={styles.name}>{menu.name}</span>
              </Flex>
            </Card>
          </a>
        </Link>)}
      </Flex>

      <Flex.Item>© 中文博客导航 2022 - {new Date().getFullYear()}</Flex.Item>
      <a href="http://beian.miit.gov.cn/">豫ICP备17000379号-2</a>
      <Flex.Item>
        <GithubOutlined style={{ marginRight: "0.5em" }} />
        <a href="https://github.com/zh-blogs/blog-daohang">
          zh-blogs/blog-daohang
        </a>
      </Flex.Item>
      {/* <a href="https://github.com/zh-blogs/blog-daohang">
        <Flex>
          <img
            src="https://img.shields.io/github/stars/zh-blogs/blog-daohang?style=flat-square"
            alt="github stars"
          />
          <img
            src="https://img.shields.io/github/forks/zh-blogs/blog-daohang?style=flat-square"
            alt="github forks"
          />
          <img
            src="https://img.shields.io/github/watchers/zh-blogs/blog-daohang?style=flat-square"
            alt="github watchers"
          />
        </Flex>
      </a> */}
    </Flex>
  );
}
