import { useCallback, useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUsersCog,
  FaProjectDiagram,
  FaCogs,
  FaLifeRing,
  FaSearch,
} from "react-icons/fa";
import { IconType } from "react-icons";
import SettingsSearchBar from "../../../components/Settings/SearchBar";

// Define the searchable item type
type SearchableItem = {
  id: string;
  title: string;
  description: string;
  icon: IconType;
  iconClass: string;
  route: string;
};

// Define all menu sections for search
const menuSections: SearchableItem[] = [
  {
    id: "search",
    icon: FaSearch,
    iconClass: "text-blue-500 text-xl",
    title: "Search",
    description: "Search settings",
    route: "/settings",
  },
  {
    id: "accounts",
    icon: FaUsersCog,
    iconClass: "text-green-500 text-xl",
    title: "Accounts",
    description: "Define agents' access levels and working hours",
    route: "/settings/account/accounts",
  },
  {
    id: "workflows",
    icon: FaProjectDiagram,
    iconClass: "text-purple-500 text-xl",
    title: "Workflows",
    description: "Set up your ticket routing and resolution process",
    route: "/settings/workflow",
  },
  {
    id: "agent-productivity",
    icon: FaCogs,
    iconClass: "text-orange-500 text-xl",
    title: "Agent Productivity",
    description: "Pre-create responses and actions for reuse",
    route: "/settings/agent-productivity",
  },
  {
    id: "support-operations",
    icon: FaLifeRing,
    iconClass: "text-blue-400 text-xl",
    title: "Support Operations",
    description: "Map out and manage your complete support structure",
    route: "/settings/support-operations",
  },
  // Add more specific setting items
  {
    id: "groups",
    icon: FaUsersCog,
    iconClass: "text-green-500 text-xl",
    title: "Groups",
    description:
      "Organize agents and receive notifications on unattended tickets",
    route: "/groups",
  },
  {
    id: "agent-statuses",
    icon: FaUsersCog,
    iconClass: "text-green-500 text-xl",
    title: "Agent Statuses",
    description:
      "Define agents' scope of work, type, language, and other details",
    route: "/account-settings",
  },
  {
    id: "skills",
    icon: FaUsersCog,
    iconClass: "text-green-500 text-xl",
    title: "Skills",
    description: "Assign skills to agents for better ticket routing",
    route: "/account-settings",
  },
  {
    id: "tags",
    icon: FaUsersCog,
    iconClass: "text-green-500 text-xl",
    title: "Tags",
    description: "Create and manage tags for ticket categorization",
    route: "/account-settings",
  },
  {
    id: "canned-responses",
    icon: FaCogs,
    iconClass: "text-orange-500 text-xl",
    title: "Canned Responses",
    description:
      "Pre-create replies to quickly insert them in responses to customers",
    route: "/settings/agent-productivity",
  },
  {
    id: "automations",
    icon: FaCogs,
    iconClass: "text-orange-500 text-xl",
    title: "Automations",
    description:
      "Eliminate repetitive tasks such as categorization and routing by creating rules",
    route: "/settings/workflow",
  },
  {
    id: "sla-policies",
    icon: FaCogs,
    iconClass: "text-orange-500 text-xl",
    title: "SLA Policies",
    description:
      "Set up targets for agents to guarantee timely responses and resolutions",
    route: "/settings/workflow",
  },
  {
    id: "apps",
    icon: FaLifeRing,
    iconClass: "text-blue-400 text-xl",
    title: "Apps",
    description: "Connect third party tools and apps you use with Freshdesk",
    route: "/settings/support-operations",
  },
  {
    id: "contact-fields",
    icon: FaLifeRing,
    iconClass: "text-blue-400 text-xl",
    title: "Contact Fields",
    description:
      "Manage all the fields you need for adding and updating contacts",
    route: "/settings/support-operations",
  },
  {
    id: "company-fields",
    icon: FaLifeRing,
    iconClass: "text-blue-400 text-xl",
    title: "Company Fields",
    description:
      "Manage all the fields you need for adding and updating companies",
    route: "/settings/support-operations",
  },
  {
    id: "billing-plans",
    icon: FaUsersCog,
    iconClass: "text-green-500 text-xl",
    title: "Plans & Billing",
    description: "Manage your plan, add-ons, team size, and billing cycle",
    route: "/billings-plans",
  },
  {
    id: "account-export",
    icon: FaUsersCog,
    iconClass: "text-green-500 text-xl",
    title: "Account Exports",
    description: "Create, manage and track exports for your support desk",
    route: "/account-export",
  },
];

const RecentPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState<SearchableItem[]>([]);
  const navigate = useNavigate();


  // Filter menu sections based on search query
  const filteredMenuSections = useMemo(() => {
    if (!searchQuery.trim()) {
      return menuSections;
    }

    const lowerQuery = searchQuery.toLowerCase();
    return menuSections.filter(
      (section) =>
        section.title.toLowerCase().includes(lowerQuery) ||
        section.description.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery]);

  // Handle search query change from search bar
  const handleSearchQueryChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Update filtered results when search query changes
  useEffect(() => {
    setFilteredResults(filteredMenuSections);
  }, [filteredMenuSections]);

  // Handle search result selection
  const handleSearchResultSelect = useCallback(
    (sectionId: string) => {
      const selectedItem = menuSections.find((item) => item.id === sectionId);
      if (selectedItem) {
        navigate(selectedItem.route);
        setSearchQuery(""); // Clear search after navigation
      }
    },
    [navigate, setSearchQuery]
  );

  // Handle direct item click
  const handleItemClick = useCallback(
    (item: SearchableItem) => {
      navigate(item.route);
      setSearchQuery(""); // Clear search after navigation
    },
    [navigate, setSearchQuery]
  );

  // Highlight search terms in text
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Search Settings
        </h1>
        <p className="text-gray-600">
          Find and navigate to any setting in your workspace
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex justify-center">
        <SettingsSearchBar
          onSearchResultSelect={handleSearchResultSelect}
         
          searchQuery={searchQuery}
          onSearchQueryChange={handleSearchQueryChange}
          showResults={!!searchQuery}
          onShowResultsChange={() => {}}
        />
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Search Results ({filteredResults.length})
          </h2>
          {filteredResults.length > 0 ? (
            <div className="grid gap-4">
              {filteredResults.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md cursor-pointer transition-all duration-200"
                >
                  <div className="text-xl mt-1">
                    {item.icon({ className: item.iconClass })}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">
                      {highlightText(item.title, searchQuery)}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {highlightText(item.description, searchQuery)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-500">
                <div className="text-lg font-medium mb-2">No results found</div>
                <div className="text-sm">Try searching for something else</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* All Settings (when no search) */}
      {!searchQuery && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            All Settings
          </h2>
          <div className="grid gap-4">
            {menuSections.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md cursor-pointer transition-all duration-200"
              >
                <div className="text-xl mt-1">
                  {item.icon({ className: item.iconClass })}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentPage;
