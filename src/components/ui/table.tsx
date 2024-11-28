import React, { useEffect, useState } from "react";
import { Table, Button, Space, Input, message, Pagination } from "antd";
import { TableProps } from "antd";
import { ColumnsType } from "antd/es/table";
import { PaginationType } from "@src/types/Pagination";
import axiosClient from "@api/axiosClient";
import { Product, ProductList } from "@src/types/Product";

const { Search } = Input;
const urlPath = import.meta.env.VITE_API_URL;
//const baseUrl = import.meta.env.VITE_API_URL;
const pageSize =8
interface CommonTableProps<T> extends TableProps<T> {
  columns: ColumnsType<T>;
  dataSource: T[];
  rowKey: string;
  rowSelection?: any;
  onRow?: (record: T) => React.HTMLProps<HTMLElement>;
  onAddNew?: () => void;
  onUpdate?: (updated: T) => void;
  hideAddButton?: boolean;
  hideHideButton?: boolean; //nhưng form không cần nút "toggle status" thì cho nút này ẩn đi
  pagination?: PaginationType;
  onDeleteSuccess?: () => void;
  onDelete?: (selectedKeys: React.Key[]) => Promise<void>; // Hàm xử lý xóa
  onPageChange: (page: number, pageSize: number) => void;
}

function CommonTable<T extends { [key: string]: any }>(
  props: CommonTableProps<T>
) {
  const {
    columns,
    dataSource,
    rowKey,
    rowSelection,
    onAddNew,
    hideAddButton = false,
    hideHideButton = false,
    onDeleteSuccess,
    onPageChange,
    pagination,
    ...restProps
  } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [tableData, setTableData] = useState<T[]>(dataSource);
  const [searchText, setSearchText] = useState("");
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  useEffect(() => {
    setTableData(dataSource);
  }, [props.dataSource, props.pagination]);

  const handleDelete = async () => {
    try {
      if (props.onDelete) {
        // Gọi hàm xóa từ props
        await props.onDelete(selectedRowKeys);
      }
  
      // Cập nhật dữ liệu bảng sau khi xóa thành công
      setTableData((prevData) =>
        prevData.filter((item) => !selectedRowKeys.includes(item[rowKey]))
      );
  
      setSelectedRowKeys([]);
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (error) {
      message.error("Failed to delete selected items");
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    const filteredData = dataSource.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(value.toLowerCase())
      )
    );
    setTableData(filteredData);
  };

  //tương ứng với hideHidebutton để thay đổi trạng thái
  const handleToggleStatus = () => {
    setTableData((prevData) =>
      prevData.map((item) =>
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

  // const fetchProductItem = async (page: number, pageSize: number) => {
  //   try {
  //     const response = await axiosClient.getOne<ProductList>(
  //       `${urlPath}/api/product/`,
  //       //pagination params
  //       { page: page, limit: pageSize }
  //     );

  //     // Lỗi data type nếu bỏ as
  //     setTableData(response.data as unknown as T[]);

  //     setPagination(response.pagination);
  //     // setHasMore(page < response.pagination.totalPages!);
  //   } catch (error) {
  //     alert(error);
  //   }
  // };

  // const handlePageChange = (page: number) => {
  //   // Update the pagination state
  //   if (page <= pagination?.totalPages!) {
  //     setPagination({
  //       ...pagination,
  //       currentPage: page,
  //     });
  //   }

  //   // Simulate data fetching for the new page
  //   fetchProductItem(page, props.pagination?.pageSize!);
  // };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Search
          placeholder="Search"
          onSearch={handleSearch}
          style={{ width: 200 }}
        />
        {!hideAddButton && (
          <Button type="primary" onClick={onAddNew}>
            Add New
          </Button>
        )}
      </div>

      {selectedRowKeys.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <Space>
            <span className="text-[15px]">{`Selected ${selectedRowKeys.length} items`}</span>
            <Button onClick={handleDelete}>Delete</Button>
            {!hideHideButton && (
              <Button onClick={handleToggleStatus}>Toggle Status</Button>
            )}
          </Space>
        </div>
      )}

      <Table
        {...restProps}
        columns={columns}
        dataSource={tableData}
        rowKey={rowKey}
        rowSelection={mergedRowSelection}
        pagination={false}
        // pagination={{
        //   pageSize: 5, // Items per page
        // }}
      />
      <Pagination
        className="my-4"
        align="end"
        defaultCurrent={1}
        current={pagination?.currentPage}
        pageSize={pageSize}
        total={pagination?.totalItems}
        onChange={onPageChange}
        showSizeChanger={false}
        showTotal={() =>
          pagination?.totalItems
            ? `Total ${pagination?.totalItems} items`
            : `Total 0 items`
        }
      />
    </>
  );
}

export default CommonTable;
