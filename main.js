function myFunction() {
  // 声明变量
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById('myInput');
  filter = input.value.toUpperCase();
  table = document.getElementById('myTable');
  tr = table.getElementsByTagName('tr');

  // 循环遍历所有列表项，并隐藏那些与搜索查询不匹配的项
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName('td')[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = '';
      } else {
        tr[i].style.display = 'none';
      }
    }
  }
}

function BlogList(app, data) {
  this.app = app;
  this.data = data;
  this.page = 0;
  const PageSize = 10;
  const PageAround = 3;

  function setOnClick(el, callback) {
    try {
      if (!!el) {
        Array.from(el).map((e) => {
          e.onclick = callback;
        });
      } else {
        console.log('error', el);
      }
    } catch (e) {
      console.error(e);
    }
  }
  this.renderItem = (item, idx) => {
    return `<tr>
    <td>${item.name}</td>
    <td><a href="${item.url}" hreflang="zh" target="_blank">${item.url}</a></td>
    <td>${idx}</td>
</tr>`;
  };

  this.renderPage = (curPage, totalPage) => {
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
  this.renderList = (data) => {
    const total = data.length;
    const totalPage = Math.ceil(total / PageSize);
    if (this.page < 0) this.pge = 0;
    if (this.page >= totalPage) this.pge = totalPage - 1;
    const curPageStart = this.page * PageSize;

    const content = data
      .slice(curPageStart, curPageStart + PageSize)
      .map((item, idx) => this.renderItem(item, idx + curPageStart + 1))
      .reduce((pre, cur) => pre + cur);
    return `<p>您可以在下面的输入框里输入博客名称来搜索博客。</p>
    <input type="text" id="myInput" onkeyup="myFunction()" value="" />
    <table id="myTable">
    <tr class="header">
        <th>博客名称</th>
        <th>博客地址</th>
        <th>博客序号</th>
    </tr>
    ${content}
  </table>
  ${this.renderPage(this.page, totalPage)}`;
  };
  this.render = (data) => {
    this.app.innerHTML = this.renderList(data);
    setTimeout(() => {
      // 等待 DOM 刷新
      setOnClick(this.app.getElementsByClassName('prePage'), (e) => {
        if (!!e && !!e.target && e.target.className.indexOf('disable') === -1) {
          this.page--;
          this.render(data);
        }
      });
      setOnClick(this.app.getElementsByClassName('nextPage'), (e) => {
        if (!!e && !!e.target && e.target.className.indexOf('disable') === -1) {
          this.page++;
          this.render(data);
        }
      });
      setOnClick(this.app.getElementsByClassName('jump'), (e) => {
        if (!!e && !!e.target) {
          this.page = parseInt(e.target.innerText) - 1;
          this.render(data);
        }
      });
    }, 100);
  };

  this.render(data);
}

function main() {
  fetch('/data.json')
    .then((resp) => resp.json())
    .then((data) => {
      const app = document.getElementById('app');
      const blog = new BlogList(app, data);
    });
}

main();
