import React from "react";

const cards = [
  {
    title: "Groups",
    description:
      "Organize agents and receive notifications on unattended tickets.",
    action: "Manage",
  },
  {
    title: "Agent Statuses",
    description:
      "Define agents' scope of work, type, language, and other details.",
    action: "Manage",
  },
  {
    title: "Skills",
    description: "Assign skills to agents for better ticket routing.",
    action: "Manage",
  },
  {
    title: "Create Tags",
    description: "Create and manage tags for ticket categorization.",
    action: "Create",
  },
  // Add more cards as needed
];

const SettingsCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white rounded shadow p-6 flex flex-col items-start hover:shadow-md transition"
        >
          <span className="font-semibold text-lg mb-2">{card.title}</span>
          <span className="text-gray-500 text-sm mb-4">{card.description}</span>
          <button className="mt-auto bg-blue-600 text-white px-4 py-1.5 rounded font-semibold text-sm">
            {card.action}
          </button>
        </div>
      ))}
    </div>
  );
};

export default SettingsCards;
