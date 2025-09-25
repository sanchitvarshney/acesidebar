import React from "react";
import { useNavigate } from "react-router-dom";

const SettingsCards: React.FC = ({ cards }: any) => {
  const navigate = useNavigate();

  const handleRoute = (title: string) => {
    const path = title.toLowerCase().replace(" ", "-");

    switch (path) {
      case "sla-policies":
        navigate("/sla-policies");
        break;
      case "canned-responses":
        navigate("/cannen_response");
        break;
      case "email-notifications":
        navigate("/email_notifications");
        break;
      case "departments":
        navigate("/departments");
        break;
      case "teams":
        navigate("/teams");
        break;
      case "agents":
        navigate("/agents");
        break;
      case "account-details":
        navigate("/account-settings");
        break;
      case "plans-& billing":
        navigate("/billings-plans");
        break;
      case "account-exports":
        navigate("/account-export");
        break;
      case "day-passes":
        navigate("/account-day-passes");
        break;
      case "security":
        navigate("/account-security");
        break;
      case "helpdesk-settings":
        navigate("/account-help-center");
        break;
      case "tags":
        navigate("/manage-tags");
        break;
      case "ticket-fields":
        navigate("/ticket-fields");
        break;
    }
  };

  return (
    <div className="space-y-8">
      {cards.map((section: any) => (
        <div key={section.section}>
          {/* Section title */}
          <h2 className="text-xl font-semibold mb-4">{section.section}</h2>

          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {section.items.map((item: any) => (
              <div
                key={item.title}
                onClick={() => handleRoute(item.title)}
                className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-start cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-105 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 group"
              >
                {/* Icon and Title */}
                <div className="flex items-center mb-2">
                  {item.icon && (
                    <span className="mr-2 group-hover:scale-110 transition-transform duration-300">
                      {React.createElement(item.icon, {
                        sx: { fontSize: 24, color: "#1b66c9" },
                      })}
                    </span>
                  )}
                  <span className="font-semibold text-lg group-hover:text-blue-700 transition-colors duration-300">{item.title}</span>
                </div>

                {/* Description */}
                <span className="text-gray-500 text-sm mb-4 group-hover:text-gray-700 transition-colors duration-300">
                  {item.description}
                </span>

                {/* Action indicator */}
                {item.action && (
                  <div className="mt-auto w-full">
                    <div className="text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {item.action} →
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SettingsCards;
