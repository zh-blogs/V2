import { shouldString, shouldArraySplit, shouldNumber } from "@/utils";
import { getArchCharts } from "@/utils/api";
import wrapper from "@/utils/backend/api";
import DB from "@/utils/backend/db";

const topLevelDomainExtractor =
  /^(?:.*\:\/\/){0,1}((?:[^\.\/\:]+\.)+([^\.\/\:]+))(?:\:\d+){0,1}(?:\/.*)*$/;
const specificTopLevelDomain = ["github.io"];

export default wrapper<typeof getArchCharts>(async (args, req) => {
  if (req.method === "GET") {
    const result = await DB.getBlogs({
      search: shouldString(args.search, ""),
      tags: shouldArraySplit(args.tags),
      status: shouldNumber(args.status, 1) as 0 | 1 | -1 | 2,
    });
    if (!!result.success && !!result.data) {
      const countMap: { [key: string]: number } = {};
      for (const blog of result.data.blogs) {
        const domain = shouldString(blog.url).toLowerCase();
        const result = topLevelDomainExtractor.exec(domain);
        if (!!result) {
          let wholeDomain = result[1];
          let topLevelDomain = result[2];
          for (const sepDomain of specificTopLevelDomain) {
            if (wholeDomain.endsWith(sepDomain)) {
              topLevelDomain = sepDomain;
              break;
            }
          }

          countMap[topLevelDomain] = (countMap[topLevelDomain] || 0) + 1;
        } else {
          console.error(`parse domain ${domain} error, ${result}`);
        }
      }

      const arr = Object.keys(countMap).map((domainSuffix) => {
        return {
          name: domainSuffix,
          count: countMap[domainSuffix],
        };
      });

      return { success: true, data: arr };
    }

    return { success: result.success, message: result.message };
  }

  return { success: false, message: "Method not allowed" };
});
