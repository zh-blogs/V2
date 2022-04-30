import { Blog, Combine, Result, UnwrapPromise, ComponentProps, APIRequest, UserInfo, ContextType } from "./types";
import { showNotification } from "./notification";
import React from "react";
import { Router, useRouter } from "next/router";
import { makeQuery } from "./api";
import { isServer } from "./env";
import { defaultContext, Context } from './context';


export type { Blog, Combine, Result, UnwrapPromise, ComponentProps, APIRequest, UserInfo, ContextType };
export { showNotification, defaultContext, Context };

/**
 * 筛选出 Object 的特定属性
 * @param obj 要筛选的对象
 * @param callback 筛选回调
 */
export function ObjectFilter<T>(obj: T, callback: (key: keyof T, value: T[keyof T]) => boolean) {
  var ret: Partial<T> = {};
  for (var key in obj) {
    const value = obj[key];
    if (callback(key, value)) {
      ret[key] = value;
    }
  }
  
  return ret;
}

/**
 * 拼接 class 列表，会自动忽略空值
 * @param classList 要拼接的 class 列表
 */
export function classConcat(...classList: string[]) {
  return classList.filter((s) => !!s).join(" ");
}

/**
 * 获取列表首元素
 * @param arr 列表
 * @param defaultValue 列表为空时默认值
 */
export function UnwrapArray<T>(arr: T[] | T, defaultValue: T): T {
  if (arr === undefined || arr === null) {
    return defaultValue;
  }
  if (!Array.isArray(arr)) {
    return arr;
  }
  if (arr.length === 0) {
    return defaultValue;
  }
  
  return arr[0];
}

/**
 * 转换 @value 为数组
 * @param value 值
 */
export function shouldArray<T>(value: T[] | T): T[] {
  if (Array.isArray(value)) {
    return value;
  }
  
  return [value];
}

/**
 * 转换 @value 为数组（使用 @sep 分割
 * @param value 值
 */
export function shouldArraySplit(value: string | string[] | undefined, sep: string = ","): string[] {
  if (!value) {
    return [];
  }
  if (Array.isArray(value)) {
    return value;
  }
  const v = shouldString(value);
  if (!!v) {
    return v.split(sep);
  }
  
  return [];
}

/**
 * 转换 @value 为 number 类型
 * @param value 值
 * @param defaultValue 默认值
 */
export function shouldNumber(value: any, defaultValue: number = 0): number {
  try {
    value = UnwrapArray(value, defaultValue);
    const v = parseInt(value);
    if (isNaN(v)) {
      return defaultValue;
    }
    
    return v;
  } catch (e) {
    return defaultValue;
  }
}

/**
 * 转换 @value 为 string 类型
 * @param value 值
 * @param defaultValue 默认值
 */
export function shouldString(value: any, defaultValue: string = ""): string {
  try {
    value = UnwrapArray(value, defaultValue);
    
    return `${value}`;
  } catch (e) {
    return defaultValue;
  }
}

/**
 * 转换 undefined 或 null
 * @param arr 列表
 * @param defaultValue 列表为空时默认值
 */
export function shouldNotUndefined<T>(value: T | null | undefined, defaultValue: T): T {
  if (value === undefined || value === null) {
    return defaultValue;
  }
  
  return value;
}

/**
 * 将非异步函数异步化
 * @param callback 函数
 */
export function promiselized<T extends (...arg: any) => any>(callback: T): (...args: any[]) => Promise<ReturnType<T>> {
  return (...args: any) => new Promise((resolve) => {
    resolve(callback(...args)); 
  });
}


/**
 * React Hook 带回调的 useState
 * @param defaultState 默认路由参数
 */
function useStateCallback<T>(defaultState: T) {
  const [state, setState] = React.useState(defaultState);
  const cbRef = React.useRef<TypeStateCallback<T>>(() => { });

  const setStateCallback = React.useCallback((state: T, callback?: TypeStateCallback<T>) => {
    if (!!callback) {
      cbRef.current = callback;
    } else {
      cbRef.current = () => { };
    }

    setState(state);

  }, []);

  React.useEffect(() => {
    if (!!cbRef.current) {
      cbRef.current(state);
      cbRef.current = () => { };
    }
  }, [state]);

  return [state, setStateCallback] as [T, SetStateCallbackAction<T>];
}
export declare type TypeStateCallback<T> = (state?: T) => void
export declare type SetStateCallbackAction<T> = (state: T, callback?: TypeStateCallback<T>) => void

/**
 * React Hook 绑定路由参数
 * @param defaultState 默认路由参数
 */
export function useQuery(defaultState?: TypeQuery) {
  const router = useRouter();
  const [query, setQuery] = useStateCallback<TypeQuery>({
    ...defaultState,
    ...router.query,
  });
  const callbackRef = React.useRef<SetStateCallbackAction<TypeQuery>>(() => { });

  const setQueryCallbackRef = React.useRef<setQueryCallback>();
  React.useEffect(() => {
    setQueryCallbackRef.current = (newQuery: TypeQuery, callback?: SetStateCallbackAction<TypeQuery>) => {
      var url = new URL(window.location.href);

      var hrefQuery: { [key: string]: string } = {};
      url.searchParams.forEach((value, key) => {
        hrefQuery[key] = value;
      });

      const afterUpdate = {
        ...hrefQuery,
        ...query,
        ...newQuery,
      };
      if (!isEqual(query, afterUpdate)) {
        setQuery(afterUpdate);
        url.search = makeQuery(afterUpdate);
        history.replaceState("", "", url.toString());
      }

      if (!!callback) {
        callbackRef.current = callback;
      } else {
        callbackRef.current = () => { };
      }
    }, [query, setQuery, callbackRef];
  }, [query, setQuery]);

  const setQueryCallback = React.useCallback((newQuery: TypeQuery, callback?: SetStateCallbackAction<TypeQuery>) => {
    if (!!setQueryCallbackRef.current) {
      setQueryCallbackRef.current(newQuery, callback);
    }
  }, [setQueryCallbackRef]);

  React.useEffect(() => {
    if (!!callbackRef.current) {
      callbackRef.current(query);
    }
    callbackRef.current = () => { };
  }, [query]);

  return [query, setQueryCallback] as [
        TypeQuery,
        SetStateCallbackAction<TypeQuery>
    ];
}
declare type TypeQuery = { [key: string]: string | string[]|undefined };
declare type setQueryCallback = (_: TypeQuery, __?: SetStateCallbackAction<TypeQuery>) => void

/**
 * 获取地址栏的请求参数
 */
function getHrefQuery() {
  if (typeof window !== 'undefined') {
    var url = new URL(window.location.href);

    var hrefQuery: { [key: string]: string } = {};
    url.searchParams.forEach((value, key) => {
      hrefQuery[key] = value;
    });
  
    return hrefQuery;
  }
  
  return {};
}

/**
 * 判断两个变量是否相同
 * @param a 变量
 * @param b 变量
 * @return 是否相同
 */
export function isEqual(a: any, b: any) {
  if (a === b) {
    return true;
  }
  if (a === undefined || b === undefined) {
    return false;
  }
  if (a === null || b === null) {
    return false;
  }
  if (a.constructor !== b.constructor) {
    return false;
  }
  if (typeof a === "object") {
    if (Object.keys(a).length !== Object.keys(b).length) {
      return false;
    }
    for (var key in a) {
      if (!isEqual(a[key], b[key])) {
        return false;
      }
    }
    
    return true;
  }
  
  return false;
}


/**
 * 防抖，停止调用 ms 毫秒后才执行 callback
 * @param callback 回调函数
 * @param ms 毫秒
 * @param key 唯一标识
 */
export function waitDone(callback: () => void, ms: number, key: string) {
  const id = (waitMap[key] || 0) + 1;
  waitMap[key] = id;
  setTimeout(() => {
    if (id === waitMap[key]) {
      callback();
      delete waitMap[key];
    }
  }, ms);
}
const waitMap: { [key: string | number]: number } = {};


/**
 * 获取 @url 的 host 部分
 * @param url 域名
 * @return host
 */
export function getDomain(url: string): string {
  const result = domainExtract.exec(url);
  
  return !!result && result.length > 0 ? result[1] : url;
}

const domainExtract = RegExp("https{0,1}://([-a-zA-Z0-9.]+)/{0,1}.*");
