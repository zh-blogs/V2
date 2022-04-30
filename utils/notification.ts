import { notification } from "antd";
import { Result } from "./types";

export function showNotification(result: Result<any>, showSuccess: boolean = false): boolean {
  if (!result.success) {
    notification.error({
      message: result.success,
      description: result.message,
    });
    
    return false;
  } else if (showSuccess) {
    notification.success({
      message: result.success,
      description: result.message,
    });
  }
  
  return true;
}
