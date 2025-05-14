import React, { useState, useEffect } from "react";
import { useFormikContext } from "formik";
import axios from "axios";

type Props = {
  name: string;
  className?: string;
};

const AddressAutocomplete: React.FC<Props> = ({ name, className }) => {
  const { values, setFieldValue } = useFormikContext<any>();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [query, setQuery] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(true);
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || "";

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 3) return;
      try {
        const res = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            query
          )}.json`,
          {
            params: {
              access_token: MAPBOX_TOKEN,
              autocomplete: true,
              limit: 5,
              language: "vi",
              country: "VN",
            },
          }
        );
        const places = res.data.features.map((f: any) => f.place_name);
        setSuggestions(places);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSelect = (place: string) => {
    setFieldValue(name, place);
    setQuery(place);
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <input
        type="text"
        className={className}
        value={query || values[name] || ""}
        onChange={(e) => {
          const value = e.target.value;
          setQuery(value);
          setFieldValue(name, value);
        }}
        placeholder="Nhập địa chỉ"
      />
      <button
        type="button"
        className="text-sm text-blue-500 underline mt-1"
        onClick={() => setShowSuggestions(!showSuggestions)}
      >
        {showSuggestions ? "Hide hint address" : "Show hint address"}
      </button>

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute bg-white border w-full shadow z-10 max-h-60 overflow-y-auto">
          {suggestions.map((place, index) => (
            <li
              key={index}
              className="p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelect(place)}
            >
              {place}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressAutocomplete;
