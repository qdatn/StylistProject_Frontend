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
  onUpdate?: (updated: T) => void;
  hideAddButton?: boolean;
  hideHideButton?: boolean;//nhưng form không cần nút "toggle status" thì cho nút này ẩn đi
}

function CommonTable<T extends { [key: string]: any }>(props: CommonTableProps<T>) {
  const { columns, dataSource, rowKey, rowSelection, onAddNew, hideAddButton = false, hideHideButton = false, ...restProps } = props;
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

  //tương ứng với hideHidebutton để thay đổi trạng thái
  const handleToggleStatus = () => {
    setTableData(prevData =>
      prevData.map(item =>
        selectedRowKeys.includes(item[rowKey])
          ? { ...item, status: !item.status } // Đảo ngược trạng thái `status`
          : item
      )
    );
    setSelectedRowKeys([]);
    message.success("Toggled status of selected items");
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
            {!hideHideButton && (<Button onClick={handleToggleStatus}>
              Toggle Status 
            </Button>)}
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
