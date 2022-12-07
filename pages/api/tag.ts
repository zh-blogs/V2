import { shouldString, Result } from "@/utils";
import wrapper from "@/utils/backend/api";

import DB from "@/utils/backend/db";
import { checkPermission } from "@/utils/backend/permission";

export default wrapper<((_:{token?:string, tag?:string, newTag?:string})=>Promise<Result<any>>)>(
  async (args, req) => {
    if (req.method === 'POST' && !!args.tag && !!args.newTag) {
      if (!await checkPermission(shouldString(args.token))) { 
        return { "success": false, "message": "You do not has permission" };
      }
      
      return await DB.renameTag({
        tag: shouldString(args.tag),
        newTag: shouldString(args.newTag),
      });
    } else if (req.method === 'DELETE' && args.tag) { 
      if (!await checkPermission(shouldString(args.token))) { 
        return { "success": false, "message": "You do not has permission" };
      }
      
      return await DB.deleteTag({
        tag: shouldString(args.tag),
      });
    }
    
    return { "success": false, "message": "Method not allowed" };
  }
);


