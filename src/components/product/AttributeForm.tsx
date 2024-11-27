import React, { useEffect, useState } from "react";
import { Input } from "antd";
import { IoAddSharp, IoClose, IoRemove } from "react-icons/io5";
import axiosClient from "@api/axiosClient";
import { Attribute, AttributeList } from "@src/types/Attribute";

const baseUrl = import.meta.env.VITE_API_URL;

interface AttributesFormProps {
  onAttributesChange: (attributes: Attribute[]) => void;
  initialAttributes: Attribute[]; // Các attribute của sản phẩm (được chọn)
}

const AttributesForm: React.FC<AttributesFormProps> = ({
  onAttributesChange,
  initialAttributes,
}) => {
  const [newKey, setNewKey] = useState<string>("");
  const [newValues, setNewValues] = useState<Record<string, string>>({});
  const [selectedValues, setSelectedValues] = useState<Record<string, Set<string>>>({});
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [attributes, setAttributes] = useState<Attribute[]>([]); // Các attribute từ API

  // Fetch attributes from API
  const fetchAttributes = async () => {
    try {
      const response = await axiosClient.getOne<AttributeList>(`${baseUrl}/api/attribute`);
      setAttributes(response.data); // Lưu tất cả các attribute lấy từ API
    } catch (error) {
      console.error("Failed to fetch attributes:", error);
    }
  };

  useEffect(() => {
    fetchAttributes();
  }, []);

  // Thiết lập giá trị mặc định khi component load
  useEffect(() => {
    const initialSelectedValues: Record<string, Set<string>> = {};
    initialAttributes.forEach((attr) => {
      initialSelectedValues[attr.key] = new Set(attr.value);
    });
    setSelectedValues(initialSelectedValues); // Gán giá trị đã chọn vào state
  }, [initialAttributes]);

  const validateNewKey = (): boolean => {
    if (!newKey.trim()) {
      setErrors({ newKey: "Attribute key cannot be empty." });
      return false;
    }
    if (attributes.some((attr) => attr.key.toLowerCase() === newKey.trim().toLowerCase())) {
      setErrors({ newKey: "This attribute already exists." });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleAddKey = async () => {
    if (!validateNewKey()) return;
    try {
      const response = await axiosClient.post<Attribute>(`${baseUrl}/api/attribute`, {
        key: newKey.trim(),
        value: [], // Default values
      });
      setAttributes((prevAttrs) => [...prevAttrs, response]);
      setNewKey("");
    } catch (error) {
      console.error("Error adding new attribute key:", error);
    }
  };

  // Xử lý sự kiện khi checkbox thay đổi
  const handleCheckboxChange = (key: string, value: string) => {
    setSelectedValues((prev) => {
      const updated = { ...prev };
      if (!updated[key]) updated[key] = new Set();
      updated[key].has(value) ? updated[key].delete(value) : updated[key].add(value);
      
      // Chỉ gửi những thuộc tính có giá trị được chọn
      const updatedAttributes = attributes.map((attr) => ({
        key: attr.key,
        value: Array.from(updated[attr.key] || []), // Lấy các giá trị đã chọn
      })).filter(attr => attr.value.length > 0);  // Loại bỏ những thuộc tính không có giá trị
  
      onAttributesChange(updatedAttributes);  // Gọi hàm gửi dữ liệu với chỉ các thuộc tính có giá trị
      return updated;
    });
  };

  // Điều chỉnh sự kiện mở rộng attribute
  const toggleKey = (key: string) => {
    setExpandedKeys((prev) => {
      const updated = new Set(prev);
      updated.has(key) ? updated.delete(key) : updated.add(key);
      return updated;
    });
  };
 
  // Delete an attribute key
  const handleDeleteKey = async (key: string) => {
    try {
      await axiosClient.delete(`${baseUrl}/api/attribute/${key}`);
      setAttributes((prevAttrs) => prevAttrs.filter((attr) => attr.key !== key));
      setSelectedValues((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
    } catch (error) {
      console.error("Error deleting attribute:", error);
    }
  };

  const handleAddValue = async (key: string) => {
    const valueToAdd = newValues[key]?.trim();
    if (!valueToAdd) return;
    try {
      await axiosClient.put(`${baseUrl}/api/attribute/${key}/addValues`, {
        values: [valueToAdd],
      });
      setAttributes((prevAttrs) =>
        prevAttrs.map((attr) => (attr.key === key ? { ...attr, value: [...attr.value, valueToAdd] } : attr))
      );
      setNewValues((prev) => ({ ...prev, [key]: "" }));
    } catch (error) {
      console.error("Error adding value to attribute:", error);
    }
  };

  const handleDeleteValue = async (key: string, value: string) => {
    try {
      await axiosClient.put(`${baseUrl}/api/attribute/${key}/deleteValues`, {
        values: [value],
      });
      setAttributes((prevAttrs) =>
        prevAttrs.map((attr) =>
          attr.key === key ? { ...attr, value: attr.value.filter((val) => val !== value) } : attr
        )
      );
    } catch (error) {
      console.error("Error deleting value from attribute:", error);
    }
  };


  return (
    <div>
      <label className="block font-medium">Attributes</label>
      <div className="flex items-center gap-2 mb-4">
        <Input
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          placeholder="Enter new attribute (e.g., Color)"
          className="p-2 border rounded-md"
        />
        <button
          type="button"
          onClick={handleAddKey}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <IoAddSharp />
        </button>
      </div>
      {errors.newKey && <p className="text-red-500 text-sm">{errors.newKey}</p>}

      {attributes.map((attribute) => (
        <div key={attribute.key} className="border-b border-gray-200 pb-4 mb-4">
          <div className="flex justify-between items-center">
            <span
              className="cursor-pointer text-[15px] text-gray-800 flex items-center gap-1"
              onClick={() => toggleKey(attribute.key)}
            >
              {attribute.key} {expandedKeys.has(attribute.key) ? <IoRemove /> : <IoAddSharp />}
            </span>
            <button
              type="button"
              onClick={() => handleDeleteKey(attribute.key)}
              className="text-gray-500 hover:underline"
            >
              <IoClose />
            </button>
          </div>

          {expandedKeys.has(attribute.key) && (
            <div>
              <div className="flex flex-wrap gap-4 mt-2">
                {attribute.value.map((value) => (
                  <div key={value} className="group flex items-center gap-2 bg-gray-100 px-2 py-1 rounded">
                    <input
                      type="checkbox"
                      checked={selectedValues[attribute.key]?.has(value) || false}
                      onChange={() => handleCheckboxChange(attribute.key, value)}
                      className="form-checkbox"
                    />
                    <span>{value}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteValue(attribute.key, value)}
                      className="text-gray-300 group-hover:text-gray-800"
                    >
                      <IoClose />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 mt-4">
                <Input
                  value={newValues[attribute.key] || ""}
                  onChange={(e) => setNewValues((prev) => ({ ...prev, [attribute.key]: e.target.value }))}
                  placeholder="Enter new value"
                  className="p-2 border rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleAddValue(attribute.key)}
                  className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  <IoAddSharp />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AttributesForm;
