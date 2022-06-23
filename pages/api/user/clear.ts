import wrapper from "@/utils/backend/api";
import { checkPermission } from "@/utils/backend/permission";
import { shouldString, Result } from "@/utils";

import DB from "@/utils/backend/db";

export default wrapper<(_:{token: string})=>Promise<Result<any>>>(
  async (args, req) => {
    if (!await checkPermission(shouldString(args.token))) { 
      return { "success": false, "message": "You do not has permission" };
    }
        
    if (req.method === "GET") {
      return await DB.clearToken();
    } 
    
    return { "success": false, "message": "Method not allowed" };
  }
);