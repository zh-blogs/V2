import { getTags } from "@/utils/api";
import wrapper from "@/utils/backend/api";

import DB from "@/utils/backend/db";

export default wrapper<typeof getTags>(
  async (_, req) => {
    if (req.method === "GET") {
      return await DB.getTags({});
    } 
    
    return { "success": false, "message": "Method not allowed" };
  }
);