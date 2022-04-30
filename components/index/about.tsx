export function AboutTab() {
  return (
    <div>
      <p>
        我们尝试链接几乎所有的中文博客，并使用这个地址库不定期为中文博客存档。
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
    </div>
  );
}
