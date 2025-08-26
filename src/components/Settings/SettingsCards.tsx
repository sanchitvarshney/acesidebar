import { Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const SettingsCards: React.FC = ({ cards }: any) => {
  const navigate = useNavigate();

  const handleRoute = (title: string) => {
    const path = title.toLowerCase().replace(" ", "-");
    console.log(path);
    switch (path) {
      case "groups":
        navigate("/groups");
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
                className="bg-white rounded shadow p-6 flex flex-col items-start hover:shadow-md transition"
              >
                {/* Icon and Title */}
                <div className="flex items-center mb-2">
                  {item.icon && (
                    <span className="mr-2">
                      {React.createElement(item.icon, {
                        sx: { fontSize: 24, color: "#1b66c9" },
                      })}
                    </span>
                  )}
                  <span className="font-semibold text-lg">{item.title}</span>
                </div>

                {/* Description */}
                <span className="text-gray-500 text-sm mb-4">
                  {item.description}
                </span>

                {/* Optional action button */}
                {item.action && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleRoute(item.title)}
                  >
                    {" "}
                    {item.action}
                  </Button>
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
