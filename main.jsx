(function () {
  const PageSize = 20;

  const urlCache = new URL(window.location);
  const setURLQuery = (key, value) => {
    urlCache.searchParams.set(key, value);
    history.replaceState('', '', urlCache.toString());
  };
  const getURLQuery = (key) => {
    return urlCache.searchParams.get(key);
  };

  const classConcat = (classList) => classList.filter((c) => !!c).join(' ');

  const FlexItem = (props) => {
    var { style = {}, className = '', children, ...restProps } = props;
    var child = children;
    if (!!!child) return null;
    const key = child.key;

    if (
      !Array.isArray(child) &&
      !!child.type &&
      !!child.type.name &&
      child.type.displayName === FlexItem.displayName
    ) {
      const {
        style: style2,
        className: className2,
        children: child2,
        ...restProps2
      } = child.props;
      style = { ...style, ...style2 };
      className = [className, className2].filter((s) => s != '').join(' ');
      child = child2;
      restProps = { ...restProps, ...restProps2 };
    }

    return (
      <div key={key} style={style} className={className} {...restProps}>
        {child}
      </div>
    );
  };
  FlexItem.displayName = 'FlexItem';

  const FlexComponent = (props) => {
    const {
      direction = 'LR',
      wrap = true,
      mainSize = 'middle',
      subSize = 0,
      mainAxis = 'space-between',
      subAxis = 'center',
      itemStyle = {},
      fullWidth = false,
      children,
      style,
      ...restProps
    } = props;

    const getSize = React.useCallback((size) => {
      return size === 'large'
        ? 20
        : size === 'middle'
        ? 10
        : size === 'small'
        ? 5
        : size === 'none'
        ? 0
        : size;
    }, []);
    const ObjectFilter = React.useCallback((obj, callback) => {
      var ret = {};
      for (var key in obj) {
        const value = obj[key];
        if (callback(key, value)) {
          ret[key] = value;
        }
      }
      return ret;
    }, []);

    const list = (Array.isArray(children) ? children : [children]).filter(
      (s) => !!s
    );
    const dir =
      direction === 'LR' ? 'row' : direction === 'TB' ? 'column' : direction;

    const mSize = getSize(mainSize);
    const sSize = getSize(subSize);

    // 容器样式
    const containerStyles = {
      display: 'flex',
      flexDirection: dir,
      flexWrap: wrap === true ? 'wrap' : wrap === false ? 'nowrap' : wrap,
      justifyContent: mainAxis,
      alignItems: subAxis,
    };

    // 元素样式 - 计算每个元素之间的边距
    var defaultStyle = {};
    var specialStyle = {};
    var after = 'marginRight';
    var before = 'marginLeft';
    var subAxis1 = 'marginTop';
    var subAxis2 = 'marginBottom';
    const specialPos =
      mainAxis === 'space-around'
        ? dir === 'row' || dir === 'column'
          ? 0
          : list.length - 1
        : dir === 'row' || dir === 'column'
        ? list.length - 1
        : 0;
    switch (dir) {
      case 'row': {
        after = 'marginRight';
        before = 'marginLeft';
        subAxis1 = 'marginTop';
        subAxis2 = 'marginBottom';
        break;
      }
      case 'column': {
        after = 'marginBottom';
        before = 'marginTop';
        subAxis1 = 'marginLeft';
        subAxis2 = 'marginRight';
        break;
      }
      case 'row-reverse': {
        after = 'marginLeft';
        before = 'marginRight';
        subAxis1 = 'marginTop';
        subAxis2 = 'marginBottom';
        break;
      }
      case 'column-reverse': {
        after = 'marginTop';
        before = 'marginBottom';
        subAxis1 = 'marginLeft';
        subAxis2 = 'marginRight';
        break;
      }
    }

    if (mainAxis === 'space-around') {
      defaultStyle = { [after]: mSize, [subAxis1]: sSize, [subAxis2]: sSize };
      specialStyle = {
        [after]: mSize,
        [before]: mSize,
        [subAxis1]: sSize,
        [subAxis2]: sSize,
      };
    } else {
      defaultStyle = { [after]: mSize, [subAxis2]: sSize };
      specialStyle = { [subAxis2]: sSize };
    }

    // 删除为 0 的值
    defaultStyle = ObjectFilter(defaultStyle, (_, value) => value != 0);
    specialStyle = ObjectFilter(specialStyle, (_, value) => value != 0);

    return (
      <div
        style={{
          ...(fullWidth ? { width: '100%' } : {}),
          ...containerStyles,
          ...style,
        }}
        {...restProps}
      >
        {list.map((child, idx) => (
          <FlexItem
            key={idx}
            style={{
              ...(fullWidth ? { width: '100%' } : {}),
              ...(idx === specialPos ? specialStyle : defaultStyle),
              ...itemStyle,
            }}
          >
            {child}
          </FlexItem>
        ))}
      </div>
    );
  };

  const Flex = Object.assign(FlexComponent, { Item: FlexItem });

  function Pagination(props) {
    const {
      page,
      totalPage,
      prePage = () => {},
      nextPage = () => {},
      firstPage = () => {},
      lastPage = () => {},
    } = props;
    return (
      <nav>
        <ul className='pagination justify-content-center'>
          <li
            className={classConcat([
              'page-item',
              page <= 1 ? 'disabled' : undefined,
            ])}
          >
            <a
              type='button'
              className='btn btn-outline-dark'
              onClick={firstPage}
            >
              &laquo;
            </a>
          </li>
          <li
            className={classConcat([
              'page-item',
              page <= 1 ? 'disabled' : undefined,
            ])}
          >
            <a type='button' className='btn btn-outline-dark' onClick={prePage}>
              &lt;
            </a>
          </li>
          <li className='page-item'>
            <span style={{ lineHeight: '2em', padding: '0 1em' }}>
              第 {page} 页 / 共 {totalPage} 页
            </span>
          </li>
          <li
            className={classConcat([
              'page-item',
              page >= totalPage ? 'disabled' : undefined,
            ])}
          >
            <a
              type='button'
              className='btn btn-outline-dark'
              onClick={nextPage}
            >
              &gt;
            </a>
          </li>
          <li
            className={classConcat([
              'page-item',
              page >= totalPage ? 'disabled' : undefined,
            ])}
          >
            <a
              type='button'
              className='btn btn-outline-dark'
              onClick={lastPage}
            >
              &raquo;
            </a>
          </li>
        </ul>
      </nav>
    );
  }

  function BlogItem(props) {
    const { blog } = props;
    return (
      <tr className={!!blog.repeat ? 'repeat' : ''}>
        <td>
          <span
            style={{
              fontWeight: 'bold',
              color: blog.status === 'OK' ? 'green' : 'red',
            }}
          >
            {blog.status === 'OK' ? '✓' : blog.status}
          </span>
        </td>
        <td>{blog.name}</td>
        <td>{blog.sign}</td>
        <td>
          <a href={blog.url} hreflang='zh' target='_blank' type='text/html'>
            {blog.url}
          </a>
        </td>
        <td>
          <Flex mainAxis='start' style={{ maxWidth: '50vw' }}>
            {blog.tags.map((tag) => (
              <BlogTag key={tag} tag={tag} />
            ))}
          </Flex>
        </td>
        <td>{blog.index + 1}</td>
      </tr>
    );
  }

  function BlogTable(props) {
    const defaultPage = React.useMemo(() => {
      var page = 1;
      try {
        page = parseInt(getURLQuery('page'));
      } catch (e) {
        page = 1;
      }
      if (page < 1) page = 1;
      return page;
    }, []);

    const { blogs } = props;
    const [page, setPage] = React.useState(defaultPage);
    const totalPage = React.useMemo(
      () => Math.ceil(blogs.length / PageSize),
      [blogs]
    );

    React.useEffect(() => {
      setURLQuery('page', page);
    }, [page]);

    const showBlogs = React.useMemo(
      () => blogs.slice((page - 1) * PageSize, page * PageSize),
      [blogs, page]
    );

    return (
      <div>
        <table className='table table-bordered table-responsive'>
          <thead>
            <tr className='header'>
              <th>状态</th>
              <th>博客名称</th>
              <th>博客描述</th>
              <th>博客地址</th>
              <th>标签</th>
              <th>结果序号</th>
            </tr>
          </thead>
          <tbody>
            {showBlogs.map((blog) => (
              <BlogItem key={blog.index} blog={blog} />
            ))}
          </tbody>
        </table>
        <Pagination
          page={page}
          totalPage={totalPage}
          firstPage={() => setPage(1)}
          prePage={() => setPage(page > 1 ? page - 1 : 1)}
          nextPage={() => setPage(page < totalPage ? page + 1 : totalPage)}
          lastPage={() => setPage(totalPage)}
        />
      </div>
    );
  }

  function Search(props) {
    const { value, onChange } = props;
    return (
      <Flex direction='LR'>
        <Flex.Item style={{ flex: 'auto' }}>
          <input
            type='text'
            id='search'
            class='search form-control autocomplete'
            placeholder='输入博客名称或博客网址筛选博客网站'
            autocomplete='off'
            list='blogs'
            value={value}
            onChange={onChange}
          />
          <datalist id='blogs'>
            <option value='博客推荐功能正在测试' />
          </datalist>
        </Flex.Item>
        <a
          class='btn btn-primary blogJump'
          role='button'
          href='/go.html'
          target='_blank'
        >
          博客随机跳转
        </a>
      </Flex>
    );
  }

  function BlogTag(props) {
    const { tag, onClick, onClose } = props;
    const types = React.useMemo(
      () => [
        'bg-primary',
        'bg-secondary',
        'bg-success',
        'bg-danger',
        'bg-warning text-dark',
        'bg-info text-dark',
        'bg-light text-dark',
        'bg-dark',
      ],
      []
    );
    return (
      <span
        className={classConcat([
          'badge',
          types[
            (Array.from(tag)
              .map((c) => c.charCodeAt())
              .reduce((a, b) => (a * 7 + b * 13) % types.length) +
              17) %
              types.length
          ],
        ])}
        onClick={() => {
          if (!!onClick) onClick(tag);
        }}
        style={{ cursor: !!onClick ? 'pointer' : 'unset' }}
      >
        {tag}
        {!!onClose && (
          <span
            onClick={() => onClose(tag)}
            style={{ marginLeft: '0.5em', cursor: 'pointer' }}
          >
            ×
          </span>
        )}
      </span>
    );
  }

  function TagCloud(props) {
    const {
      blogs,
      selectedTags = {},
      onSelect = () => {},
      onRemove = () => {},
    } = props;

    const allTagsSet = React.useMemo(() => {
      var set = new Set();
      for (var blog of blogs) for (var tag of blog.tags) set.add(tag);
      return set;
    }, [blogs]);

    const selected = React.useMemo(() => {
      return Array.from(Object.keys(selectedTags));
    }, [selectedTags]);

    const unselected = React.useMemo(() => {
      const set = new Set(allTagsSet);
      for (var tag of selected) {
        set.delete(tag);
      }
      return Array.from(set);
    }, [allTagsSet, selected]);

    console.log(selected, unselected);

    return (
      <Flex fullWidth direction='TB'>
        <Flex mainAxis='start'>
          {selected.map((tag) => (
            <BlogTag tag={tag} onClose={onRemove} />
          ))}
        </Flex>
        <Flex mainAxis='start'>
          {unselected.map((tag) => (
            <BlogTag tag={tag} onClick={onSelect} />
          ))}
        </Flex>
      </Flex>
    );
  }

  function Home() {
    const defaultSearch = React.useMemo(() => getURLQuery('search') || '', []);
    const defaultTags = React.useMemo(() => getURLQuery('tags') || '', []);

    const [loading, setLoading] = React.useState(false);
    const [blogs, setBlogs] = React.useState([]);
    const [search, setSearch] = React.useState(defaultSearch);
    const [selectedTags, setSelectedTags] = React.useState(
      defaultTags === ''
        ? {}
        : defaultTags
            .split(',')
            .reduce((pre, cur) => ({ ...pre, [cur]: 1 }), {})
    );

    React.useEffect(() => {
      setLoading(true);
      getBlogList()
        .then((blogs) => setBlogs(blogs))
        .finally(() => {
          setLoading(false);
        });
    }, [setLoading, setBlogs]);

    React.useEffect(() => {
      setURLQuery('search', search);
    }, [search]);

    React.useEffect(() => {
      setURLQuery('tags', Object.keys(selectedTags).join(','));
    }, [selectedTags]);

    // 筛选
    const blogsForShow = React.useMemo(() => {
      const tags = Object.keys(selectedTags);
      return blogs.filter(
        (blog) =>
          (search === '' ||
            blog.name.toLowerCase().indexOf(search) !== -1 ||
            blog.url.toLowerCase().indexOf(search) !== -1) &&
          (tags.length === 0 ||
            tags.filter((tag) => blog.tags.indexOf(tag) != -1).length ===
              tags.length)
      );
    }, [blogs, selectedTags, search]);

    return (
      <Flex direction='TB' fullWidth>
        <Search
          value={search}
          onChange={(e) => {
            if (!!e && !!e.target) setSearch(e.target.value.toLowerCase());
          }}
        />
        <TagCloud
          blogs={blogs}
          selectedTags={selectedTags}
          onSelect={(tag) => {
            setSelectedTags({ ...selectedTags, [tag]: 1 });
          }}
          onRemove={(tag) => {
            delete selectedTags[tag];
            console.log(selectedTags);

            setSelectedTags({ ...selectedTags });
          }}
        />
        {!!loading ? (
          <div class='d-flex justify-content-center'>
            <div class='spinner-border' role='status'>
              <span class='visually-hidden'>Loading...</span>
            </div>
          </div>
        ) : !!blogs && blogs.length > 0 ? (
          <BlogTable blogs={blogsForShow} />
        ) : (
          <div className='alert alert-info alert-dismissible fade show'>
            <strong>抱歉</strong>我们没能搜索到符合条件的博客。你可以尝试
            <a href='https://github.com/linlinzzo/blog-daohang/issues/new?assignees=linlinzzo&labels=&template=add.md&title=%E7%94%B3%E8%AF%B7%E6%B7%BB%E5%8A%A0%E7%BD%91%E7%AB%99'>
              提交它
            </a>
            。
          </div>
        )}
      </Flex>
    );
  }

  ReactDOM.hydrate(<Home />, document.getElementById('react'));
})();
