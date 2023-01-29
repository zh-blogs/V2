import { Tag as AntdTag, TagProps as AntdTagProps } from "antd";
import { Combine } from '@/utils/types';

export declare type TagProps =Combine< {
  tag: string;
  onClick?: (tag: string) => void;
  onClose?: (tag: string) => void;
}, AntdTagProps>;

const colorArrs = [
  "magenta",
  "red",
  "volcano",
  "orange",
  "gold",
  "lime",
  "green",
  "cyan",
  "blue",
  "geekblue",
  "purple",
];

export function getColor(id: string) {
  return colorArrs[
    (Array.from(String(id))
      .map((c) => c.charCodeAt(0))
      .reduce((a, b) => (a * 7 + b * 13) % colorArrs.length, 11) +
      17) %
      colorArrs.length
  ];
}

export function Tag(props: TagProps) {
  const { tag, onClick, onClose, style, ...restProps } = props;

  return (
    <AntdTag
      color={getColor(tag)}
      onClick={() => {
        if (!!onClick) {
          onClick(tag);
        }
      }}
      onClose={() => {
        if (!!onClose) {
          onClose(tag);
        }
      }}
      closable={!!onClose}
      style={{ cursor: !!onClick ? "pointer" : "unset", ...style } }
      { ...restProps}
    >
      {tag}
    </AntdTag>
  );
}
