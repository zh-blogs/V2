import React from "react";

import { Loading } from "@/components/antd";
import { Flex } from "@/components/flex";

import { Blog, showNotification } from "@/utils";
import { getRandomBlogs } from "@/utils/api";

export function Side() {
  return (
    <Flex direction="TB">
      <RecommendBlogs />
    </Flex>
  );
}

function RecommendBlogs() {
  const [blogs, setBlogs] = React.useState<Blog[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    getRandomBlogs({ status: 2, n: 10 })
      .then((result) => {
        if (showNotification(result) && !!result.data) {
          setBlogs(result.data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Flex direction="TB">
      <b>精选博客</b>

      {loading ? (
        <Loading />
      ) : blogs.length > 0 ? (
        <Flex direction="TB">
          {blogs.map((blog) => (
            <a key={blog.url} href={blog.url}>
              {blog.name}
            </a>
          ))}
        </Flex>
      ) : (
        <span>没有推荐博客</span>
      )}
    </Flex>
  );
}
