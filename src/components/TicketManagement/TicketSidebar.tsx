import React, { useState, useEffect } from "react";
import { useGetAdvancedSearchQuery } from "../../services/ticketAuth";

interface TicketFilterPanelProps {
  onApplyFilters: (filters: Record<string, any>) => void;
}

const TicketFilterPanel: React.FC<any> = ({ onApplyFilters }) => {
  const {
    data: searchCriteria,
    isLoading,
    error,
  } = useGetAdvancedSearchQuery();
  const [filters, setFilters] = useState<Record<string, any>>({});

  // Initialize filters when searchCriteria loads
  useEffect(() => {
    if (searchCriteria && Array.isArray(searchCriteria)) {
      const initialFilters: Record<string, any> = {};
      searchCriteria.forEach((field: any) => {
        if (field.type === "chip") initialFilters[field.name] = [];
        else initialFilters[field.name] = "";
      });
      setFilters(initialFilters);
    }
  }, [searchCriteria]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // For chips/multi-select
  const handleChipChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, selectedOptions } = e.target as HTMLSelectElement;
    const values = Array.from(selectedOptions).map((opt) => opt.value);
    setFilters((prev) => ({ ...prev, [name]: values }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    console.log(filters);
  };

  if (isLoading) {
    return <div className="p-4">Loading filters...</div>;
  }
  if (error) {
    return <div className="p-4 text-red-500">Failed to load filters.</div>;
  }
  const criteriaArray = Array.isArray(searchCriteria)
    ? searchCriteria
    : Array.isArray(searchCriteria?.data)
    ? searchCriteria.data
    : [];
  if (!criteriaArray || criteriaArray.length === 0) {
    return null;
  }
  return (
    <div className="w-72 min-w-72 bg-white shadow rounded-lg flex flex-col h-full p-4 relative h-calc(100vh - 80px) overflow-scroll">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-gray-700 text-sm">FILTERS</span>
        <button className="text-xs text-blue-600 hover:underline">
          Show applied filters
        </button>
      </div>
      {/* DYNAMIC FIELDS */}
      {criteriaArray.map((field: any) => (
        <div className="mb-4" key={field.name}>
          <label className="block text-xs text-gray-600 mb-1">
            {field.label}
          </label>
          {field.type === "dropdown" && (
            <select
              name={field.name}
              value={filters[field.name]}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            >
              <option value="">Select {field.label}</option>
              {field.choices?.map((opt: any) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
          {field.type === "text" && (
            <input
              type="text"
              name={field.name}
              value={filters[field.name]}
              onChange={handleChange}
              placeholder={field.label}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          )}
          {field.type === "date" && (
            <input
              type="date"
              name={field.name}
              value={filters[field.name]}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            />
          )}
          {field.type === "chip" && (
            <select
              name={field.name}
              multiple
              value={filters[field.name]}
              onChange={handleChipChange}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            >
              {field.choices?.map((opt: any) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
        </div>
      ))}
      <div className="sticky bottom-0 left-0 right-0 bg-white pt-2 pb-0 z-10">
        <button
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded disabled:opacity-50"
          onClick={handleApply}
          type="button"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default TicketFilterPanel;
