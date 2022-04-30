import { makeQuery } from "@/utils/api";
import { UserInfo } from '@/utils';
import { v4 as uuid } from 'uuid';
import { NextApiRequest, NextApiResponse } from 'next';

import fs from 'fs';
import path from 'path';

import DB from "@/utils/backend/db";

var CLIENT_ID = "";
var REDIRECT_URI = "";
var CLIENT_SECRET = "";

(async () => {
  ({ CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = JSON.parse((await fs.readFileSync(
    path.join(path.resolve("."), "db", "setting.json")
  )).toString("utf8")));
}) ();

/*
LoginPage 返回跳转的登录页面，需要传入一个随机的 state 用于验证身份
https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/
*/
function getLoginURL(state: string, signedUser: boolean, scope :string[]): string {
  return `https://github.com/login/oauth/authorize?${makeQuery({
    "client_id": CLIENT_ID,
    "redirect_uri":REDIRECT_URI,
    "scope": scope.join(" "),
    state: state,
    "allow_signup": signedUser?"true":"false",
  })}`;
}

/*
Auth 根据登录回调页面返回的 code 获取用户 token
https://wiki.connect.qq.com/%E4%BD%BF%E7%94%A8authorization_code%E8%8E%B7%E5%8F%96access_token
*/
async function auth(code:string, state :string):Promise<string> {
  const resp = await fetch(
    `https://proxy.ohyee.cc/https://github.com/login/oauth/access_token?${makeQuery({
      "client_id":CLIENT_ID,
      "client_secret": CLIENT_SECRET,
      "code": code,
      "redirect_uri": REDIRECT_URI,
      "state": state,
    })}`
  );

  const result = new URLSearchParams(await resp.text());
  const token = result.get("access_token");
  if (!!token) {
    return token;
  }
  console.error(result.toString());
  
  return "";
}

/*
获取用户信息
*/
async function getInfo(token :string): Promise<UserInfo> {
  const resp = await fetch("https://proxy.ohyee.cc/https://api.github.com/user", {
    headers: {
      'Authorization':`token ${token}`
    }
  });
  
  const info = await resp.json(); 
  const resp2 = await fetch(`https://proxy.ohyee.cc/https://api.github.com/orgs/zh-blogs/members/${info.name}`);  
    
  return { ...info, admin: resp2.status !== 404 };
}


export default async function github_login(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  var args : {code?:string, state?:string, from ?:string}= req.query;
  console.log(args);
    
  if (req.method === "GET") {
    if (!!args.code && !!args.state) {
      // 携带鉴权信息，获取 token
      const token = await auth(args.code, args.state);
      console.log("token", token);
      const info = await getInfo(token);
      console.log("info", info);

      const frontToken = uuid();
      DB.setUser({ token: frontToken, info });
  
      res.writeHead(302, {
        Location: args.state,
        "Set-Cookie": `token=${frontToken}; Path=/; Max-Age=${60 * 60 * 24 * 7}`,
      });
      res.end();
    } else {
      // 未携带鉴权信息，跳转至 Github 登录
      const url = getLoginURL(!!args.from ? args.from : "/", true, []);
      console.log("login from", !!args.from ? args.from : "/" );
      res.writeHead(302, {
        Location: url,
      });
      res.end();
    }
  } else {
    res.status(200).json({ "success": false, "message": "Method not allowed" });
  }
    
  return;
};