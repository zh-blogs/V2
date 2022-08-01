import { Result } from "./types";
import { notification } from "antd";

export function showNotification(
  result: Result<any>,
  showSuccess = false,
): boolean {
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
