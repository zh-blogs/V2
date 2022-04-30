import { Tag as AntdTag } from "antd";

export declare type TagProps = {
  tag: string;
  onClick?: (tag: string) => void;
  onClose?: (tag: string) => void;
};

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
    (Array.from(id)
      .map((c) => c.charCodeAt(0))
      .reduce((a, b) => (a * 7 + b * 13) % colorArrs.length) +
      17) %
      colorArrs.length
  ];
}

export function Tag(props: TagProps) {
  const { tag, onClick, onClose } = props;

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
      style={{ cursor: !!onClick ? "pointer" : "unset" }}
    >
      {tag}
    </AntdTag>
  );
}
