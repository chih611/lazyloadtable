// // AntDesignTableEditor.tsx
// // React 18+ (TypeScript)
// // Ant Design Table with styling similar to Airtable-like layout

import { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import InfiniteScroll from "react-infinite-scroll-component";

// -------------------- Types --------------------
export interface Row {
  id: string;
  name: string;
  language: string;
  bio: string;
  version: number;
}

// -------------------- Component --------------------
const App = () => {
  const [data, setData] = useState<Row[]>([]);
  // const [page, setPage] = useState(1);
  // const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

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
  ];

  useEffect(() => {
    fetchMoreData();
  }, []);

  const fetchMoreData = () => {
    if (data.length >= 50) {
      setHasMore(false);
      return;
    }
    fetch("https://microsoftedge.github.io/Demos/json-dummy-data/5MB.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("HTTP error " + response.status);
        }
        return response.json(); // must parse JSON
      })
      .then((data) => setData((prev) => [...prev, ...data]))
      .catch((error) => console.error(error));
  };
  return (
    <InfiniteScroll
      dataLength={data.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={<h4>Loading...</h4>}
      height={400} // scrollable height
    >
      <h2 style={{ marginBottom: 16 }}>Table Editor</h2>
      <Table<Row>
        dataSource={data}
        columns={columns}
        pagination={false}
        rowKey="id"
      />
    </InfiniteScroll>
  );
};
export default App;
