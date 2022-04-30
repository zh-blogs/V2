import fs from "fs";

import { Blog, getDomain, shouldString } from "@/utils";

export class Database {
  path: string = "";
  blogs: Blog[] = [];
  tags: string[] = [];

  constructor(path: string) {
    console.log("初始化数据库");
    this.path = path;
    this.read();
  }

  async read() {
    try {
      console.log("[数据库] 开始读入");
      const _blogs = JSON.parse((await fs.readFileSync(this.path)).toString("utf8"));
      var set: { [key: string]: number | undefined } = {};
      var tagSet = new Set<string>();
      var idx = 1;

      var blogs: Blog[] = [];
      for (const blog of _blogs) {
        const domain = getDomain(blog.url);
        const curBlog = {
          id: shouldString(blog.id, ""),
          idx:idx++,
          name: blog.name,
          url: blog.url,
          tags: !!blog.tags? blog.tags:!!blog.tag ? blog.tag.toLowerCase().split(",") : [],
          sign: shouldString(blog.sign, ""),
          feed: shouldString(blog.feed, ""),
          status: `${blog.status}`,
          repeat: false,
          enabled: !!blog.enabled
        };

        for (const tag of curBlog.tags) {
          tagSet.add(tag);
        }

        if (typeof set[domain] === "undefined") {
          // 该域名不存在
          set[domain] = _blogs.length;
          blogs.push(curBlog);
        } else {
          // 该域名已经存在
          // 在第一次出现的位置添加重复标记
          blogs.push({
            ...curBlog,
            repeat: true,
          });
        }
      }

      this.blogs = blogs;
      this.tags = Array.from(tagSet);

      console.log(`[数据库] 读入 ${this.blogs.length} 篇文章, ${this.tags.length} 个标签`);
    } catch (error) {
      console.error(error);
      throw (error);
    }
  }

  async write() {
    try {
      await fs.writeFileSync(this.path, JSON.stringify(this.blogs, undefined, 2));
      console.log("[数据库] 写出至文件");
      await this.read();
    } catch (error) {
      console.error(error);
      throw (error);
    }
  }
};


