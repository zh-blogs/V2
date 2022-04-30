import React from "react";
import { ObjectFilter, ComponentProps } from "@/utils";

export declare type SizeProp = number | "none" | "small" | "middle" | "large";

function getSize(size: SizeProp): number {
  return size === "large"
    ? 20
    : size === "middle"
      ? 10
      : size === "small"
        ? 5
        : size === "none"
          ? 0
          : size;
}

export declare type FlexProps = ComponentProps<{
  direction?: "LR" | "TB" | "row" | "row-reverse" | "column" | "column-reverse";
  wrap?: true | false | "nowrap" | "wrap" | "wrap-reverse";
  mainAxis?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around";
  subAxis?: "flex-start" | "flex-end" | "center" | "baseline" | "stretch";
  mainSize?: SizeProp;
  subSize?: SizeProp;
  fullWidth?: boolean;
  itemStyle?: React.CSSProperties;
}> &
  React.HTMLAttributes<HTMLDivElement>;
const FlexComponent: React.ForwardRefRenderFunction<
  HTMLDivElement,
  FlexProps
> = (props, ref) => {
  const {
    direction = "LR",
    wrap = true,
    mainSize = "middle",
    subSize = 0,
    mainAxis = "space-between",
    subAxis = "center",
    itemStyle = {},
    fullWidth = false,
    children,
    style,
    ...restProps
  } = props;
  const list = (Array.isArray(children) ? children : [children]).filter(
    (s) => !!s
  );
  const dir =
    direction === "LR" ? "row" : direction === "TB" ? "column" : direction;

  const mSize = getSize(mainSize);
  const sSize = getSize(subSize);

  // 容器样式
  const containerStyles: React.CSSProperties = {
    display: "flex",
    flexDirection: dir,
    flexWrap: wrap === true ? "wrap" : wrap === false ? "nowrap" : wrap,
    justifyContent: mainAxis,
    alignItems: subAxis,
  };

  // 元素样式 - 计算每个元素之间的边距
  var defaultStyle = {};
  var specialStyle = {};
  var after = "marginRight";
  var before = "marginLeft";
  var subAxis1 = "marginTop";
  var subAxis2 = "marginBottom";
  const specialPos =
    mainAxis === "space-around"
      ? dir === "row" || dir === "column"
        ? 0
        : list.length - 1
      : dir === "row" || dir === "column"
        ? list.length - 1
        : 0;
  switch (dir) {
  case "row": {
    after = "marginRight";
    before = "marginLeft";
    subAxis1 = "marginTop";
    subAxis2 = "marginBottom";
    break;
  }
  case "column": {
    after = "marginBottom";
    before = "marginTop";
    subAxis1 = "marginLeft";
    subAxis2 = "marginRight";
    break;
  }
  case "row-reverse": {
    after = "marginLeft";
    before = "marginRight";
    subAxis1 = "marginTop";
    subAxis2 = "marginBottom";
    break;
  }
  case "column-reverse": {
    after = "marginTop";
    before = "marginBottom";
    subAxis1 = "marginLeft";
    subAxis2 = "marginRight";
    break;
  }
  }

  if (mainAxis === "space-around") {
    defaultStyle = { [after]: mSize, [subAxis1]: sSize, [subAxis2]: sSize };
    specialStyle = {
      [after]: mSize,
      [before]: mSize,
      [subAxis1]: sSize,
      [subAxis2]: sSize,
    };
  } else {
    defaultStyle = { [after]: mSize, [subAxis2]: sSize };
    specialStyle = { [subAxis2]: sSize };
  }

  // 删除为 0 的值
  defaultStyle = ObjectFilter(defaultStyle, (_, value) => value !== 0);
  specialStyle = ObjectFilter(specialStyle, (_, value) => value !== 0);

  return (
    <div
      ref={ref}
      style={{
        ...(fullWidth ? { width: "100%" } : {}),
        ...containerStyles,
        ...style,
      }}
      {...restProps}
    >
      {list.map((child, idx) => (
        <FlexItem
          key={idx}
          style={{
            ...(fullWidth ? { width: "100%" } : {}),
            ...(idx === specialPos ? specialStyle : defaultStyle),
            ...itemStyle,
          }}
        >
          {child}
        </FlexItem>
      ))}
    </div>
  );
};

export declare type FlexItemProps = ComponentProps<{}>;
const FlexItem: React.FC<FlexItemProps> = (props) => {
  var { style = {}, className = "", children, ...restProps } = props;
  var child: any = children;
  if (!!!child) {
    return null;
  }
  const key = child.key;

  if (
    !Array.isArray(child) &&
    !!child.type &&
    !!child.type.name &&
    child.type.displayName === FlexItem.displayName
  ) {
    const {
      style: style2,
      className: className2,
      children: child2,
      ...restProps2
    } = child.props as FlexItemProps;
    style = { ...style, ...style2 };
    className = [className, className2].filter((s) => s !== "").join(" ");
    child = child2;
    restProps = { ...restProps, ...restProps2 };
  }

  return (
    <div key={key} style={style} className={className} {...restProps}>
      {child}
    </div>
  );
};
FlexItem.displayName = "FlexItem";

export const Flex = Object.assign(
  React.forwardRef<HTMLDivElement, FlexProps>(FlexComponent),
  {
    Item: FlexItem,
  }
);
