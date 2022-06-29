export function AboutTab() {
  return (
    <div>
      <h2>介绍</h2>
      <p>
        我们尝试链接几乎所有的中文博客，并使用这个地址库不定期为中文博客存档。
      </p>
      <p>
        您可以在 {" "}
        <a href="https://github.com/zh-blogs/zh-blog-database/tree/main/database" type="text/html">
          zh-blogs/zh-blog-database
        </a>
        {" "} 中找到本项目中的所有博客信息, 数据每日更新。
      </p>
      <p>
        我们的 Github 仓库地址是{" "}
        <a href="https://github.com/zh-blogs/blog-daohang" type="text/html">
          zh-blogs/blog-daohang
        </a>
        。如果想为本项目贡献一份力量，可以通过 Github
        联系我们。如果想让我们收录你的网站，可以在本项目的 Github 仓库中提交
        issue。
      </p>
      <p>
        由于我们刚开始博客网站的收集工作，一些博客还未收录，你可以向我们提供未收录的博客地址以便我们改进，也可以去别的导航项目，也许你会发现更多。
      </p>
      <ul className="nav">
        <li className="nav-item">
          <a
            className="nav-link"
            href="https://seekbetter.me/"
            hrefLang="zh"
            type="text/html"
          >
            寻我 | 优秀个人独立博客收录
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            href="https://github.com/timqian/chinese-independent-blogs"
            hrefLang="zh"
            type="text/html"
          >
            中文独立博客列表
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            href="http://www.jetli.com.cn/"
            hrefLang="zh"
            type="text/html"
          >
            优秀个人独立博客导航
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            href="https://blorg.cn/"
            hrefLang="zh"
            type="text/html"
          >
            博客联盟
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            href="https://bf.zzxworld.com/"
            hrefLang="zh"
            type="text/html"
          >
            BlogFinder - 发现优秀的个人博客
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            href="https://www.foreverblog.cn/"
            hrefLang="zh"
            type="text/html"
          >
            十年之约
          </a>
        </li>
      </ul>
      <h2>合法声明</h2>
      <p>根据《中华人民共和国网络安全法》，本项目给出如下声明：<br />我们在发现其网络服务存在安全缺陷、漏洞等风险时，会立即采取补救措施。您可以在<a href="https://github.com/zh-blogs/blog-daohang/issues/new?assignees=Mabbs%2C+OhYee%2C+soxft&labels=&template=bug.md&title=Bug%E5%8F%8D%E9%A6%88-%5B%E6%8F%8F%E8%BF%B0%E6%BC%8F%E6%B4%9E%5D">我们的 github 仓库</a></p>
    </div>
  );
}
