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
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [tableData, setTableData] = useState<Row[]>([]);
  const itemPerPage = 10;

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
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend"],
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

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://microsoftedge.github.io/Demos/json-dummy-data/5MB.json"
      );
      if (!response.ok) throw new Error("HTTP error " + response.status);

      const data = await response.json();
      setData(data);
      setTableData(data.slice(0, itemPerPage));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchMoreData = () => {
    if (tableData.length >= data.length) {
      setHasMore(false);
      return;
    }
    const nextItems = data.slice(
      tableData.length,
      tableData.length + itemPerPage
    );
    console.log("-----", [...tableData, ...nextItems]);
    setTableData([...tableData, ...nextItems]);
  };
  return (
    <InfiniteScroll
      dataLength={tableData.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={<h4>Loading...</h4>}
      height={900} // scrollable height
    >
      <h2 style={{ marginBottom: 16 }}>Table Editor</h2>
      <Table<Row>
        dataSource={tableData}
        columns={columns}
        pagination={false}
        rowKey={(record, index) => record.id + "-" + index}
        loading={loading}
      />
    </InfiniteScroll>
  );
};
export default App;
