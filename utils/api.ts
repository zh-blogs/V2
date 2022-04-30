import { shouldString } from ".";
import { isDevelopment } from "./env";
import { Result, Blog, JSONObject, UserInfo } from "./types";
import Cookie from 'js-cookie';

const backendURL = isDevelopment() ? "http://localhost:3000" : "";
const apiPrefix = "/api/";
const apiPath = backendURL.replace(/\/*$/g, "") + apiPrefix;

/**
 * 替换参数到 path 中
 * 如 使用 `{ "id" : 1, "name": "a" }` 替换 `/api/blog/:id` 将返回 `/api/blog/1` 与 `{ "name": "a" }`
 * @returns 返回替换后的 path 及剩余的参数
 */
export function replaceParams<T extends { [key: string]: any }>(path: string, params: T): { path: string, params: Partial<T> } {
  var finalPath = path;
  var p = { ...params };

  if (!!params) {
    Object.keys(params).map((key) => {
      if (params[key] === undefined || params[key] === null) {
        delete p[key];
      } else {
        const varKey = `:${key}`;
        if (finalPath.indexOf(varKey) !== -1) {
          finalPath = finalPath.replace(`:${key}`, params[key]);
          delete p[key];
        }
      }
    });
  }
  
  return {
    path: finalPath,
    params: p,
  };
}

/**
 * 生成 Query 字段
 * @param params 参数
 * @return 返回生成的 Query 字段
 */
export function makeQuery(query: { [key: string]: number | string | string[]|undefined }): string {
  return !!query ? Object.keys(query).map((key) => {
    const k = encodeURIComponent(key);
    const value = query[key];
    if (typeof value === "undefined") {
      return "";
    };
    const v = encodeURIComponent(Array.isArray(value) ? value.join(",") : value);
    
    return `${k}=${v}`;
  }).join("&") : "";
}

export async function sendRequest<T extends JSONObject, U>(method: "get" | "post" | "put" | "delete", path: string, params: Partial<T>): Promise<Result<U>> {
  params = Object.keys(params).reduce((pre, cur) => ({
    ...pre,
    [cur]: !!params[cur] && Array.isArray(params[cur]) ? (params[cur] as string[]).map((item: string) => shouldString(item)).join(",") : params[cur]
  }), {});
  ({ path, params } = replaceParams(path, params));
  console.log(params);
  if (method === "get") {
    path = `${path}?${makeQuery(params as unknown as { [key: string]: number | string })}`;
  }
  try {
    console.log(`${apiPath.replace(/\/*$/g, "")}/${path.replace(/^\/*/g, "")}`);
    const resp = await fetch(`${apiPath.replace(/\/*$/g, "")}/${path.replace(/^\/*/g, "")}`, {
      method,
      body: method !== "get" ? JSON.stringify(params) : undefined,
    });
    const result: Result<U> = await resp.json();
    
    return result;
  } catch (err: any) {
    return {
      success: false,
      message: err.message,
    };
  }

}


// /**
//  * 获取博客总数
//  * @returns 博客总数
//  */
// export async function getBlogCount(params: { search?: string, tags?: string[], all?:boolean }): Promise<Result<number>> {
//   return await sendRequest("get", "/blogs/count", params);
// }

/**
 * 获取博客标签
 * @returns 标签列表
 */
export async function getTags(params: {}): Promise<Result<string[]>> {
  return await sendRequest("get", "/tags", params);
}


/**
 * 获取博客数据
 * @param search 筛选关键字
 * @param tags 筛选标签
 * @param offset 偏移量
 * @param size 返回数目（-1 全量返回）
 * @param status (0 全部 1 展示 -1 不展示)
 * @returns 博客数据
 */
export async function getBlogs(params: { search?: string, tags?: string[], offset?: number, size?: number, status?: 0 | 1 | -1 }): Promise<Result<{ total: number, blogs: Blog[] }>> {
  return await sendRequest("get", "/blogs", params);
}

/**
 * 修改 id 为 @id 的博客数据
 * @param id 博客 ID
 * @param blog 新博客数据
 * @returns 返回修改结果
 */
export async function updateBlog(params: { id: string, blog: Blog }): Promise<Result<null>> {
  const token = Cookie.get("token");
  
  return await sendRequest("post", "/blog", { token, ...params });
}

/**
 * 插入一条新的博客数据
 * @param blog 博客数据
 * @returns 返回插入结果
 */
export async function addBlog(params: { blog: Blog }): Promise<Result<Blog>> {
  const token = Cookie.get("token");
  
  return sendRequest("put", "/blog", { token, ...params });
}

/**
 * 删除 id 为 @id 博客
 * @param id 博客 ID
 * @returns 返回删除结果
 */
export async function deleteBlog(params: { id: string }): Promise<Result<Blog>> {
  const token = Cookie.get("token");

  return sendRequest("delete", "/blog", { token, ...params });
}

/**
 * 获取随机 @n 个博客数据
 * @param search 筛选关键字
 * @param tags 筛选标签
 * @returns 博客数据
 */
export async function getRandomBlogs(params: { search?: string, tags?: string[], n?: number }): Promise<Result<Blog[]>> {
  return await sendRequest("get", "/blogs/random", params);
}

/**
 * 测试接口
 * @param  名称
 * @returns 测试返回
 */
export async function getUserInfo(params: { token?: string }): Promise<Result<UserInfo>> {
  return sendRequest("get", "/token", params); 
}

/**
 * 测试接口
 * @param name 名称
 * @returns 测试返回
 */
export async function testApi(params: { name?: string }): Promise<Result<{ name: string }>> {
  return sendRequest("get", "/hello", params); 
}


