import React, { useState } from "react";

interface FilterValues {
  search: string;
  agent: string;
  group: string;
  sentiment: string;
  created: string;
  closed: string;
  resolved: string;
}

interface TicketFilterPanelProps {
  onApplyFilters: (filters: FilterValues) => void;
}

const agentOptions = ["Any agent", "Agent 1", "Agent 2"];
const groupOptions = ["Any group", "Group 1", "Group 2"];
const sentimentOptions = ["Any", "Positive", "Neutral", "Negative"];
const createdOptions = [
  "Last 7 days",
  "Last 30 days",
  "Last 90 days",
  "Any time",
];
const closedOptions = ["Any time", "Last 7 days", "Last 30 days"];
const resolvedOptions = ["Any time", "Last 7 days", "Last 30 days"];

const TicketFilterPanel: React.FC<any> = ({ onApplyFilters }) => {
  const [filters, setFilters] = useState<FilterValues>({
    search: "",
    agent: agentOptions[0],
    group: groupOptions[0],
    sentiment: sentimentOptions[0],
    created: createdOptions[1],
    closed: closedOptions[0],
    resolved: resolvedOptions[0],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  return (
    <div className="w-72 min-w-72 bg-white shadow rounded-lg flex flex-col h-full p-4 relative h-calc(100vh - 80px) overflow-scroll">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-gray-700 text-sm">FILTERS</span>
        <button className="text-xs text-blue-600 hover:underline">
          Show applied filters
        </button>
      </div>
      <input
        type="text"
        name="search"
        value={filters.search}
        onChange={handleChange}
        placeholder="Search fields"
        className="w-full mb-4 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
      <div className="mb-4">
        <label className="block text-xs text-gray-600 mb-1">
          Agents Include
        </label>
        <select
          name="agent"
          value={filters.agent}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
        >
          {agentOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-xs text-gray-600 mb-1">
          Tags
        </label>
        <select
          name="group"
          value={filters.group}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
        >
          {groupOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-xs text-gray-600 mb-1">Sentiment</label>
        <select
          name="sentiment"
          value={filters.sentiment}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
        >
          {sentimentOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-xs text-gray-600 mb-1">Created</label>
        <select
          name="created"
          value={filters.created}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
        >
          {createdOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-xs text-gray-600 mb-1">Closed at</label>
        <select
          name="closed"
          value={filters.closed}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
        >
          {closedOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-6">
        <label className="block text-xs text-gray-600 mb-1">Resolved at</label>
        <select
          name="resolved"
          value={filters.resolved}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
        >
          {resolvedOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
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
