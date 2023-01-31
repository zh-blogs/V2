import router from "next/router";
import React from "react";

import {
  Card,
  Alert,
  Typography,
  notification,
  Input,
  InputProps,
  FormInstance,
} from "antd";
import { v4 as uuid } from "uuid";

import { Button, Form, FormItemProps } from "@/components/antd";
import { Flex } from "@/components/flex";

import {
  getDomain,
  shouldString,
  showNotification,
  Blog,
  Combine,
} from "@/utils";
import { getBlogs, getTags, addBlog, blogAnalysis } from "@/utils/api";

function AutoFill(props: Combine<{ form?: FormInstance<Blog> }, InputProps>) {
  const { value, form, ...restProps } = props;
  const [loading, setLoading] = React.useState(false);

  return (
    <Flex direction="LR">
      <Flex.Item style={{ flex: "auto" }}>
        <Input {...restProps} value={value} />
      </Flex.Item>
      <Button
        disabled={!value}
        text="一键填写"
        loading={loading}
        onClick={async () => {
          setLoading(true);
          const res = await blogAnalysis({ url: shouldString(value) });
          if (showNotification(res) && !!res.data && !!form) {
            const blog = res.data;
            notification.success({
              message: "获得如下数据",
              description: (
                <ul>
                  {Object.keys(res.data || {}).map((key) => (
                    <li key={key}>{`${key}: ${blog[key as keyof Blog]}`}</li>
                  ))}
                </ul>
              ),
            });
            form.setFieldsValue(res.data);
          }
          setLoading(false);
        }}
      />
    </Flex>
  );
}

export default function AddBlog() {
  const [tags, setTags] = React.useState<string[]>([]);
  const [form] = Form.useForm<Blog>();

  React.useEffect(() => {
    getTags({}).then((resp) => {
      if (!!resp.success && !!resp.data) {
        setTags(resp.data);
      }
    });
  }, []);

  const forms = React.useMemo(
    () =>
      [
        {
          key: "url",
          label: "博客首页",
          required: true,
          placeholder: "贵博客的域名（带http(s)://）",
          render: () => <AutoFill form={form} />,
          rules: [
            {
              validator: async (_, value) => {
                // 判断博客重复
                const resp = await getBlogs({
                  search: getDomain(value),
                  status: 0,
                });
                if (!!resp.success && !!resp.data) {
                  const blogs = resp.data.blogs;
                  const matchBlogs = blogs.filter(
                    (blog) => getDomain(blog.url) === getDomain(value),
                  );
                  if (matchBlogs.length > 0) {
                    return Promise.reject(
                      `该博客已存在, 请勿重复添加。已找到的匹配博客: ${matchBlogs
                        .map((blog) => `${blog.name}(${blog.url})`)
                        .join(",")}`,
                    );
                  }
                }
              },
            },
          ],
        },
        {
          key: "name",
          label: "博客名称",
          required: true,
          placeholder: "贵博客的名称",
        },
        {
          key: "sign",
          label: "博客描述",
          placeholder: "贵博客的一句话描述",
        },
        {
          key: "feed",
          label: "RSS 订阅地址",
          placeholder: "如果可以的话，为我们提供一个 RSS 订阅链接",
        },
        {
          key: "sitemap",
          label: "网站地图",
          placeholder: "如果可以的话，为我们提供一个网站地图",
        },
        {
          key: "arch",
          label: "站点架构",
          required: true,
          placeholder: "贵网站的架构程序，如 Hexo、WordPress 等",
        },
        {
          key: "tags",
          label: "分类",
          select: tags,
          required: true,
          mode: "multiple",
          placeholder: "您选择的内容，将作为管理员的分类参考",
        },
      ] as FormItemProps[],
    [tags, form],
  );

  return (
    <Card>
      <Flex fullWidth direction="TB">
        <Alert
          showIcon
          message="博客收录要求"
          description={
            <div>
              <Typography.Paragraph>
                在收录博客网站时，我们会以非专业的角度评定网站是否符合收录标准，不能排除存在疏漏的可能性。
              </Typography.Paragraph>
              <Typography.Paragraph>
                任何人可以根据博客收录标准对任一博客的收录资格提出异议。
              </Typography.Paragraph>
              <Typography.Paragraph>
                被收录的博客需要满足以下基本要求：
                <ol>
                  <li>符合相关的法律法规</li>
                  <li>
                    是中文网站（在 html 开头声明
                    <Typography.Text code>lang=&quot;zh&quot;</Typography.Text>
                    ）。
                  </li>
                  <li>
                    是博客网站且有 3
                    篇及以上的公开博文（企业官网发布的为了搜索引擎优化的文章不在博文范围内）。
                  </li>
                  <li>
                    具有博客网站的基本属性：
                    <ul>
                      <li>
                        具有主观性和知识积累性，尊重科学、公认事实、约定俗成和伦理道德，在给出依据和尊重他人的前提下挑战权威者除外。
                      </li>
                      <li>
                        具有独立性和自主性，拥有独立域名（可以证明博客使用的域名的所有权，github.io类型除外）。
                      </li>
                      <li>
                        具有交互性，提供评论功能或提供博主的个人联系方式。
                      </li>
                    </ul>
                  </li>
                </ol>
              </Typography.Paragraph>
            </div>
          }
        />
        <Form
          form={form}
          title="博客登记"
          forms={forms}
          validateTrigger="onBlur"
          onFinish={async (values) => {
            const resp = await addBlog({
              blog: {
                id: uuid(),
                name: values.name,
                url: values.url,
                sign: values.sign,
                feed: values.feed,
                status: "unknown",
                tags: values.tags || [],
                repeat: false,
                enabled: false,
                sitemap: values.sitemap,
                arch: values.arch,
                saveweb_id: "",
                recommend: false,
              },
            });
            if (!!resp && !!resp.success) {
              notification.success({
                message: "提交成功",
                description: "请等待管理员审核",
              });
              router.push("/");
            } else {
              notification.error({
                message: "提交失败",
                description: resp.message,
              });
            }
          }}
        />
      </Flex>
    </Card>
  );
}
