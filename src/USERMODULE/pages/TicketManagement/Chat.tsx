import React from "react";
import LeftMenu from "./LeftMenu";
import { Avatar, Badge, IconButton, Tooltip } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import SendIcon from "@mui/icons-material/Send";
import ImageIcon from "@mui/icons-material/Image";
import PhoneIcon from "@mui/icons-material/Phone";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AddIcon from "@mui/icons-material/Add";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

type ChatMessage = {
  id: string;
  sender: "me" | "them";
  text?: string;
  time: string;
  attachments?: { name: string; type: string; size?: string }[];
  day?: string; // optional day separator label (e.g., "Today")
};

type ChatThread = {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatarUrl?: string;
  pinned?: boolean;
  online?: boolean;
};

type TicketSummary = {
  id: string;
  subject: string;
  number: string;
  priority?: string;
  updatedAgo: string;
};

const sampleThreads: ChatThread[] = [
  {
    id: "u1",
    name: "John Doe",
    lastMessage: "Thanks! I will check and get back.",
    time: "09:42",
    unread: 2,
    avatarUrl: "https://i.pravatar.cc/100?img=1",
    online: true,
  },
  {
    id: "u2",
    name: "Acme Corp",
    lastMessage: "Can you share the logs?",
    time: "Yesterday",
    unread: 0,
    avatarUrl: "https://i.pravatar.cc/100?img=5",
    pinned: true,
  },
  {
    id: "u3",
    name: "Jane Smith",
    lastMessage: "Got it. Appreciate the help!",
    time: "Mon",
    unread: 0,
    avatarUrl: "https://i.pravatar.cc/100?img=3",
  },
];

const initialMessages: ChatMessage[] = [
  { id: "d1", sender: "them", time: "", day: "Today" },
  {
    id: "m1",
    sender: "them",
    text: "Hi! I’m facing issues logging in to the portal.",
    time: "09:15",
  },
  {
    id: "m2",
    sender: "me",
    text: "Happy to help. Do you see any error message?",
    time: "09:17",
  },
  {
    id: "m3",
    sender: "them",
    text: "It says invalid credentials, but I’m sure they are correct.",
    time: "09:19",
  },
  {
    id: "m4",
    sender: "me",
    text: "I’ll reset your login and share a temporary password.",
    time: "09:22",
  },
];

const recentTickets: TicketSummary[] = [
  { id: "T-1024", subject: "Unable to login to portal", number: "T-1024", priority: "High", updatedAgo: "2h ago" },
  { id: "T-1023", subject: "Billing discrepancy in invoice", number: "T-1023", priority: "Medium", updatedAgo: "8h ago" },
  { id: "T-1022", subject: "Feature request: Dark Mode", number: "T-1022", priority: "Low", updatedAgo: "1d ago" },
];

const Chat: React.FC = () => {
  const [threads, setThreads] = React.useState<ChatThread[]>(sampleThreads);
  const [activeThreadId, setActiveThreadId] = React.useState<string>(threads[0]?.id || "");
  const [messages, setMessages] = React.useState<ChatMessage[]>(initialMessages);
  const [composerValue, setComposerValue] = React.useState<string>("");
  const [chatSearch, setChatSearch] = React.useState<string>("");
  const [showRecentTickets, setShowRecentTickets] = React.useState<boolean>(true);
  const [activeTopTab, setActiveTopTab] = React.useState<"chats" | "new" | "prefs">("chats");
  const [newChatTo, setNewChatTo] = React.useState<string>("");
  const [newChatMessage, setNewChatMessage] = React.useState<string>("");
  const [prefNotifications, setPrefNotifications] = React.useState<boolean>(true);
  const [prefSound, setPrefSound] = React.useState<boolean>(true);
  const [prefCompact, setPrefCompact] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (activeTopTab !== "chats") {
      setShowRecentTickets(false);
    }
  }, [activeTopTab]);

  const activeThread = React.useMemo(() => threads.find(t => t.id === activeThreadId) || null, [threads, activeThreadId]);

  const handleSend = () => {
    const text = composerValue.trim();
    if (!text) return;
    const newMsg: ChatMessage = {
      id: `m_${Date.now()}`,
      sender: "me",
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMsg]);
    setComposerValue("");
  };

  const filteredThreads = React.useMemo(() => {
    const q = chatSearch.trim().toLowerCase();
    if (!q) return threads;
    return threads.filter(t => t.name.toLowerCase().includes(q) || t.lastMessage.toLowerCase().includes(q));
  }, [threads, chatSearch]);

  return (
    <div className="flex flex-col bg-[#f0f4f9] h-[calc(100vh-115px)]">
      <div className="flex items-center justify-between px-5 py-2 pb-2 border-b w-full bg-#f0f4f9">
        <span className="text-xl font-semibold">Chat</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTopTab("chats")}
            className={`px-2 py-1 text-sm ${activeTopTab === "chats" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-700 hover:text-blue-600"}`}
          >
            Chats
          </button>
          <button
            onClick={() => setActiveTopTab("new")}
            className={`px-2 py-1 text-sm inline-flex items-center gap-1 ${activeTopTab === "new" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-700 hover:text-blue-600"}`}
            title="New Chat"
          >
            <AddIcon fontSize="small" /> New Chat
          </button>
          <button
            onClick={() => setActiveTopTab("prefs")}
            className={`px-2 py-1 text-sm inline-flex items-center gap-1 ${activeTopTab === "prefs" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-700 hover:text-blue-600"}`}
            title="Preferences"
          >
            <SettingsOutlinedIcon fontSize="small" /> Preferences
          </button>
          <Tooltip title="Mark all as read"><IconButton size="small"><DoneAllIcon /></IconButton></Tooltip>
        </div>
      </div>
      <div className="flex flex-1 h-0 min-h-0">
        <LeftMenu />
        {/* Content area with tabs */}
        <div className="flex flex-1 h-full">
          {/* Column 1: Chat List (visible in Chats tab only) */}
          <div className="w-80 min-w-[280px] border-r bg-white h-full flex flex-col">
            {/* List header with search */}
            <div className="p-3 border-b">
              <div className="flex items-center gap-2 bg-[#f5f7fb] rounded px-2 py-1">
                <SearchIcon fontSize="small" className="text-gray-500" />
                <input
                  value={chatSearch}
                  onChange={e => setChatSearch(e.target.value)}
                  placeholder="Search chats"
                  className="bg-transparent outline-none text-sm flex-1 py-1"
                />
                <Tooltip title="Filters">
                  <IconButton size="small">
                    <FilterListIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
            {/* Chats */}
            <div className={`flex-1 overflow-y-auto ${activeTopTab === "chats" ? "" : "opacity-30 pointer-events-none"}`}>
              {filteredThreads.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveThreadId(t.id)}
                  className={`w-full text-left px-3 py-2 border-b hover:bg-gray-50 flex items-center gap-3 ${
                    activeThreadId === t.id ? "bg-[#eef3ff]" : ""
                  }`}
                >
                  <div className="relative">
                    <Avatar src={t.avatarUrl} sx={{ width: 40, height: 40 }} />
                    {t.online && (
                      <span className="absolute bottom-0 right-0 block w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800 truncate max-w-[140px]">
                        {t.name}
                      </span>
                      <span className="text-xs text-gray-500">{t.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600 truncate max-w-[180px]">{t.lastMessage}</span>
                      {t.unread > 0 && (
                        <Badge color="primary" badgeContent={t.unread} />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Column 2: Main Panel (varies by tab) */}
          <div className="flex-1 h-full bg-white flex flex-col">
            {/* Chat header */}
            <div className="h-14 border-b flex items-center justify-between px-4">
              {activeTopTab === "chats" && (
                <>
                  <div className="flex items-center gap-3">
                    <Avatar src={activeThread?.avatarUrl} sx={{ width: 36, height: 36 }} />
                    <div className="leading-tight">
                      <div className="font-semibold text-gray-800">{activeThread?.name || "Select a chat"}</div>
                      <div className="text-xs text-gray-500">{activeThread?.online ? "Online" : "Offline"}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Tooltip title="Audio call">
                      <IconButton size="small"><PhoneIcon fontSize="small" /></IconButton>
                    </Tooltip>
                    <Tooltip title="Video call">
                      <IconButton size="small"><VideoCallIcon fontSize="small" /></IconButton>
                    </Tooltip>
                    <Tooltip title="Details">
                      <IconButton size="small"><InfoOutlinedIcon fontSize="small" /></IconButton>
                    </Tooltip>
                    <IconButton size="small"><MoreVertIcon fontSize="small" /></IconButton>
                  </div>
                </>
              )}
              {activeTopTab === "new" && (
                <div className="font-semibold text-gray-800">Start a new chat</div>
              )}
              {activeTopTab === "prefs" && (
                <div className="font-semibold text-gray-800">Chat preferences</div>
              )}
            </div>

            {/* Main content by tab */}
            {activeTopTab === "chats" && (
              <div className="flex-1 overflow-y-auto bg-[#f8fafc] px-4 py-3">
                {messages.map((m) => (
                  m.day ? (
                    <div key={m.id} className="flex items-center my-4">
                      <div className="flex-1 h-px bg-gray-300" />
                      <span className="px-3 text-xs text-gray-600">{m.day}</span>
                      <div className="flex-1 h-px bg-gray-300" />
                    </div>
                  ) : (
                    <div
                      key={m.id}
                      className={`w-full flex ${m.sender === "me" ? "justify-end" : "justify-start"} mb-2`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-3 py-2 shadow-sm ${
                          m.sender === "me" ? "bg-blue-600 text-white" : "bg-white text-gray-800 border"
                        }`}
                      >
                        {m.text && <div className="whitespace-pre-wrap text-sm">{m.text}</div>}
                        {m.attachments && m.attachments.length > 0 && (
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            {m.attachments.map((a, idx) => (
                              <div key={idx} className="border rounded p-2 bg-white text-gray-700">
                                <div className="text-xs font-medium truncate">{a.name}</div>
                                <div className="text-[10px] text-gray-500">{a.type}{a.size ? ` • ${a.size}` : ""}</div>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className={`text-[10px] mt-1 ${m.sender === "me" ? "text-blue-100" : "text-gray-500"}`}>{m.time}</div>
                      </div>
                    </div>
                  )
                ))}
                <div className="mt-3 text-xs text-gray-500">{activeThread?.name} is typing...</div>
              </div>
            )}

            {activeTopTab === "new" && (
              <div className="flex-1 overflow-y-auto bg-white px-4 py-3">
                <div className="max-w-xl">
                  <label className="block text-sm text-gray-700 mb-1">To</label>
                  <input
                    value={newChatTo}
                    onChange={(e) => setNewChatTo(e.target.value)}
                    placeholder="Search user or enter email"
                    className="w-full border rounded px-3 py-2 mb-3 outline-none focus:ring-2 focus:ring-blue-200"
                  />
                  <label className="block text-sm text-gray-700 mb-1">Message</label>
                  <textarea
                    value={newChatMessage}
                    onChange={(e) => setNewChatMessage(e.target.value)}
                    placeholder="Type your message"
                    className="w-full border rounded px-3 py-2 h-40 outline-none focus:ring-2 focus:ring-blue-200"
                  />
                  <div className="mt-3 flex items-center gap-2">
                    <Tooltip title="Send">
                      <span>
                        <IconButton color="primary" onClick={() => { /* hook to API */ }} disabled={!newChatTo.trim() || !newChatMessage.trim()}>
                          <SendIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </div>
                </div>
              </div>
            )}

            {activeTopTab === "prefs" && (
              <div className="flex-1 overflow-y-auto bg-white px-4 py-3">
                <div className="max-w-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-800">Notifications</div>
                      <div className="text-xs text-gray-500">Enable chat notifications</div>
                    </div>
                    <label className="inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={prefNotifications} onChange={(e) => setPrefNotifications(e.target.checked)} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600 relative">
                        <div className={`absolute top-0.5 left-0.5 h-5 w-5 bg-white rounded-full transition-all ${prefNotifications ? 'translate-x-5' : ''}`}></div>
                      </div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-800">Sound</div>
                      <div className="text-xs text-gray-500">Play sound on new message</div>
                    </div>
                    <label className="inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={prefSound} onChange={(e) => setPrefSound(e.target.checked)} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600 relative">
                        <div className={`absolute top-0.5 left-0.5 h-5 w-5 bg-white rounded-full transition-all ${prefSound ? 'translate-x-5' : ''}`}></div>
                      </div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-800">Compact mode</div>
                      <div className="text-xs text-gray-500">Reduce padding and message spacing</div>
                    </div>
                    <label className="inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={prefCompact} onChange={(e) => setPrefCompact(e.target.checked)} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600 relative">
                        <div className={`absolute top-0.5 left-0.5 h-5 w-5 bg-white rounded-full transition-all ${prefCompact ? 'translate-x-5' : ''}`}></div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTopTab === "chats" && (
              <div className="h-16 border-t flex items-center gap-2 px-3 bg-white">
                <Tooltip title="Emoji">
                  <IconButton size="small"><InsertEmoticonIcon /></IconButton>
                </Tooltip>
                <Tooltip title="Attach file">
                  <IconButton size="small"><AttachFileIcon /></IconButton>
                </Tooltip>
                <Tooltip title="Insert image">
                  <IconButton size="small"><ImageIcon /></IconButton>
                </Tooltip>
                <input
                  value={composerValue}
                  onChange={(e) => setComposerValue(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSend(); } }}
                  placeholder="Type a message"
                  className="flex-1 bg-[#f5f7fb] rounded px-3 py-2 outline-none text-sm"
                />
                <Tooltip title="Send">
                  <span>
                    <IconButton color="primary" onClick={handleSend} disabled={!composerValue.trim()}>
                      <SendIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </div>
            )}
          </div>

          {/* Column 3: Recent Tickets (collapsible with animated width) */}
          {activeTopTab === "chats" && (
            <div
              className={`border-l bg-white h-full flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
                showRecentTickets ? "w-80 min-w-[300px]" : "w-6 min-w-[24px]"
              }`}
            >
              <div className="h-14 border-b flex items-center justify-between px-4">
                {showRecentTickets ? (
                  <>
                    <span className="font-semibold text-gray-800">Recent Tickets</span>
                    <div className="flex items-center">
                      <Tooltip title="Collapse">
                        <IconButton size="small" onClick={() => setShowRecentTickets(false)}>
                          <ChevronRightIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </>
                ) : (
                  <div className="w-full flex items-center justify-center">
                    <Tooltip title="Expand Recent Tickets" placement="left">
                      <div
                        className="cursor-pointer"
                        onClick={() => setShowRecentTickets(true)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowRecentTickets(true); } }}
                      >
                        <ChevronLeftIcon fontSize="small" />
                      </div>
                    </Tooltip>
                  </div>
                )}
              </div>
              <div className={`flex-1 overflow-y-auto p-3 transition-opacity duration-300 ${showRecentTickets ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                {recentTickets.map((t) => (
                  <div key={t.id} className="border rounded-md p-3 mb-3 hover:shadow-sm">
                    <div className="text-sm font-medium text-gray-800 truncate" title={t.subject}>{t.subject}</div>
                    <div className="text-xs text-gray-600 mt-0.5">#{t.number} • {t.updatedAgo}</div>
                    {t.priority && (
                      <div className="mt-2 text-[11px] inline-block px-2 py-0.5 rounded-full bg-[#f5f7fb] text-gray-700">
                        Priority: {t.priority}
                      </div>
                    )}
                    <div className="mt-2 flex gap-2">
                      <button className="text-xs text-blue-600 hover:underline">Open</button>
                      <button className="text-xs text-blue-600 hover:underline">Reply</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;


