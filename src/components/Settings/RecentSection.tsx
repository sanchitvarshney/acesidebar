import React from "react";

const recentItems = [
  { title: "Groups" },
  { title: "Session Replay" },
  { title: "Skills" },
  { title: "Arcade" },
  { title: "Email Notifications" },
];

const RecentSection: React.FC = () => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-2">Recent</h2>
      <div className="flex flex-wrap gap-4">
        {recentItems.map((item) => (
          <div
            key={item.title}
            className="bg-gray-100 rounded px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-200"
          >
            {item.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentSection;
