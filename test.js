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

  var {
    search,
    tags,
    offset,
    size,
    status = 1,
  } = {
    search: 'ohyee',
    tags: [],
    offset: 0,
    size: 0,
    status: 0,
  };

  const queries = [];
  const searchQuery = {
    offset: 0,
    limit: 100,
    query: { queryType: TableStore.QueryType.BOOL_QUERY, query: {} },
    getTotalCount: true,
  };

  if (!!offset) {
    searchQuery.offset = offset;
  }
  if (!!size && size > 0) {
    searchQuery.limit = size;
  }
  if (!!search) {
    queries.push({
      queryType: TableStore.QueryType.BOOL_QUERY,
      query: {
        shouldQueries: [
          {
            queryType: TableStore.QueryType.WILDCARD_QUERY,
            query: { fieldName: 'name', value: `%${search.toLowerCase()}%` },
          },
          {
            queryType: TableStore.QueryType.WILDCARD_QUERY,
            query: { fieldName: 'url', value: `%${search.toLowerCase()}%` },
          },
        ],
        minimumShouldMatch: 1,
      },
    });
  }

  if (status === 1) {
    queries.push({ query: { fieldName: 'enabled', term: true } });
  } else if (status === -1) {
    queries.push({ query: { fieldName: 'enabled', term: false } });
  } else if (status === 2) {
    queries.push({ query: { fieldName: 'recommend', term: true } });
  }

  if (!!tags && tags.length > 0) {
    queries.push({
      queryType: TableStore.QueryType.BOOL_QUERY,
      query: {
        shouldQueries: tags.map((tag) => ({
          queryType: TableStore.QueryType.WILDCARD_QUERY,
          query: { fieldName: 'name', text: `%${tag}%` },
        })),
        minimumShouldMatch: 1,
      },
    });
  }

  const searchParams = {
    tableName: 'blogs',
    indexName: 'blogs_index',
    searchQuery: {
      ...searchQuery,
      query: {
        queryType: TableStore.QueryType.BOOL_QUERY,
        query: { mustQueries: queries },
      },
    },
    columnToGet: { returnType: TableStore.ColumnReturnType.RETURN_ALL },
  };

  console.log(JSON.stringify(searchParams, null, 2));
  const resp = await client.search(searchParams);

  console.log(resp);
})();
