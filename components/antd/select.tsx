import { Combine } from "@/utils";
import { Select as AntdSelect, SelectProps as AntdSelectProps } from "antd";

export declare type SelectOption = string | { label: string; value: any };

export declare type SelectProps = Combine<
  {
    options?: SelectOption[];
  },
  AntdSelectProps
>;

export function Select(props: SelectProps) {
  const { options = [], ...restProps } = props;
  
  return (
    <AntdSelect
      options={options
        .filter((item) => !!item)
        .map((opt) =>
          typeof opt === "string" ? { label: opt, value: opt } : opt
        )}
      optionFilterProp="label"
      {...restProps}
    />
  );
}
