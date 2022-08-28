import cheerio from "cheerio";

import { Blog } from "@/utils";
import { blogAnalysis } from "@/utils/api";
import wrapper from "@/utils/backend/api";

const rssPath = [
  "/rss.xml",
  "/rss2.xml",
  "/atom.xml",
  "/feed.xml",
  "/index.xml",
  "/feed.php",
  "/rss.php",
  "/rss2.php",
  "/atom.php",
  "/feed",
  "/atom",
  "/rss",
  "/rss2",
  "/feed/atom",
  "/feed/rss",
  "/feed/rss2",
];
const sitemapPath = ["/sitemap.xml", "/sitemap.txt"];

async function getFirstURL(
  url: string,
  paths: string[],
): Promise<string | undefined> {
  const res = (
    await Promise.all(
      paths.map(async (item) => {
        const rssURL = `${url.replace(/\/$/, "")}${item}`;
        const rssResp = await fetch(rssURL);
        return rssResp.status == 200 ? rssURL : "";
      }),
    )
  ).filter((item) => !!item);

  return res.length > 0 ? res[0] : undefined;
}

function matchText($: cheerio.Root, regexp: RegExp): string | undefined {
  var res: string[] = [];
  $("*").map((_, e) => {
    const arr = [...$(e).text().matchAll(regexp)];
    if (!!arr)
      arr.map((item) => {
        if (item.length > 1) res.push(item[1]);
      });
  });
  return res.length > 0 ? res[0] : undefined;
}

export default wrapper<typeof blogAnalysis>(async (args, req) => {
  const url = args.url;
  if (req.method === "GET" && !!url) {
    const resp: Response = await fetch(url);
    const html = await resp.text();
    const $ = cheerio.load(html);

    const blog = {
      success: true,
      data: {
        name: $("title").text().trim(),
        sign: $("meta[name=description]").attr("content"),
        feed: await getFirstURL(url, rssPath),
        sitemap: await getFirstURL(url, sitemapPath),
        arch: matchText($, /powered by ([0-9a-zA-Z\-_=\.]+)/gi),
      } as Blog,
    };
    console.log(url, blog);

    return blog;
  }

  return { success: false, message: "Method not allowed" };
});
