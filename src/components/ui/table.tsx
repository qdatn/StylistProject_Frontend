import React, { useState } from 'react';
import { Table, Button, Space, Input, message, Select } from 'antd';
import { TableProps, TableColumnsType} from 'antd';
import { ColumnsType } from 'antd/es/table';

const { Search } = Input;
const { Option } = Select;

interface CommonTableProps<T> extends TableProps<T> {
  columns: ColumnsType<T>;
  dataSource: T[];
  rowKey: string;
  rowSelection?: any;
}

function CommonTable<T extends { [key: string]: any }>(props: CommonTableProps<T>) {
  const { columns, dataSource, rowKey, rowSelection, ...restProps } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [tableData, setTableData] = useState(dataSource);
  const [searchText, setSearchText] = useState('');

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleDelete = () => {
    setTableData((prevData) => prevData.filter(item => !selectedRowKeys.includes(item[rowKey])));
    setSelectedRowKeys([]);
    message.success("Selected items deleted");
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    const filteredData = dataSource.filter(item =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setTableData(filteredData);
  };

  const mergedRowSelection = rowSelection
    ? {
        selectedRowKeys,
        onChange: onSelectChange,
        ...rowSelection,
      }
    : undefined;

  return (
    <>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
        <Search
          placeholder="Search"
          onSearch={handleSearch}
          style={{ width: 200 }}
        />
      </div>

      {selectedRowKeys.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <Space>
            <span>{`Selected ${selectedRowKeys.length} items`}</span>
            <Button onClick={handleDelete} type="primary">Delete</Button>
            <Button>Hide</Button>
          </Space>
        </div>
      )}

      <Table
        columns={columns}
        dataSource={tableData}
        rowKey={rowKey}
        rowSelection={mergedRowSelection}
        pagination={{ pageSize: 5 }}
        {...restProps}
      />
    </>
  );
}

export default CommonTable;
