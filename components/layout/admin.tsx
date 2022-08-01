import Link from "next/link";
import React from "react";

import styles from "./admin.module.scss";

import { Card } from "@/components/antd";
import { Flex } from "@/components/flex";
import { AdminPermission } from "@/components/login";

const menus = [
  { name: "博客管理", path: "/manager" },
  { name: "标签管理", path: "/manager/tags" },
  { name: "设置管理", path: "/manager/settings" },
];

export function AdminLayout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <Card shadow>
      <Flex direction="TB" fullWidth subSize={0} mainSize="large">
        <Flex
          direction="LR"
          className={styles.menus}
          mainSize={0}
          subSize={0}
          mainAxis="center"
        >
          {menus.map((menu) => (
            <Link key={menu.path} href={menu.path} passHref>
              <a>
                <div className={styles.menu}>{menu.name}</div>
              </a>
            </Link>
          ))}
        </Flex>

        <AdminPermission>{children}</AdminPermission>
      </Flex>
    </Card>
  );
}
