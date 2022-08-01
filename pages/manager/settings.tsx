import React from "react";

import { PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { Tag, InputNumber, Table } from "antd";

import { Loading, Button } from "@/components/antd";
import { Flex } from "@/components/flex";
import { AdminLayout } from "@/components/layout";

import { shouldNumber, shouldString, showNotification } from "@/utils";
import { clearToken, getSetting, setSetting } from "@/utils/api";

export default function SettingsManager() {
  return (
    <AdminLayout>
      <AdminSettingsManager />
    </AdminLayout>
  );
}

export function AdminSettingsManager() {
  return (
    <Table
      bordered={false}
      showHeader={false}
      pagination={false}
      columns={[
        {
          title: "name",
          dataIndex: "name",
          key: "name",
          render: (text) => <b>{text}</b>,
        },
        { title: "component", dataIndex: "component", key: "component" },
      ]}
      dataSource={[
        { name: "管理员 ID", component: <AdminArray /> },
        { name: "登录状态管理", component: <ClearToken /> },
      ]}
    />
  );
}

function AdminArray() {
  const [loading, setLoading] = React.useState(false);
  const [admin, setAdmin] = React.useState<number[]>([]);
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    setLoading(true);
    getSetting({ key: "admin" }).then((res) => {
      if (showNotification(res) && !!res.data) {
        setAdmin(
          shouldString(res.data.value)
            .split(",")
            .map((v) => shouldNumber(v, -1))
            .filter((v) => v >= 0),
        );
      }
      setLoading(false);
    });
  }, []);

  const save = React.useCallback(() => {
    setSetting({
      key: "admin",
      value: admin.map((v) => v.toString()).join(","),
    }).then((res) => {
      showNotification(res, true);
    });
  }, [admin]);

  return (
    <Loading loading={loading}>
      <Flex direction="LR" mainAxis="flex-start">
        {admin.map((id) => (
          <Tag
            key={id}
            closable
            onClose={() => {
              setAdmin(admin.filter((item) => item !== id));
            }}
          >
            {id}
          </Tag>
        ))}
        <InputNumber
          size="small"
          value={value}
          onChange={(v) => {
            setValue(v);
          }}
        />
        <Button
          size="small"
          icon={<PlusOutlined />}
          onClick={() => {
            if (!!value) {
              const set = new Set(admin);
              set.add(parseInt(value));
              setAdmin(Array.from(set));
              setValue("");
            }
          }}
        />
        <Button
          size="small"
          text="保存"
          type="primary"
          icon={<SaveOutlined />}
          onClick={save}
        />
      </Flex>
    </Loading>
  );
}

function ClearToken() {
  return (
    <Button
      text="清理 Token"
      danger
      type="primary"
      confirm="这将导致所有人需要重新登录，确认清理？"
      onClick={async () => showNotification(await clearToken(), true)}
    />
  );
}
