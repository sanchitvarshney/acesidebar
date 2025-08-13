import React from "react";

const SettingsCards: React.FC = ({ cards }: any) => {
  console.log(cards, "cards");
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
                        sx: { fontSize: 24, color: "blue" },
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
                  <button className="mt-auto bg-blue-600 text-white px-4 py-1.5 rounded font-semibold text-sm">
                    {item.action}
                  </button>
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
