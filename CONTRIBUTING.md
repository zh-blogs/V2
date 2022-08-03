# 参与贡献

## 代码贡献

1. Fork 并 close 仓库至本地

```
git clone git@github.com:YOUR_GITHUB_USERNAME/blog-daohang.git
```

2. 为新特性或 Issue 创建一个语义化分支

```
git checkout -b your-meaningful-branch-name
```

3. 安装依赖

```bash
pnpm install
```

4. 启动本地开发服务器

```bash
pnpm run dev
```

5. 确保无 Lint 报错 (建议在编辑器中添加 Eslint 插件)

```bash
pnpm run lint
```

6. 格式化代码 (建议在编辑器中添加 Prettier 插件)

```bash
pnpm run format
```

7. 确保构建成功

```bash
pnpm run build
```

8. 发布分支

```
git push -u origin your-meaningful-branch-name
```

9. 切换分支并提交 Pull Request

## API

见 [API 接口文档](/API.md)
