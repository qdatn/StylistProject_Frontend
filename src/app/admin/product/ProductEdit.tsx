import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductForm from '@components/ProductForm'; // Giả sử đây là form chỉnh sửa sản phẩm
import { Product } from '@src/types/Product'; // Import kiểu Product

function ProductEdit() {
  const { productId } = useParams<{ productId: string }>(); // Lấy productId từ URL parameters

  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!productId) return; // Nếu không có productId thì không thực hiện fetch

    // Fetch thông tin sản phẩm từ API
    fetch(`/api/products/${productId}`)
      .then((response) => response.json())
      .then((data) => setProduct(data))
      .catch((error) => console.error('Error fetching product:', error));
  }, [productId]);

  const handleSave = (updatedProduct: Partial<Product>) => {
    if (!productId) return; // Kiểm tra productId hợp lệ

    // Gửi request cập nhật sản phẩm
    fetch(`/api/products/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProduct),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Product updated:', data);
        // Sau khi lưu thành công, có thể redirect hoặc làm gì đó
      })
      .catch((error) => console.error('Error updating product:', error));
  };

  if (!product) return <div>Loading...</div>; // Hiển thị loading khi chưa có dữ liệu sản phẩm

  return (
    <div>
      <h1>Edit Product</h1>
      <ProductForm initialProduct={product} onSave={handleSave} />
    </div>
  );
}

export default ProductEdit;
