/***
中文博客列表导航 https://zhblogs.ohyee.cc/
作者：Github @OhYee
使用 MIT License 进行许可
2022年3月23日
***/
async function getBlogList() {
  const resp = await fetch('/data.json');
  const data = await resp.json();
  var set = {};

  const domainExtract = RegExp('https{0,1}://([-a-zA-Z0-9.]+)/{0,1}.*');

  var blogs = [];
  for (const blog of data) {
    const domainResult = domainExtract.exec(blog.url);
    const domain = domainResult.length > 0 ? domainResult[1] : blog.url;
    if (typeof set[domain] === 'undefined') {
      // 该域名不存在
      set[domain] = blogs.length;
      blogs.push({ ...blog, domain });
    } else {
      // 该域名已经存在
      // 在第一次出现的位置添加重复标记
      blogs[set[domain]].repeat = true;
      blogs.push({ ...blog, repeat: true, domain });
    }
  }

  // 添加序号
  return blogs.map((blog, index) => ({
    ...blog,
    tags: !!blog.tag ? blog.tag.split(',').map((tag) => tag.toLowerCase()) : [],
    index,
  }));
}
