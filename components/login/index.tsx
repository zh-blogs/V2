import { useRouter } from "next/router";
import React from "react";

import { GithubOutlined } from "@ant-design/icons";
import Cookie from "js-cookie";

import { Loading, Button } from "@/components/antd";
import { Flex } from "@/components/flex";

import { UserInfo } from "@/utils";
import { getUserInfo } from "@/utils/api";

export const UserInfoContext = React.createContext<UserInfo | undefined>(
  undefined,
);

export function AdminPermission(props: { children: React.ReactNode }) {
  const { children } = props;
  const [token, setToken] = React.useState("");
  const [info, setInfo] = React.useState<UserInfo>();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    const token = Cookie.get("token");
    if (token) {
      getUserInfo({ token: token }).then((resp) => {
        if (!!resp.success && !!resp.data) {
          setToken(token);
          setInfo(resp.data);
        } else {
          setToken("");
        }
      });
    } else {
      setToken("");
    }
    setLoading(false);
  }, [setToken]);

  return (
    <UserInfoContext.Provider value={info}>
      <Loading loading={loading}>
        {!!token && !!info ? (
          info.admin ? (
            children
          ) : (
            <NoPermission />
          )
        ) : (
          <Login />
        )}
      </Loading>
    </UserInfoContext.Provider>
  );
}

function Login() {
  const router = useRouter();

  return (
    <Button
      icon={<GithubOutlined />}
      onClick={() =>
        router.push(`/api/user/github_connect?from=${router.asPath}`)
      }
    >
      使用Github登录
    </Button>
  );
}

function NoPermission() {
  const info = React.useContext(UserInfoContext);

  return (
    <Flex direction="TB">
      {!!info && (
        <p>
          Hi, {info.name}({info.id})。你不是项目组成员，请联系管理员添加权限。
        </p>
      )}

      {!!info && (
        <Flex direction="TB">
          <span>为管理员提供如下信息</span>
          <span>name: {info.name}</span>
          <span>id: {info.id}</span>
          <span>email: {info.email}</span>
          <Button
            text="退出登录"
            onClick={() => {
              Cookie.remove("token");
              window.location.reload();
            }}
          />
        </Flex>
      )}
    </Flex>
  );
}
