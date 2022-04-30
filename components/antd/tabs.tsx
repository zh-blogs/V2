import { ReactNode } from "react";
import { Combine } from "@/utils";
import { Tabs as AntdTabs, TabsProps as AntdTabsProps } from "antd";

export declare type Tab<T = any> = {
  key: string;
  tab: string;
  render: (tab: Tab<T>, dataSource?: T) => ReactNode;
};

export declare type TabsProps<T> = Combine<
  {
    tabs: Tab<T>[];
    dataSource?: T;
  },
  AntdTabsProps
>;

export function Tabs<T = any>(props: TabsProps<T>) {
  const { tabs, dataSource, ...restProps } = props;
  
  return (
    <AntdTabs {...restProps}>
      {tabs.map((tab) => (
        <AntdTabs.TabPane key={tab.key} tab={tab.tab}>
          {tab.render(tab, dataSource)}
        </AntdTabs.TabPane>
      ))}
    </AntdTabs>
  );
}
