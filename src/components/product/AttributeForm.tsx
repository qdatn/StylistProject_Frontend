import axiosClient from "@api/axiosClient";
import { Attribute, AttributeList } from "@src/types/Attribute";
import { Input } from "antd";
import React, { useEffect, useState } from "react";
import { IoAddSharp, IoClose, IoRemove } from "react-icons/io5";

const baseUrl = import.meta.env.VITE_API_URL;

interface AttributesFormProps {
  onAttributesChange: (attributes: Attribute[]) => void; // Truyền thông tin attributes ra ngoài
}
const AttributesForm: React.FC<AttributesFormProps>= ({ onAttributesChange }) => {
  const [newKey, setNewKey] = useState<string>("");
  const [newValues, setNewValues] = useState<Record<string, string>>({});
  const [selectedValues, setSelectedValues] = useState<Record<string, Set<string>>>({});
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  // Fetch attributes from API
  const fetchAttributes = async () => {
    try {
      const response = await axiosClient.getOne<AttributeList>(`${baseUrl}/api/attribute`);
      setAttributes(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Failed to fetch attributes:", error);
    }
  };

  useEffect(() => {
    fetchAttributes();
  }, []);

  // Validation for adding a new key
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

  // Add a new attribute key
  const handleAddKey = async () => {
    if (!validateNewKey()) return;
  
    try {
      const response = await axiosClient.post<Attribute>(`${baseUrl}/api/attribute`, {
        key: newKey.trim(),
        value: [], // Gửi giá trị mặc định ban đầu
      });
  
      // API trả về key vừa thêm
      const addedAttribute: Attribute = response; // Không cần ép kiểu thêm
  
      // Cập nhật state attributes
      setAttributes([...attributes, addedAttribute]);
  
      // Reset input
      setNewKey("");
    } catch (error) {
      console.error("Error adding new attribute key:", error);
    }
  };
  
  

  // Delete an attribute key
  const handleDeleteKey = async (key: string) => {
    try {
      await axiosClient.delete(`${baseUrl}/api/attribute/${key}`);
      setAttributes(attributes.filter((attr) => attr.key !== key));
      setSelectedValues((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
    } catch (error) {
      console.error("Error deleting attribute:", error);
    }
  };

  // Add a new value to an attribute key
  const handleAddValue = async (key: string) => {
    const valueToAdd = newValues[key]?.trim();
    if (!valueToAdd) return;

    try {
      const response = await axiosClient.put(`${baseUrl}/api/attribute/${key}/addValues`, {
        values: [valueToAdd],
      });

      setAttributes(
        attributes.map((attr) =>
          attr.key === key ? { ...attr, value: [...attr.value, valueToAdd] } : attr
        )
      );
      setNewValues((prev) => ({ ...prev, [key]: "" }));
    } catch (error) {
      console.error("Error adding value to attribute:", error);
    }
  };

  // Delete a value from an attribute key
  const handleDeleteValue = async (key: string, value: string) => {
    try {
      await axiosClient.put(`${baseUrl}/api/attribute/${key}/removeValues`, {
        values: [value],
      });

      setAttributes(
        attributes.map((attr) =>
          attr.key === key ? { ...attr, value: attr.value.filter((val) => val !== value) } : attr
        )
      );
    } catch (error) {
      console.error("Error deleting value from attribute:", error);
    }
  };

  // Handle checkbox toggle
  const handleCheckboxChange = (key: string, value: string) => {
    setSelectedValues((prev) => {
      const updated = { ...prev };
      if (!updated[key]) {
        updated[key] = new Set();
      }
      if (updated[key].has(value)) {
        updated[key].delete(value);
      } else {
        updated[key].add(value);
      }
      // Cập nhật attributes đã chọn
      const selectedAttributes = attributes.map((attr) => ({
        key: attr.key,
        value: Array.from(updated[attr.key] || []),
      }));
      onAttributesChange(selectedAttributes); // Gửi dữ liệu ra ngoài
      return updated;
    });
  };

  // Toggle attribute key visibility
  const toggleKey = (key: string) => {
    setExpandedKeys((prev) => {
      const updated = new Set(prev);
      if (updated.has(key)) {
        updated.delete(key);
      } else {
        updated.add(key);
      }
      return updated;
    });
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

      {attributes.map((attr) => (
        <div key={attr.key} className="border-b border-gray-200 pb-4 mb-4">
          <div className="flex justify-between items-center">
            <span
              className="cursor-pointer text-[15px] text-gray-800 flex items-center gap-1"
              onClick={() => toggleKey(attr.key)}
            >
              {attr.key} {expandedKeys.has(attr.key) ? <IoRemove /> : <IoAddSharp />}
            </span>
            <button
              type="button"
              onClick={() => handleDeleteKey(attr.key)}
              className="text-gray-500 hover:underline"
            >
              <IoClose />
            </button>
          </div>

          {expandedKeys.has(attr.key) && (
            <div>
              <div className="flex flex-wrap gap-4 mt-2">
                {attr.value.map((val) => (
                  <div key={val} className="group flex items-center gap-2 bg-gray-100 px-2 py-1 rounded">
                    <input
                      type="checkbox"
                      checked={selectedValues[attr.key]?.has(val) || false}
                      onChange={() => handleCheckboxChange(attr.key, val)}
                      className="form-checkbox"
                    />
                    <span>{val}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteValue(attr.key, val)}
                      className="text-gray-300 group-hover:text-gray-800"
                    >
                      <IoClose />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 mt-4">
                <Input
                  value={newValues[attr.key] || ""}
                  onChange={(e) => setNewValues({ ...newValues, [attr.key]: e.target.value })}
                  placeholder="Add new value"
                  className="p-2 border rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleAddValue(attr.key)}
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
