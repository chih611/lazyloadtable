// AntDesignTableEditor.tsx
// React 18+ (TypeScript)
// Ant Design Table with styling similar to Airtable-like layout

import { useEffect, useState } from "react";
import { Table, Tag, Button, Space } from "antd";
import type { ColumnsType } from "antd/es/table";

// -------------------- Types --------------------
export interface Row {
  id: string;
  name: string;
  language: string;
  bio: string;
  version: number;
}

// -------------------- Component --------------------
function App() {
  const [data, setData] = useState<Row[]>([]);
  useEffect(() => {
    fetch("https://microsoftedge.github.io/Demos/json-dummy-data/5MB.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("HTTP error " + response.status);
        }
        return response.json(); // must parse JSON
      })
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }, []);

  const columns: ColumnsType<Row> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 180,
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (text) => <span style={{ fontWeight: 600 }}>{text}</span>,
    },
    {
      title: "Language",
      dataIndex: "language",
      key: "language",
      width: 160,
    },
    {
      title: "Bio",
      dataIndex: "bio",
      key: "bio",
      ellipsis: true,
    },
    {
      title: "Version",
      dataIndex: "version",
      key: "version",
      width: 140,
      render: (val: number) => {
        if (val > 5) return <Tag color="green">served</Tag>;
        if (val > 2) return <Tag color="blue">to contact</Tag>;
        if (val > 1) return <Tag color="orange">pause</Tag>;
        return <Tag color="red">new customer</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 180,
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            type="primary"
            onClick={() => console.log("Edit", record)}
          >
            Edit
          </Button>
          <Button
            size="small"
            danger
            onClick={() =>
              setData((prev) => prev.filter((r) => r.id !== record.id))
            }
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>Table Editor</h2>
      <Table<Row>
        columns={columns}
        dataSource={data}
        rowKey="id"
        bordered
        scroll={{ y: 400 }}
      />
    </div>
  );
}

export default App;
