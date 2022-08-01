import LokiJS from "lokijs";

import { Blog, UserInfo } from "@/utils";
import { Log } from "@/utils/log";

const log = new Log("数据库", "34");

const autoSaveIntervalInMs = 5 * 60 * 1000; // 5 minutes

export class DatabaseLoki {
  loki?: LokiJS = undefined;
  blogs?: Collection<Blog> = undefined;
  users?: Collection<{}> = undefined;
  intervel: NodeJS.Timeout;

  constructor(path: string) {
    log.log("载入 lokijs 数据库");

    this.loki = new LokiJS(path);
    this.loadDatabaseSync();

    // auto save function
    this.intervel = setInterval(() => {
      this.autoSave();
    }, autoSaveIntervalInMs);
  }

  destroy() {
    log.log("销毁 lokijs 数据库");

    clearInterval(this.intervel);
    if (!!this.loki) {
      this.loki?.close();
    }
  }

  autoSave() {
    log.log("=== 自动保存 开始 ===");

    new Promise((resolve, reject) => {
      if (!!this.loki) {
        this.loki?.saveDatabase((err) => {
          if (!!err) {
            reject(err);
          } else {
            resolve(null);
          }
        });
      }
    })
      .then(() => {
        log.log("=== 自动保存 完成 ===");
      })
      .catch((err) => {
        log.error("=== 自动保存 失败 ===");
        console.error(err);
      })
      .finally(() => {
        log.log("=== 自动保存 结束 ===");
      });
  }

  async loadDatabaseSync() {
    await new Promise((resolve) => this.loki?.loadDatabase({}, resolve));
  }

  getCollection<T extends object>(
    name: string,
    opts?: Partial<CollectionOptions<T>>,
  ): Collection<T> {
    return (
      this.loki?.getCollection<T>(name) ||
      (this.loki?.addCollection<T>(name, opts) as Collection<T>)
    );
  }

  getBlogsCollection(): Collection<Blog> {
    return this.getCollection("blogs", {
      unique: ["id"],
    });
  }

  getUsersCollection(): Collection<UserInfo> {
    return this.getCollection("users", {
      unique: ["token", "login", "id"],
    });
  }

  getSettingsCollection(): Collection<{ key: string; value: any }> {
    return this.getCollection("settings", {
      unique: ["key"],
    });
  }
}

declare module globalThis {
  let loki: DatabaseLoki;
}
export function newLokiCached(path: string) {
  /**
   * using cache in development mode
   * see https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
   */
  if (!globalThis.loki) {
    globalThis.loki = new DatabaseLoki(path);
  } else {
    log.log("使用已连接的 loki 数据库缓存");
  }

  return globalThis.loki;
}
