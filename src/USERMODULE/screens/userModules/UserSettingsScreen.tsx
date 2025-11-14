import { useState } from "react";
import { Switch } from "@mui/material";

const UserSettingsScreen = () => {
  const [profile, setProfile] = useState({
    name: "Alex Green",
    email: "alex.green@example.com",
    mobile: "+1 555 010 2345",
    timezone: "UTC-05:00 Eastern Time",
  });

  const [preferences, setPreferences] = useState({
    ticketUpdates: true,
    chatNotifications: true,
    todoReminders: false,
    newsletter: true,
  });

  return (
    <div className="w-full h-full min-h-[calc(100vh-74px)] bg-slate-100 overflow-y-auto px-6 lg:px-10 py-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-5">
          <p className="text-xs uppercase tracking-wide text-slate-500">Workspace</p>
          <h1 className="text-2xl font-semibold text-slate-900 mt-1">Preferences</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage how your profile appears and when we notify you about activity.
          </p>
        </header>

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-6">
          <h2 className="text-lg font-semibold text-slate-900">Profile</h2>
          <p className="text-sm text-slate-500 mt-1">
            This information is visible to teammates and customers when you reply to tickets.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-slate-600 font-medium">Display name</span>
              <input
                className="rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff7800]/20 focus:border-[#ff7800]"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-slate-600 font-medium">Email</span>
              <input
                type="email"
                className="rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff7800]/20 focus:border-[#ff7800]"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-slate-600 font-medium">Mobile number</span>
              <input
                className="rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff7800]/20 focus:border-[#ff7800]"
                value={profile.mobile}
                onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-slate-600 font-medium">Timezone</span>
              <input
                className="rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff7800]/20 focus:border-[#ff7800]"
                value={profile.timezone}
                onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
              />
            </label>
          </div>
          <div className="mt-6 flex items-center justify-end gap-2">
            <button className="px-4 py-2 rounded-full border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-100">
              Cancel
            </button>
            <button className="px-4 py-2 rounded-full bg-[#ff7800] text-white text-sm font-medium hover:bg-[#008f72]">
              Save changes
            </button>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-6">
          <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>
          <p className="text-sm text-slate-500 mt-1">
            Decide which workspace modules can reach you.
          </p>
          <div className="mt-6 space-y-4">
            {[
              {
                key: "ticketUpdates",
                title: "Ticket updates",
                description: "Alerts when new customer replies arrive or tickets move status.",
              },
              {
                key: "chatNotifications",
                title: "Chat notifications",
                description: "Receive pings when teammates mention you in chat threads.",
              },
              {
                key: "todoReminders",
                title: "To-do reminders",
                description: "Get reminders for upcoming to-dos and follow-ups.",
              },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between border border-slate-200 rounded-xl px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{item.description}</p>
                </div>
                <Switch
                  checked={(preferences as any)[item.key]}
                  onChange={(_, checked) =>
                    setPreferences((prev) => ({ ...prev, [item.key]: checked }))
                  }
                />
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-6">
          <h2 className="text-lg font-semibold text-slate-900">Subscriptions</h2>
          <p className="text-sm text-slate-500 mt-1">
            Choose which product updates you want to receive by email.
          </p>
          <div className="mt-5 flex flex-col gap-3">
            <label className="inline-flex items-center gap-3 text-sm text-slate-600">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-[#ff7800] focus:ring-[#ff7800]"
                checked={preferences.newsletter}
                onChange={(e) =>
                  setPreferences((prev) => ({ ...prev, newsletter: e.target.checked }))
                }
              />
              Subscribe to weekly product newsletter
            </label>
            <label className="inline-flex items-center gap-3 text-sm text-slate-600">
              <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-[#ff7800]" />
              Send me release notes and enhancements
            </label>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserSettingsScreen;

