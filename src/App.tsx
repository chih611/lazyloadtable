// // React 18+ (TypeScript)
// // Ant Design Table with styling similar to Airtable-like layout

import { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import InfiniteScroll from "react-infinite-scroll-component";

export interface Row {
  id: string;
  name: string;
  language: string;
  bio: string;
  version: number;
}

const App = () => {
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [tableData, setTableData] = useState<Row[]>([]);

  const itemPerPage = 10;

  const columns: ColumnsType<Row> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 200,
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: "Bio",
      dataIndex: "bio",
      key: "bio",
      ellipsis: true,
      sorter: (a, b) => a.bio.length - b.bio.length,
      sortDirections: ["descend"],
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
      width: 200,
    },
    {
      title: "Version",
      dataIndex: "version",
      key: "version",
      width: 200,
      render: (val: number) => <Tag color="green">{val}</Tag>,
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

  const fetchMoreData = () => {
    if (tableData.length >= data.length) {
      setHasMore(false);
      return;
    }
    const nextItems = data.slice(
      tableData.length,
      tableData.length + itemPerPage
    );
    setTableData([...tableData, ...nextItems]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <InfiniteScroll
      dataLength={tableData.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={<h4>Loading...</h4>}
      height={600} // scrollable height
    >
      <h2 style={{ marginBottom: 16 }}>Table Editor</h2>
      <Table<Row>
        rowSelection={{ type: "checkbox" }}
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
