import React from 'react';

import { RightOutlined } from '@ant-design/icons';
import { Loading, Card, Button } from '@/components/antd';
import { Tag } from '@/components/tag';
import { Flex } from '@/components/flex';

import { getTagsWithCount, renameTag, deleteTag } from '@/utils/api';
import { Alert, Input } from 'antd';
import styles from './tags.module.scss';
import { showNotification } from '@/utils';
import { AdminLayout } from '@/components/layout';

export default function TagsManager() {
  return <AdminLayout>
    <AdminTagsManager />
  </AdminLayout>;
}

export function AdminTagsManager() {
  const [tags, setTags] = React.useState<{tag:string, count:number}[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const initial = React.useCallback(() => {
    setLoading(true);
    getTagsWithCount({}).then((res) => {
      if (!!res.success && !!res.data) {
        setTags(res.data);
      }
      setLoading(false);
    });
  }, [setLoading]);

  React.useEffect(() => {
    initial();
  }, [initial]);

  const [tag, setTag] = React.useState<string>('');
  const [count, setCount] = React.useState<number>(0);
  const [newTag, setNewTag] = React.useState<string>('');

  const renameTagCallback = React.useCallback((tag: string, newTag: string) => {
    setLoading(true);
    renameTag({ tag, newTag }).then((resp) => {
      if (showNotification(resp, true)) {
        initial();
        setTag("");
        setNewTag("");
      }
    }).finally(() => setLoading(false));
  }, [setLoading, initial]);

  const deleteTagCallback = React.useCallback((tag: string) => {
    setLoading(true);
    deleteTag({ tag }).then((resp) => {
      if(showNotification(resp, true)) {
        initial();
        setTag("");
        setNewTag("");
      }
    }).finally(() => setLoading(false));
  }, [setLoading, initial]);

  return (
    <Card>
      <Loading loading={loading}>
        <Flex direction="TB" fullWidth>
          <Alert message="提示" description={
            <ul>
              <li>将标签修改为另一个已有标签，将执行合并</li>
              <li>请在与组内其他人员商讨后再进行修改</li>
            </ul>
          } style={{ width: "100%" }} />
          <Flex direction="LR" mainAxis="center">
            <Input value={tag} disabled />
            <RightOutlined />
            <Input
              value={newTag}
              onChange={(e) => {
                if (!!e && !!e.target) {
                  setNewTag(e.target.value);
                }
              }}
            />
            <Button
              text="修改"
              type="primary"
              disabled={tag === '' || newTag === ''}
              loading={loading}
              confirm={`${count} 个博客的 ${tag} 标签将变更为 ${newTag} 标签`}
              onClick={() => renameTagCallback(tag, newTag)}
            />
            <Button
              text="删除"
              type="primary"
              danger
              disabled={tag === ''}
              loading={loading}
              confirm={`${count} 个博客将失去 ${tag} 标签`}
              onClick={() => deleteTagCallback(tag)}
            />
          </Flex>
          <Flex
            direction="LR"
            mainSize="small"
            subSize="small"
            mainAxis="flex-start"
          >
            {tags.map((item) => (
              <Tag
                key={item.tag}
                tag={item.tag}
                icon={<span className={styles.count}>{item.count}</span>}
                onClick={() => {
                  setTag(item.tag);
                  setCount(item.count);
                  setNewTag('');
                }}
              />
            ))}
          </Flex>
        </Flex>
      </Loading>
    </Card>
  );
}
