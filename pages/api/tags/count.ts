import { getTagsWithCount } from "@/utils/api";
import wrapper from "@/utils/backend/api";

import DB from "@/utils/backend/db";

export default wrapper<typeof getTagsWithCount>(
  async (_, req) => {
    if (req.method === "GET") {
      return await DB.getTagsWithCount({});
    } 
    
    return { "success": false, "message": "Method not allowed" };
  }
);