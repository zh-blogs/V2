import React from "react";

import { Typography } from 'antd';
import { Flex } from "@/components/flex";
import { getRandomBlogs } from "@/utils/api";
import { Blog, showNotification, Context, shouldString } from "@/utils";

import styles from "./go.module.scss";
import Router from "next/router";

const DefaultWaitTimeInSecond = 5;

export default function Go() {
  const blogRef = React.useRef<Blog>();
  React.useEffect(() => {
    const url = new URL(location.href);
    const search = shouldString(url.searchParams.get("search"));
    const tags = shouldString(url.searchParams.get("tags")).split(",");

    getRandomBlogs({ search, tags, n: 1 }).then((result) => {
      if (showNotification(result) && !!result.data && result.data.length > 0) {
        blogRef.current = result.data[0];
      }
    });
  }, []);

  const [ts, setTs] = React.useState(DefaultWaitTimeInSecond);
  const tsRef = React.useRef<number>(ts);
  const timeoutIdRef = React.useRef<NodeJS.Timeout>();
  const minute1s = React.useCallback(() => {
    timeoutIdRef.current = setTimeout(() => {
      if (tsRef.current >= 0) {
        tsRef.current--;
        setTs(tsRef.current);
        minute1s();
      } else {
        if (!!blogRef.current && !!blogRef.current.url) {
          Router.push(blogRef.current?.url);
        }
      }
    }, 1000);
  }, [tsRef, setTs]);

  React.useEffect(() => {
    minute1s();
    
    return () => {
      if (!!timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      };
    };
  }, [minute1s]);


  // 设置 body 样式
  const ctx = React.useContext(Context);
  const { setContext } = ctx;
  React.useEffect(() => {
    setContext({
      layoutClassName: styles.body
    });
   
    
    return () => {
      setContext({
        layoutClassName: ""
      });
    };
  }, [setContext]);
  
  return (
    <Flex direction="LR" mainAxis="center" subAxis="center" mainSize={0} subSize={0} >
      <div className={styles.sidebar}>
        <img src="/logo.png" title="logo" className={styles.img} alt="logo"/>
        <Typography.Paragraph strong className={styles.title}>
          中文博客导航
        </Typography.Paragraph>
        <Typography.Paragraph strong className={styles.sub_title}>
          尝试链接所有的中文博客
        </Typography.Paragraph>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.inner }>
          {
            ["#f07c82", "#7a7374", "#806d9e", "app", "#93b5cf", "#55bb8a", "#f7e8aa", "#fbecde", "#d4c4b7"].map(
              (item) => item === "app" ? <div key={item} className={styles.list} style={{ backgroundColor:"#b0d4a5" }}>
                {!!blogRef.current ? (
                  <div>
                    <Typography.Paragraph strong>
              自 博客导航 跳转至 <a href={blogRef.current.url}>{`${blogRef.current.name} (${blogRef.current.url})`}</a>
                    </Typography.Paragraph>
                    <Typography.Paragraph strong>{ts > 0 ? `${ts} 秒后自动跳转`: "正在跳转..."} </Typography.Paragraph>
                  </div>
                ) : ts >= 0 ?(
                  <Typography.Paragraph strong>正在选择博客</Typography.Paragraph>
                ): <Typography.Paragraph strong>有点问题，刷新下？</Typography.Paragraph>}
              </div>: <div key={item} className={styles.list} style={{ "backgroundColor": item }}>
                <div className={styles.box_card_1}></div><br />
                <div className={styles.box_card_2}></div><br />
                <div className={styles.box_card_3}></div>
              </div>
            )
          }
          
        
          {/* <div className="list" id="app" style="background-color: #add5a2;"></div> */}
          
        </div>
      </div>
    </Flex>
  );
}


{/* <Flex direction="TB" mainAxis="center" fullWidth className={styles.wrapper}>
      <Card className={styles.card} shadow>
        
      </Card>
      ;
    </Flex> */}