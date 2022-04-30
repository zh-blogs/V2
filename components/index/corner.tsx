import { GithubOutlined } from "@ant-design/icons";
import styles from "./index.module.scss";

export function Cornor() {
  return (
    <div className={styles.corner_wrapper}>
      <a
        href="https://github.com/zh-blogs/blog-daohang"
        className={styles.corner}
      >
        <GithubOutlined style={{ marginRight: "0.5em" }} /> Fork me on Github
      </a>
    </div>
  );
}
