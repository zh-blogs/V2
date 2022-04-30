import React from "react";
import {
  Typography,
  Form as AntdForm,
  FormProps as AntdFormProps,
  Input,
  InputProps,
  DatePicker,
  DatePickerProps,
  Button,
} from "antd";
import { Rule } from "antd/lib/form";
import { TextAreaProps } from "antd/lib/input";
import { RangePickerProps } from "antd/lib/date-picker";

import { Select, SelectProps, SelectOption } from "./select";
import { Loading } from "./loading";
import { Combine } from "@/utils";

export declare type FormProps<T = any> = Combine<
  {
    forms: FormItemProps<T>[];
    record?: T;
    loading?: boolean;
    title?: React.ReactNode;
    noSubmit?: boolean;
  },
  AntdFormProps
>;

export declare type FormItemProps<T = any> = Combine<
  {
    key: string;
    label: string;
    default?:
      | string
      | number
      | ((item: FormItemProps<T>, record: T) => string | number);

    rules?: Rule[];
    mutiline?: boolean | number;
    readonly?: boolean;
    select?: SelectOption[];
    datePicker?: boolean;
    rangePicker?: boolean;
    render?: (record: T) => React.ReactNode;
    required?: boolean;
  },
  InputProps | TextAreaProps | SelectProps | DatePickerProps | RangePickerProps
>;

function FormComponent<T = any>(props: FormProps<T>) {
  const {
    forms,
    title,
    loading = false,
    record = {} as T,
    noSubmit = false,
    ...restProps
  } = props;
  const initialValues = React.useMemo(
    () =>
      forms
        .filter((item) => !!item && !!item.default)
        .reduce(
          (pre, cur) => ({
            ...pre,
            [cur.key]:
              typeof cur.default === "function"
                ? cur.default(cur, record)
                : cur.default,
          }),
          {}
        ),
    [forms, record]
  );

  return (
    <Loading loading={loading}>
      {!!title && (
        <Typography.Paragraph
          strong
          style={{ textAlign: "center", fontSize: "1.25em", margin: "0.5em" }}
        >
          {title}
        </Typography.Paragraph>
      )}
      <AntdForm
        name="basic"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        autoComplete="off"
        initialValues={initialValues}
        {...restProps}
      >
        {forms
          .filter((item) => !!item)
          .map((ipt) => {
            var {
              key,
              label,
              rules = [],
              mutiline: multiline,
              readonly,
              select,
              datePicker,
              rangePicker,
              render,
              required: require = false,
              default: _,
              ...restProps
            } = ipt;
            if (!!require) {
              rules.push({ required: true, message: `${label}不能为空` });
            }
            
            return (
              <AntdForm.Item key={key} name={key} label={label} rules={rules}>
                {!!render ? (
                  render(record)
                ) : !!multiline ? (
                  <Input.TextArea
                    disabled={!!readonly}
                    rows={multiline !== true ? multiline : undefined}
                    {...(restProps as TextAreaProps)}
                  />
                ) : !!select ? (
                  <Select
                    showSearch
                    disabled={!!readonly}
                    options={select}
                    {...(restProps as SelectProps)}
                  />
                ) : !!datePicker ? (
                  <DatePicker
                    disabled={!!readonly}
                    {...(restProps as DatePickerProps)}
                  />
                ) : !!rangePicker ? (
                  <DatePicker.RangePicker
                    disabled={!!readonly}
                    {...(restProps as RangePickerProps)}
                  />
                ) : (
                  <Input disabled={!!readonly} {...(restProps as InputProps)} />
                )}
              </AntdForm.Item>
            );
          })}
        {!noSubmit && (
          <AntdForm.Item
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            style={{ textAlign: "right" }}
          >
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              // style={{ float: 'right' }}
            >
              提交
            </Button>
          </AntdForm.Item>
        )}
      </AntdForm>
    </Loading>
  );
}

export const Form = Object.assign(FormComponent, { useForm: AntdForm.useForm });
