# 开发文档

## 开发

项目采用 React 进行实现，将 `data.json` 读入至内存中，每次存在修改操作时将会重新写回磁盘进行持久化操作。目前项目主要为读取操作，且数据量较小，采用该方案性能损耗可接受。

所有开发所需的操作可使用 `dev.bash`
```bash
dev.bash zhblogs 开发环境
    pull      拉取镜像到本地
    install   安装依赖到本地
    dev       进入开发模式
    lint      格式化
    test      执行测试
    build     构建生产环境镜像
    push      推送镜像
```

关键代码位置
- `components/antd`: 对于 Ant Design 的二次封装
- `components/flex`: 基于 Flex 的布局组件
- `components/index`: 首页相关的 tab
- `components/layout`: 基本布局组件
- `db`: 数据库文件，需要自己建立，并参考部署部分进行配置
- `pages`: 页面前端
- `pages/api`: 后端接口，实际操作位于 `utils/backend`
- `utils/backend`: 后端操作，封装了对于内存中存储的 `data.json` 的操作
- `utils/api.ts`: 前端支持的 api 列表（详见下文）
 


## 部署

### 配置文件

项目数据维护在内存中，只有修改操作会持久化至磁盘。需要首先建立 `db` 文件夹用于存储一些必备的数据
- `data.json`: 基本数据库，可以通过访问 https://zhblogs.ohyee.cc/api/blogs?size=-1&status=0 获取
- `setting.json`: 一些后台配置文件，分别包含 Github 密钥、管理员 ID
    ```json
    {
        "CLIENT_ID": "0b3ce1913158fcd11d1a",
        "REDIRECT_URI": "https://zhblogs.ohyee.cc/api/user/github_connect",
        "CLIENT_SECRET": "xxxx",
        "admin": [
            13498329,
            30341059,
            49336598,
            51087760,
            64068446,
            78479629,
            79007796
        ]
    }
    ```

### 启动

项目采用 Docker 部署，可以直接使用最新的 Docker 镜像进行部署

Docker 镜像将会被提交至 [Docker Hub](https://hub.docker.com/r/ohyee/zhblogs) 及 [Github Package](https://github.com/zh-blogs/blog-daohang/pkgs/container/zhblogs)


可参考如下脚本启动项目
```bash
#!/bin/bash

ContainerID=$(docker ps -f name=zhblogs | sed -n "2p" | tr -s " " | cut -f 1 -d " ")

if [[ -n ${ContainerID} ]]; then
    docker stop ${ContainerID} && \
    docker rm ${ContainerID}
fi

docker run \
    -d \
    --restart=always \
    -p 8183:3000 \
    -v $HOME/docker/zhblogs/:/app/db/ \
    --name=zhblogs \
    ghcr.io/zh-blogs/zhblogs:latests
```

## 应用程序接口列表

参见[中文博客列表导航项目应用程序接口](https://www.apifox.cn/apidoc/project-1355504/doc-1144392)。
