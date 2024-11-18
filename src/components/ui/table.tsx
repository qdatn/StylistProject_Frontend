import React, { useState } from 'react';
import { Table, Button, Space, Input, message } from 'antd';
import { TableProps } from 'antd';
import { ColumnsType } from 'antd/es/table';

const { Search } = Input;

interface CommonTableProps<T> extends TableProps<T> {
  columns: ColumnsType<T>;
  dataSource: T[];
  rowKey: string;
  rowSelection?: any;
  onRow?: (record: T) => React.HTMLProps<HTMLElement>;
  onAddNew?: () => void;
  onProductUpdate?: (updatedProduct: T) => void;  // Thêm prop onProductUpdate
  hideAddButton?: boolean;
}

function CommonTable<T extends { [key: string]: any }>(props: CommonTableProps<T>) {
  const { columns, dataSource, rowKey, rowSelection, onAddNew, hideAddButton = false,...restProps } = props;
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
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(value.toLowerCase())
      )
    );
    setTableData(filteredData);
  };
  const handleHide = () => {
    setTableData(prevData =>
      prevData.map(item =>
        selectedRowKeys.includes(item[rowKey])
          ? { ...item, status: false } // Giả sử bạn ẩn sản phẩm bằng cách đổi trạng thái thành false
          : item
      )
    );
    setSelectedRowKeys([]);
    message.success("Selected items hidden");
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
      <div className="flex items-center justify-between mb-4">
        <Search
          placeholder="Search"
          onSearch={handleSearch}
          style={{ width: 200 }}
        />
        {!hideAddButton && (<Button type="primary" onClick={onAddNew}>
          Add New
        </Button>)}
      </div>

      {selectedRowKeys.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <Space>
            <span className="text-[15px]">{`Selected ${selectedRowKeys.length} items`}</span>
            <Button onClick={handleDelete}>Delete</Button>
            <Button onClick={handleHide}>Hide</Button>
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
