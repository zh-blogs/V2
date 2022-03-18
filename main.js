function BlogList(app, data) {
  this.app = app;
  this.data = data;
  this.table = data;
  this.page = 0;
  this.search = '';
  const PageSize = 20;
  const PageAround = 3;

  function setElements(el, callback) {
    try {
      if (!!el) {
        Array.from(el).map(callback);
      } else {
        console.log('error', el);
      }
    } catch (e) {
      console.error(e);
    }
  }

  function waitDOMRender(callback) {
    setTimeout(callback, 100);
  }

  this.generateItem = (item, idx) => {
    return `<tr${!!item.repeat ? ' class="repeat"' : ''}>
    <td>${item.name}</td>
    <td><a href="${item.url}" hreflang="zh" target="_blank" type="text/html">${
      item.url
    }</a></td>
    <td>${item.index + 1}</td>
</tr>`;
  };

  this.generatePage = (curPage, totalPage) => {
    var pageList = new Array(PageAround * 2 + 1)
      .fill(0)
      .map((_, idx) => curPage - PageAround + idx)
      .filter((item) => item >= 0 && item < totalPage);
    // 补全 1 ~ curPage - PageAround
    if (pageList.length >= 1 && pageList[0] >= 1) {
      if (pageList[0] > 1) {
        pageList = [0, -1].concat(pageList);
      } else {
        pageList = [0].concat(pageList);
      }
    }
    // 补全 curPage + Page Around ~ totalPage
    if (
      pageList.length >= 1 &&
      pageList[pageList.length - 1] <= totalPage - 2
    ) {
      if (pageList[pageList.length - 1] < totalPage - 2) {
        pageList = pageList.concat([-1, totalPage - 1]);
      } else {
        pageList = pageList.concat([totalPage - 1]);
      }
    }
    // 补全 上一页 下一页
    pageList = [-3].concat(pageList).concat([-2]);

    const content = pageList
      .map((item) =>
        item === -3
          ? `<button type='button' class='btn btn-outline-dark prePage' ${
              curPage === 0 ? 'disabled' : ''
            }><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-compact-left" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M9.224 1.553a.5.5 0 0 1 .223.67L6.56 8l2.888 5.776a.5.5 0 1 1-.894.448l-3-6a.5.5 0 0 1 0-.448l3-6a.5.5 0 0 1 .67-.223z"/>
</svg></button>`
          : item === -2
          ? `<button type='button' class='btn btn-outline-dark nextPage' ${
              curPage === totalPage - 1 ? 'disabled' : ''
            }><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-compact-right" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M6.776 1.553a.5.5 0 0 1 .671.223l3 6a.5.5 0 0 1 0 .448l-3 6a.5.5 0 1 1-.894-.448L9.44 8 6.553 2.224a.5.5 0 0 1 .223-.671z"/>
</svg></button>`
          : item === -1
          ? `<div>...</div>`
          : `<button type='button' class='btn btn-outline-dark jump${
              item === curPage ? ' active' : ''
            }'>${item + 1}</button>`
      )
      .reduce((pre, cur) => pre + cur);
    return `<div class="container"><div class="page">
  ${content}    
</div></div>`;
  };
  this.generateList = () => {
    const total = this.table.length;
    const totalPage = Math.ceil(total / PageSize);
    if (this.page < 0) this.pge = 0;
    if (this.page >= totalPage) this.pge = totalPage - 1;
    const curPageStart = this.page * PageSize;

    if (this.table.length === 0) {
      return `<div class="alert alert-success alert-dismissible fade show">
  <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  <strong>抱歉</strong>我们没能搜索到符合条件的博客。你可以尝试<a href="https://github.com/linlinzzo/blog-daohang/issues/new?assignees=linlinzzo&labels=&template=add.md&title=%E7%94%B3%E8%AF%B7%E6%B7%BB%E5%8A%A0%E7%BD%91%E7%AB%99">提交它</a>。
</div>`;
    }

    const content = this.table
      .slice(curPageStart, curPageStart + PageSize)
      .map((item, idx) => this.generateItem(item, idx + curPageStart + 1))
      .reduce((pre, cur) => pre + cur);
    return `<table class="table">
    <tr class="header">
        <th>博客名称</th>
        <th>博客地址</th>
        <th>结果序号</th>
    </tr>
    ${content}
  </table>
  ${this.generatePage(this.page, totalPage)}`;
  };

  this.renderTable = () => {
    setElements(
      this.app.getElementsByClassName('container_table'),
      (el) => (el.innerHTML = this.generateList())
    );

    waitDOMRender(() => {
      // 等待 DOM 刷新
      setElements(
        this.app.getElementsByClassName('prePage'),
        (el) =>
          (el.onclick = (e) => {
            if (!!e && !!e.target && !e.target.disabled) {
              this.page--;
              this.renderTable();
            }
          })
      );
      setElements(
        this.app.getElementsByClassName('nextPage'),
        (el) =>
          (el.onclick = (e) => {
            if (!!e && !!e.target && !e.target.disabled) {
              this.page++;
              this.renderTable();
            }
          })
      );
      setElements(
        this.app.getElementsByClassName('jump'),
        (el) =>
          (el.onclick = (e) => {
            if (!!e && !!e.target) {
              this.page = parseInt(e.target.innerText) - 1;
              this.renderTable();
            }
          })
      );
    });
  };

  this.render = () => {
    waitDOMRender(() => this.renderTable());
  };

  this.render();

  waitDOMRender(() => {
    setElements(
      this.app.getElementsByClassName('search'),
      (el) =>
        (el.onkeyup = (e) => {
          if (!!e && !!e.target) {
            const value = e.target.value.trim().toLowerCase();
            // this.search = value;
            if (value === '') {
              this.table = this.data;
            } else {
              this.table = this.data.filter(
                (item) =>
                  item.name.toLowerCase().indexOf(value) !== -1 ||
                  item.url.toLowerCase().indexOf(value) !== -1
              );
            }
            // 输入框修改时，回到第一页
            this.page = 0;
            this.renderTable();
          }
        })
    );
  });
}

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

  console.log(blogs);
  // 添加序号
  return blogs.map((blog, index) => ({ ...blog, index }));
}

function main() {
  getBlogList().then((data) => {
    const app = document.getElementById('app');
    const blog = new BlogList(app, data);
  });
}
