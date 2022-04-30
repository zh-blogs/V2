import { shouldNumber, shouldString, shouldArraySplit } from "@/utils";
import { getBlogs } from "@/utils/api";
import wrapper from "@/utils/backend/api";

import DB from "@/utils/backend/db";

export default wrapper<typeof getBlogs>(
  async (args, req) => {
    if (req.method === "GET") {
      return await DB.getBlogs({
        search: shouldString(args.search, ""),
        tags: shouldArraySplit(args.tags),
        offset: shouldNumber(args.offset, 0),
        size: shouldNumber(args.size, -1),
        status: shouldNumber(args.status, 1) as 0|1|-1,
      });
    } 
    
    return { "success": false, "message": "Method not allowed" } ;
        
  }
);


