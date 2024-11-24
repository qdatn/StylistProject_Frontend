import React, { useEffect, useState } from "react";
import { Table, Button, Space, Input, message, Pagination } from "antd";
import { TableProps } from "antd";
import { ColumnsType } from "antd/es/table";
import { PaginationType } from "@src/types/Pagination";
import axiosClient from "@api/axiosClient";
import { Product, ProductList } from "@src/types/Product";

const { Search } = Input;
const urlPath = import.meta.env.VITE_API_URL;
const baseUrl = import.meta.env.VITE_API_URL;

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
    ...restProps
  } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [tableData, setTableData] = useState<T[]>(dataSource);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState(props.pagination);
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  useEffect(() => {
    setPagination(props.pagination);
    setTableData(dataSource);
  }, [props.dataSource, props.pagination]);

  useEffect(() => {
    console.log("dtsrc", dataSource);
    console.log("tabdata", tableData);
    console.log("[pagi]", pagination);
  }, [pagination]);

  const deleteProductInDB = async (productId: string) => {
    try {
      const updateProduct = await axiosClient.delete<Product>(
        `${baseUrl}/api/product/${productId}`
      );
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };
  const handleDelete = () => {
    setTableData((prevData) =>
      prevData.filter((item) => {
        if (selectedRowKeys.includes(item[rowKey])) {
          console.log("rowkey:", item[rowKey]);
          deleteProductInDB(item[rowKey]);
        }
        if (onDeleteSuccess) {
          onDeleteSuccess();
        }
        // !selectedRowKeys.includes(item[rowKey]);
      })
    );

    setSelectedRowKeys([]);
    message.success("Selected items deleted");
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

  const fetchProductItem = async (page: number, pageSize: number) => {
    try {
      const response = await axiosClient.getOne<ProductList>(
        `${urlPath}/api/product/`,
        //pagination params
        { page: page, limit: pageSize }
      );

      // Lỗi data type nếu bỏ as
      setTableData(response.data as unknown as T[]);

      setPagination(response.pagination);
      // setHasMore(page < response.pagination.totalPages!);
    } catch (error) {
      alert(error);
    }
  };

  const handlePageChange = (page: number) => {
    // Update the pagination state
    if (page <= pagination?.totalPages!) {
      setPagination({
        ...pagination,
        currentPage: page,
      });
    }

    // Simulate data fetching for the new page
    fetchProductItem(page, props.pagination?.pageSize!);
  };

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
        pageSize={props.pagination?.pageSize}
        total={pagination?.totalItems}
        onChange={handlePageChange}
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
