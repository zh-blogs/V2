# 参与贡献

## 代码贡献

1. Fork 并 close 仓库至本地

```
git clone git@github.com:YOUR_GITHUB_USERNAME/blog-daohang.git
```

2. 为新特性或 Issue 创建一个语义化分支

```
git checkout -b your-meaningful-branch-name
```

3. 安装依赖

```bash
pnpm install
```

4. 启动本地开发服务器

```bash
pnpm run dev
```

5. 确保无 Lint 报错 (建议在编辑器中添加 Eslint 插件)

```bash
pnpm run lint
```

6. 格式化代码 (建议在编辑器中添加 Prettier 插件)

```bash
pnpm run format
```

7. 确保构建成功

```bash
pnpm run build
```

8. 发布分支

```
git push -u origin your-meaningful-branch-name
```

9. 切换分支并提交 Pull Request

## 中文博客列表导航 API 接口文档

### 获取信息类接口

本类接口的返回值均为 Json 对象，通式如下：

```json
{
    "success":true,
    "data":[]
}
```
其中，`success`在请求成功时均返回`true`。下文对此不再赘述。

#### 获取博客标签列表

- 请求方法：Get
- 请求地址：https://zhblogs.ohyee.cc/api/tags
- 请求参数：无
- 返回参数：一个 Json 对象。其中`data`键所对应的值为元素为博客标签的数组

该接口的返回示例：

```json
{
    "success":true,
    "data":["综合","Python"]
}
```

与此接口类似的还有能返回具体标签所含博客数量的接口，接口的具体信息如下：

- 请求方法：Get
- 请求地址：https://zhblogs.ohyee.cc/api/tags/count
- 请求参数：无
- 返回参数：一个 Json 对象。其中`data`键所对应的值一个嵌套着对象的数组，这个数组的键值对应如下：

|键|值|
|:---:|:---:|
|tag|博客标签的名称|
|count|该标签所包含的博客数量|

该接口的返回示例：

```json
{
    "success":true,
    "data":[
        {"tag":"综合","count":19},
        {"tag":"Python","count":12}
    ]
}
```

### 获取博客列表数据

- 请求方法：Get
- 请求地址：https://zhblogs.ohyee.cc/api/blogs
- 请求参数：见表2-1
- 返回参数：一个 Json 对象。其中`data`键所对应的值是一个对象，在这个对象中，`total`键的值是目前收录的博客总数，`blogs`键的值是由对象组成的具体的博客数据的数组，博客数据对象的键值对应见表2-2

|键|描述|是否必填|类型|备注|
|:---:|:---:|:---:|:---:|:---:|
|search|筛选博客的关键词|否|string|无|
|tags|筛选博客的标签|否|string|不同标签之间用英文逗号分隔|
|status|筛选博客的状态|否|number|0 全部，1 展示，-1 不展示，2 推荐|
|offset|偏移量|否|number|用于博客的分页展示|
|size|返回博客的个数|否|number|默认为-1，即全量返回|
表2-1 获取博客列表数据的请求参数

|键|描述|示例值|
|:---:|:---:|:---:|
|id|用uuid4算法生成的字符串|`1064f634-f899-4048-8b0d-ce9f124d98b4`|
|idx|表示顺序的数字（非连续）|`1`|
|name|博客网站的名称|`卷土`|
|url|博客网站的网址|`https://juantu.cn/`|
|tags|元素为博客标签的数组|`["综合","Python","科技","杂录"]`|
|sign|博客网站的一句话介绍|`现只为做成一件事`|
|feed|博客网站的订阅地址|`https://juantu.cn/feed`|
|status|废弃字段|`unknown`|
|repeat|指示博客网站是否重复的布尔值|`false`|
|enabled|指示博客网站是否审核通过的布尔值|`true`|
|sitemap|博客网站的网站地图地址|`https://juantu.cn/sitemap.xml`|
|arch|博客网站的架构|`WordPress`|
|join_time|博客网站加入的时间戳|`1651600790154`|
|update_time|博客网站修改的时间戳|`1656416524808`|
|saveweb_id|用于与 saveweb 互链|`896`|
|recommend|指示博客网站是否为推荐博客的布尔值|`false`|
表2-2 获取博客列表数据的返回参数
