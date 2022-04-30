export declare type Combine<T, U> = Omit<U, keyof T> & T
export declare type Argument<T> = T extends (arg: infer P) => void ? P : string;
export declare type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
export declare type APIRequest<T> = { [P in keyof T]?: T[P] | string | undefined; }

export declare type Blog = {
    id?: string, // 数据库 ID
    name: string, // 标题
    url: string, // 链接
    tags: string[], // 标签
    sign?: string, // 描述
    feed?: string, // RSS Feed
    status?: string, // 状态
    logo?:string,
    repeat?: boolean, // 是否重复
    enabled?: boolean, // 是否展示
}

export declare type Result<T = undefined> = {
    success: boolean,
    message?: string,
    data?: T,
}

import { CSSProperties, ReactNode } from "react";

type DefaultProps = {
    id?: string;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
};

/**
 * 组件基础类
 */
export declare type ComponentProps<T> = Combine<T, DefaultProps>;

export declare type JSONObject = { [key: string]: string | number | boolean | JSONObject | string[] | number[] | boolean[] | JSONObject[] }



// UserInfo get_user_info api response
export declare type UserInfo = {
	login: string;
	id: number;
	"node_id": string;
	"avatar_url": string;
	"gravatar_id": string;
	url: string;
	"html_url": string;
	"followers_url": string;
	"following_url": string;
	"gists_url": string;
	"starred_url": string;
	"subscriptions_url": string;
	"organizations_url": string;
	"repos_url": string;
	"events_url": string;
	"received_events_url": string;
	type: string;
	"site_admin": boolean;
	name: string;
    company?: string;
	blog: string;
	location: string;
	email: string;
	hireable?: boolean;
	bio: string;
	"twitter_username": string;
	"public_repos": number;
	"public_gists": number;
	followers: number;
	following: number;
	"created_at": string;
    "updated_at": string;
    admin: boolean,
}

export declare type ContextType = {
	setContext: (_: Partial<ContextType>) => void;
	
	layoutClassName: string
	layoutStyle: CSSProperties,
}