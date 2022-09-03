import React from "react";
import { Spin, SpinProps } from "antd";

import { Combine } from "@/utils";

export declare type LoadingProps = Combine<
  {
    loading?: boolean;
    children?: React.ReactNode;
  },
  SpinProps
>;

/**
 * 加载组件
 * @param loading boolean 是否为加载状态
 */
export function Loading(props: LoadingProps) {
  const { loading = true, style, ...restProps } = props;
  
  return (
    <Spin
      spinning={loading}
      style={{ width: "100%", ...style }}
      {...restProps}
    />
  );
}
