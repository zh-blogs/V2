// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { testApi } from '@/utils/api';
import wrapper from '@/utils/backend/api';
import db from '@/utils/backend/db';

export default wrapper<typeof testApi>(
  async(args, req) => {
    if (req.method === 'GET') {
      db.DB.save();
      
      return {
        success: true,
      };
    }
    
    return { success: false, message: 'Method not allowed' };
  }
);
