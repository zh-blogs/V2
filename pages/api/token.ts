import { shouldString } from "@/utils";
import { getUserInfo } from "@/utils/api";
import wrapper from "@/utils/backend/api";
import DB from "@/utils/backend/db";

export default wrapper<typeof getUserInfo>(
  async (args, req) => {
    if (req.method === "GET") {
      return DB.getUser({ token: shouldString(args.token) });
    }  
    
    return { "success": false, "message": "Method not allowed" };
  }
);