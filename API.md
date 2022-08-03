# API 接口

> 请遵守 [RESTful 规范](http://www.ruanyifeng.com/blog/2018/10/restful-api-best-practices.html)

## 获取信息

### 获取博客标签列表

> `GET` /tags

#### 返回

博客标签的数组

```json
["综合", "Python"]
```

### 获取博客列表数据

> `GET` /blogs

#### 请求

|   键   |       描述       | 是否必填 |  类型  |                   备注                    |
| :----: | :--------------: | :------: | :----: | :---------------------------------------: |
| search | 筛选博客的关键词 |    否    | string |                    无                     |
|  tags  |  筛选博客的标签  |    否    | string |        不同标签之间用英文逗号分隔         |
| status |  筛选博客的状态  |    否    | number | `0` 全部，`1` 展示，`-1` 不展示，`2` 推荐 |
| offset |      偏移量      |    否    | number |            用于博客的分页展示             |
|  size  |  返回博客的个数  |    否    | number |          默认为 `-1`，即全量返回          |

#### 返回

```json
{
  "total": 1694,
  "blogs": [
    {
      "id": "1064f634-f899-4048-8b0d-ce9f124d98b4",
      // 表示顺序的数字（非连续）
      "idx": 1,
      // 博客网站的名称
      "name": "卷土",
      // 博客网站的网址
      "url": "https://juantu.cn/",
      // 元素为博客标签的数组
      "tags": ["综合", "Python", "科技", "杂录"],
      // 博客网站的一句话介绍
      "sign": "现只为做成一件事",
      // 博客网站的订阅地址
      "feed": "https://juantu.cn/feed",
      // 废弃字段
      "status": "OK",
      // 指示博客网站是否重复的布尔值
      "repeat": false,
      // 指示博客网站是否审核通过的布尔值
      "enabled": true,
      // 博客网站的网站地图地址
      "sitemap": "https://juantu.cn/sitemap.xml",
      // 博客网站的架构
      "arch": "WordPress",
      // 博客网站加入的时间戳
      "join_time": 1651600790154,
      // 博客网站修改的时间戳
      "update_time": 1656416524808,
      // 用于与 saveweb 互链
      "saveweb_id": "896",
      // 指示博客网站是否为推荐博客的布尔值
      "recommend": false
    }
  ]
}
```
