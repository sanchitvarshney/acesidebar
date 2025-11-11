import {
  Bell,
  CheckCheck,
  Image,
  Info,
  MessageSquare,
  Mic,
  MoreHorizontal,
  Music,
  Paperclip,
  Plus,
  Search,
  Send,
  Share2,
  Smile,
  UserRound,
  Volume2,
  Clock,
} from "lucide-react";

const contacts = [
  {
    id: 1,
    name: "Josephine Walter",
    status: "Typing…",
    time: "22/10/24",
    color: "#f97316",
    unread: 1,
    active: false,
  },
  {
    id: 2,
    name: "Mari",
    status: "This is nice, I love it ❤️",
    time: "Just now",
    color: "#f43f5e",
    unread: 2,
    active: false,
  },
  {
    id: 3,
    name: "Lea",
    status: "What are you doing…",
    time: "22/10/24",
    color: "#facc15",
    unread: 0,
    active: true,
  },
  {
    id: 4,
    name: "Kristin Watson",
    status: "Okay! I will try it. 😊",
    time: "Yesterday",
    color: "#a855f7",
    unread: 0,
    active: false,
  },
  {
    id: 5,
    name: "15 Rocks",
    status: "You: This is COOL",
    time: "18/08/24",
    color: "#0ea5e9",
    unread: 0,
    active: false,
  },
  {
    id: 6,
    name: "Jesus Watson",
    status: "Sent you an image",
    time: "14/12/24",
    color: "#34d399",
    unread: 0,
    active: false,
  },
];

const chatMessages = [
  {
    id: "m1",
    sender: "Lea",
    text: "Hi Angelo! Let’s go out",
    time: "01:32 AM",
    align: "left",
  },
  {
    id: "m2",
    sender: "Lea",
    text: "I have a vacation plan in Ladakh for next week.",
    time: "01:40 AM",
    align: "left",
  },
  {
    id: "m3",
    sender: "Angelo",
    text: "Let’s go, but what’s the plan?",
    time: "01:40 AM",
    align: "right",
  },
  {
    id: "m4",
    sender: "Lea",
    text: "You understand 🧡",
    time: "01:45 AM",
    align: "left",
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

const UserChatScreen = () => {
  return (
    <div className="w-full h-full min-h-[calc(100vh-74px)] bg-slate-100 flex overflow-hidden">
      {/* Conversation list */}
      <section className="w-full lg:w-[320px] bg-white flex flex-col border-r border-slate-200">
        <div className="px-5 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm uppercase tracking-wide">Messages</p>
              <p className="text-lg font-semibold text-slate-900">
                Message <span className="text-slate-500">(10)</span>
              </p>
            </div>
            <button className="h-10 w-10 flex items-center justify-center rounded-full bg-[#00a884]/10 text-[#00a884]">
              <Search size={18} />
            </button>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1 flex items-center bg-slate-100 rounded-full px-3 py-2">
              <Search size={18} className="text-slate-400 mr-2" />
              <input
                className="flex-1 bg-transparent text-sm text-slate-600 placeholder:text-slate-400 outline-none"
                placeholder="Search conversation…"
              />
            </div>
            <button className="h-10 w-10 flex items-center justify-center rounded-full bg-[#00a884]/10 text-[#00a884]">
              <Plus size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <ul className="divide-y divide-slate-100">
            {contacts.map((contact) => (
              <li key={contact.id}>
                <button
                  type="button"
                  className={`w-full flex items-center gap-3 px-5 py-4 transition ${
                    contact.active ? "bg-[#e6f7f3]" : "bg-white hover:bg-slate-50"
                  }`}
                >
                  <div
                    className="h-12 w-12 rounded-full flex items-center justify-center text-sm font-semibold text-white"
                    style={{ backgroundColor: contact.color }}
                  >
                    {initials(contact.name)}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900">
                        {contact.name}
                      </p>
                      <span className="text-xs text-slate-400">{contact.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">{contact.status}</p>
                  </div>
                  {contact.unread > 0 && (
                    <span className="text-xs font-semibold bg-[#00a884] text-white rounded-full px-2 py-0.5">
                      {contact.unread}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Conversation area */}
      <main className="flex-1 flex flex-col bg-[#e6f7f3]">
        <header className="flex items-center justify-between px-8 py-5 border-b border-[#cde7de]">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-[#facc15] flex items-center justify-center text-sm font-semibold text-white">
              {initials("Lea")}
            </div>
            <div>
              <p className="text-base font-semibold text-slate-900">Lea</p>
              <p className="text-xs text-[#00a884] font-medium">Online</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3 text-[#00a884]">
            <button className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-[#00a884]/10">
              <Volume2 size={18} />
            </button>
            <button className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-[#00a884]/10">
              <Search size={18} />
            </button>
            <button className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-[#00a884]/10">
              <Image size={18} />
            </button>
            <button className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-[#00a884]/10">
              <Info size={18} />
            </button>
            <button className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-[#00a884]/10">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar space-y-6 bg-[url('https://svgshare.com/i/15xv.svg')] bg-[length:340px]">
          {chatMessages.map((message) => {
            const isOwn = message.align === "right";
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div className="flex items-end gap-3 max-w-[60%]">
                  {!isOwn && (
                    <div className="h-9 w-9 rounded-full bg-[#facc15] flex items-center justify-center text-xs font-semibold text-white">
                      {initials(message.sender)}
                    </div>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-3 shadow-sm ${
                      isOwn
                        ? "bg-[#00a884] text-white rounded-br-none"
                        : "bg-white text-slate-700 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <span
                      className={`mt-2 text-[11px] flex items-center gap-1 ${
                        isOwn ? "text-white/70" : "text-slate-400"
                      }`}
                    >
                      {message.time}
                      {isOwn && <CheckCheck size={14} />}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <footer className="px-8 py-5 border-t border-[#cde7de] bg-[#f0faf7]">
          <div className="flex items-center gap-3">
            <button className="h-11 w-11 rounded-full bg-white text-[#00a884] flex items-center justify-center border border-[#cde7de]">
              <Plus size={20} />
            </button>
            <div className="flex-1 flex items-center bg-white border border-[#cde7de] rounded-full px-4 py-2 shadow-sm">
              <button className="text-[#00a884] mr-2">
                <Smile size={20} />
              </button>
              <input
                className="flex-1 bg-transparent outline-none text-sm text-slate-600"
                placeholder="Write your message…"
              />
              <div className="flex items-center gap-3 text-[#00a884]">
                <button>
                  <Paperclip size={20} />
                </button>
                <button>
                  <Image size={20} />
                </button>
                <button>
                  <Mic size={20} />
                </button>
              </div>
            </div>
            <button className="h-11 w-11 rounded-full bg-[#00a884] text-white flex items-center justify-center shadow-md">
              <Send size={18} />
            </button>
          </div>
        </footer>
      </main>

    </div>
  );
};

export default UserChatScreen;

