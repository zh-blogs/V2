#!/bin/bash

BaseImage=node:16-alpine
ZhBlogsImage=ohyee/zhblogs
DockerImage=ghcr.io/zh-blogs/zhblogs

function func_run_docker() {
    docker run \
        -p 3000:3000 \
        --rm \
        -it \
        -e NEXT_MANUAL_SIG_HANDLE=true \
        -v $(pwd):/data \
        --workdir /data \
        ${BaseImage} \
        $@
}

function func_build_image() {
    if [[ "$(LANG=en-US.UTF-8 git status | grep 'nothing to commit' | wc -l)" -eq "1" ]]; then
        Commit=$(git rev-parse --short HEAD)
        echo $Commit
        docker build -t ${ZhBlogsImage}:${Commit} .
        echo "镜像: ${ZhBlogsImage}:${Commit}"

        backendLatest="$(echo $backendImage | cut -d ":" -f 1):latest"
        
    else
        echo "存在未提交的更改，请提交后再构建镜像"
    fi
}

function func_push_image() {
    Commit=$(git rev-parse --short HEAD)
    echo "最新版本: ${Commit}"
    docker tag ${ZhBlogsImage}:${Commit} ${ZhBlogsImage}:latest
    docker push ${ZhBlogsImage}:${Commit}
    docker push ${ZhBlogsImage}:latest

    docker tag ${ZhBlogsImage}:${Commit} ${DockerImage}:${Commit}
    docker tag ${ZhBlogsImage}:${Commit} ${DockerImage}:latest
    docker push ${DockerImage}:${Commit}
    docker push ${DockerImage}:latest
}

function func_help() {
    echo "$0 zhblogs 开发环境"
    echo "    pull      拉取镜像到本地"
    echo "    install   安装依赖到本地"
    echo "    dev       进入开发模式"
    echo "    lint      格式化"
    echo "    test      执行测试"
    echo "    build     构建生产环境镜像"
    echo "    push      推送镜像"
}

if [ $# -eq "0" ]; then
    func_help
else
    case $1 in
        "pull")     docker pull ${BaseImage};;
        "install")  func_run_docker yarn install --frozen-lockfile;;
        "dev")      func_run_docker yarn dev;;
        "lint")     func_run_docker yarn lint;;
        "test")     func_run_docker yarn mocha;;
        "build")    func_build_image;;
        "push")     func_push_image;;
        
        *)          func_help    ;;
    esac
fi
