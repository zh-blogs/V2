# 中文博客列表导航项目 v2 向后端进发！☺

![forks](https://img.shields.io/github/forks/zh-blogs/blog-daohang) ![starts](https://img.shields.io/github/stars/zh-blogs/blog-daohang) ![license](https://img.shields.io/github/license/zh-blogs/blog-daohang)
## Version 2
很早以前，技术组开发出了博客在线提交功能。各位站长可以在 https://zhblogs.ohyee.cc/manager/join/ 直接提交自己的博客网站。       


## 这个项目是什么？
我们这个项目立志要链接全部的中文独立博客（做中文博客的全集）。    
本项目的在线地址是 https://zhblogs.ohyee.cc/ ，你可以直接在网页中点击链接进行串门，也可以根据列表调查中文独立博客的共性。        
各位大佬可以从 https://zhblogs.ohyee.cc/go 随机访问博客。          
为了更好地获取来源博客（相关博客推荐功能正在开发），请各位站长将指向本导航的链接换为`https://zhblogs.ohyee.cc/?from=你的博客域名`，例如`https://zhblogs.ohyee.cc/?from=www.yayu.net`。 
我们并没有强制站长添加链接，以上是指对站长自愿添加的链接的建议。   
我们之后会向上游库提交它们没有收录的博客网站，互通有无。（一些有附带条件的上游库，比如`十年之约`，我们将不会提交）

## 项目如何发现博客？
1. 根据超链接，我们可以从种子博客中找到十多个不等的网站地址，这些地址中符合要求的会自动成为新的种子博客。理论上来说，博主不需要提交网址，就能被我们发现。  
2. 我们同时也会使用一些上游库。


## 如何支持该项目？
1. 如果网站名称或地址出现更换或博客失效，请提个 Issue。        
2. 可以为本项目做宣传，让更多人知道本项目。         
3. 程序员可以帮忙实现本项目的功能目标，也可以加入我们共同维护地址库，代码类事务目前交由 @OhYee 进行管理。   

## 博客收录标准是什么？
1. 是中文网站（在 html 开头声明`lang="zh"`[^1]）。
2. 是博客网站[^2]且有3篇及以上的公开博文（企业官网发布的为了搜索引擎优化的文章不在博文范围内[^3]）。
3. 具有博客网站的基本属性：
    1. 具有主观性和知识积累性，尊重科学、公认事实、约定俗成和伦理道德，在给出依据和尊重他人的前提下挑战权威者除外。
    2. 具有独立性和自主性，拥有独立域名（可以证明博客使用的域名的所有权，github.io类型除外）。
    3. 具有交互性，提供评论功能或提供博主的个人联系方式。

在收录博客网站时，我们会以非专业的角度评定网站是否符合收录标准，不能排除存在疏漏的可能性。      
任何人可以根据博客收录标准对任一博客的收录资格提出异议。

注：“内容农场”、“资源分享站”不在本项目收录范围内。

## 博客网站还需要注意什么细节？
为了方便程序和人工维护列表，请各位网站修一下下面的细节：
1. 在头部用link标签指向rss（在导航栏用一个rss图标链接也行），或通过告诉我们你使用的网站程序让我们尝试该程序默认的feed地址。（一些没声明的网站我们会用/feed,/atom.xml去试。您的声明是有些订阅器查找feed地址的基石）
2. 用generator元数据标签告诉我们你的网站使用的程序（不需要版本号）。 

[^1]: 在实际操作中，我们有遇到错标成en的博客，我们也会将其收录。（我们会尝试向站长发送邮件建议站长修正）
[^2]: 根据浙江大学李恒的硕士学位论文《博客写作行为影响因素研究》，博客是个人新型的网络出版和交流工具。它是一个个人网站，不同的博客站点可通过链接建立联系．博客的内容由众多个性化表达的帖子组成，不同的帖子按照时间先后倒序排列，帖子的形式可以是文字、影音、图片或链接，或多种形式的结合。对于组织(群体)博客(如情侣博客、团体博客和企业博客)，本项目也会将其送至项目组讨论。
[^3]: 因为一些原因，一些博客需要经过项目组讨论，例如 https://github.com/zh-blogs/blog-daohang/issues/9 。  

## 本仓库有关文档

[规范文档](https://github.com/zh-blogs/zh-blogs-documentation)

[开发文档](doc/develop.md)

## 合法声明

本项目全体成员均在中华人民共和国境内，本项目网站面向中华人民共和国用户开设，本项目遵守中华人民共和国法律。        
本项目会尽可能降低对博客网站的影响，如果您的服务器在接受每月一次的正常访问后都会宕机，请尽快向我方说明。       
本项目的标签、一句话简介、网站名称均为人工收集，所有信息不涉及文章*具体*内容。（网站标签是对网站大部分文章的概括）       
如果您有任何合法需求，可以在 Issue 中说明。

## 一些有重要意义的 Commit

https://github.com/zh-blogs/blog-daohang/commit/bde53f7d5d1a2e9928ee6773d9c4ddb1154e9079     
https://github.com/zh-blogs/blog-daohang/commit/53c3003bdc13ceaee566c04b0ec11f8d02ca5fe3     
https://github.com/zh-blogs/blog-daohang/commit/45d876aa53ba1e9d6bf38eec320b8eaab76d123c      
https://github.com/zh-blogs/blog-daohang/commit/188349a609d53a1b16652f3bfabd8157dcbdaabb      

## 开往下一个博客网站
<details><summary>链接示例</summary>

```html
<a href="https://zhblogs.ohyee.cc/go/">前往下一个博客</a>
```

此处的`href`值可以根据站长的需要修改，例如改成`https://zhblogs.ohyee.cc/go?tag=生活`即可指定跳转到生活博客，改成`https://zhblogs.ohyee.cc/go?search=林林杂语`即可指定跳转的博客。
</details>

<details><summary>PHP 代码示例</summary>

```php
<?php
$url = "https://zhblogs.ohyee.cc/api/blogs/random?n=1";
$json = file_get_contents($url);
$data = json_decode($json,true);
$goname = $data["data"][0]["name"];
$gourl = $data["data"][0]["url"];
?>
```
这里已经将网站名称和网站链接存成`$goname`和`$gourl`变量了，等会再用`<?php echo $goname; ?>`之类的嵌套在自己喜欢的 HTML 代码里面。这段代码的`$url`也可以自定义，详见【HTML+JavaScript 代码示例】。
</details>
