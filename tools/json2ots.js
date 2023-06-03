const TableStore = require('tablestore');
const fs = require('fs');
const path = require('path');

(async () => {
  const {
    OTS_ACCESS_KEY_ID,
    OTS_SECRET_ACCESS_KEY,
    OTS_ENDPOINT,
    OTS_INSTANCE_NAME,
    OTS_STS_TOKEN,
  } = JSON.parse(
    (
      await fs.readFileSync(path.join(path.resolve('.'), 'db', 'setting.json'))
    ).toString('utf8')
  );

  const client = new TableStore.Client({
    accessKeyId: OTS_ACCESS_KEY_ID,
    secretAccessKey: OTS_SECRET_ACCESS_KEY,
    stsToken: OTS_STS_TOKEN,
    endpoint: OTS_ENDPOINT,
    instancename: OTS_INSTANCE_NAME,
  });

  const old = fs.readFileSync('db/data.json');
  const json = JSON.parse(old.toString('utf-8'));
  const _blogs = json.data.blogs;

  // blogs 拆封成 100 个一组
  const blogsArr = [];
  for (let i = 0; i < _blogs.length; i += 100) {
    blogsArr.push(_blogs.slice(i, i + 100));
  }

  for (const blogs of blogsArr) {
    console.log(
      await client.batchWriteRow({
        tables: [
          {
            tableName: 'blogs',
            rows: blogs.map((blog) => ({
              type: 'PUT',
              condition: new TableStore.Condition(
                TableStore.RowExistenceExpectation.IGNORE,
                null
              ),
              primaryKey: [{ id: blog.id }],
              attributeColumns: [
                'idx',
                'name',
                'url',
                'tags',
                'sign',
                'feed',
                'status',
                'repeat',
                'enabled',
                'sitemap',
                'arch',
                'join_time',
                'update_time',
                'saveweb_id',
                'recommend',
              ].map((k) => ({
                [k]: Array.isArray(blog[k]) ? blog[k].join(',') : blog[k],
              })),
              returnContent: { returnType: TableStore.ReturnType.Primarykey },
            })),
          },
        ],
      })
    );
  }
})();
