import { shouldString, shouldArraySplit, shouldNumber } from "@/utils";
import { getArchCharts } from "@/utils/api";
import wrapper from "@/utils/backend/api";
import DB from "@/utils/backend/db";

declare type ArchDescription = {
  name: string;
  url: string;
  slug: string;
};

declare module globalThis {
  let archDesp: ArchDescription[];
  let archDespDatetime: number;
}

const expired = 5 * 60 * 1000; // 5min

async function getArchDesp() {
  const now = new Date().getTime();
  try {
    if (!globalThis.archDesp || globalThis.archDespDatetime + expired < now) {
      const resp = await fetch(
        "https://proxy.ohyee.cc/raw.githubusercontent.com/zh-blogs/blog-architecture/main/arch.json",
      );
      const archDesp = (await resp.json()).arch;
      globalThis.archDesp = archDesp;
      globalThis.archDespDatetime = now;
      console.log("do request");
    }
  } catch (e) {
    console.error(e);
  }

  return globalThis.archDesp;
}

export default wrapper<typeof getArchCharts>(async (args, req) => {
  if (req.method === "GET") {
    const result = await DB.getBlogs({
      search: shouldString(args.search, ""),
      tags: shouldArraySplit(args.tags),
      status: shouldNumber(args.status, 1) as 0 | 1 | -1 | 2,
    });
    if (!!result.success && !!result.data) {
      const archDesp = await getArchDesp();
      const archMap: { [key: string]: ArchDescription } = {};
      if (Array.isArray(archDesp)) {
        for (const arch of archDesp) {
          archMap[arch.name.toLowerCase()] = arch;
        }
      }

      const countMap: { [key: string]: number } = {};
      for (const blog of result.data.blogs) {
        let arch = shouldString(blog.arch);
        if (arch === "") {
          arch = "other";
        }
        arch = arch.toLowerCase();

        countMap[arch] = (countMap[arch] || 0) + 1;
      }

      const arr = Object.keys(countMap).map((arch) => {
        const desp = archMap[arch.toLowerCase()];

        return {
          name: !!desp ? desp.name : arch,
          count: countMap[arch],
          description: !!desp ? desp.slug : "",
          url: !!desp ? desp.url : "",
        };
      });

      return { success: true, data: arr };
    }

    return { success: result.success, message: result.message };
  }

  return { success: false, message: "Method not allowed" };
});
