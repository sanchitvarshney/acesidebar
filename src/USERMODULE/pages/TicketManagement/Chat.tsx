import React from "react";
import LeftMenu from "./LeftMenu";
import { Avatar, Badge, IconButton, Tooltip, Button, Chip, TextField, Select, MenuItem, Popover, FormGroup, FormControlLabel, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
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
  day?: string; 
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
  isGroup?: boolean;
};

type TicketSummary = {
  id: string;
  subject: string;
  number: string;
  priority?: string;
  updatedAgo: string;
};

const DEFAULT_INVITE_MESSAGE =
  "Hi there! 👋 I’d like to invite you to a quick chat about your request. Please join when you’re available. Thanks!";

type InviteItem = {
  id: string;
  email: string;
  read: boolean;
  invitedAt: string;
  status?: "sent" | "postponed" | "delivered" | "failed";
  postponed?: boolean;
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
    name: "Support Group",
    lastMessage: "Can you share the logs?",
    time: "Yesterday",
    unread: 0,
    avatarUrl: "https://i.pravatar.cc/100?img=5",
    pinned: true,
    isGroup: true,
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

const initialInvites: InviteItem[] = [
  { id: "i1", email: "alex@example.com", read: false, invitedAt: "10:05", status: "sent" },
  { id: "i2", email: "sam@acme.co", read: true, invitedAt: "Yesterday", status: "delivered" },
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
  const [newChatMessage, setNewChatMessage] = React.useState<string>(DEFAULT_INVITE_MESSAGE);
  const [invites, setInvites] = React.useState<InviteItem[]>(initialInvites);
  const [inviteFilterQuery, setInviteFilterQuery] = React.useState<string>("");
  const [inviteFilterState, setInviteFilterState] = React.useState<"sent" | "read" | "unread" | "failed" | "postponed">("sent");
  const [tabLoading, setTabLoading] = React.useState<boolean>(false);
  const [prefNotifications, setPrefNotifications] = React.useState<boolean>(true);
  const [prefSound, setPrefSound] = React.useState<boolean>(true);
  const [prefEnterToSend, setPrefEnterToSend] = React.useState<boolean>(true);
  const [prefMuteChat, setPrefMuteChat] = React.useState<boolean>(false);

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

  // Chat list filters
  const [filterUnread, setFilterUnread] = React.useState<boolean>(false);
  const [filterGroups, setFilterGroups] = React.useState<boolean>(false);

  const filteredThreads = React.useMemo(() => {
    const q = chatSearch.trim().toLowerCase();
    let list = threads.filter(t => t.name.toLowerCase().includes(q) || t.lastMessage.toLowerCase().includes(q));
    if (filterUnread) list = list.filter(t => (t.unread || 0) > 0);
    if (filterGroups) list = list.filter(t => t.isGroup);
    return list;
  }, [threads, chatSearch, filterUnread, filterGroups]);

  const handlePostponeInvite = (inviteId: string) => {
    // Do not change status chip text; only mark a separate postponed flag
    setInvites(prev => prev.map(i => i.id === inviteId ? { ...i, postponed: true } : i));
  };

  const filteredInvites = React.useMemo(() => {
    let list = invites;
    const q = inviteFilterQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(i => i.email.toLowerCase().includes(q))
    }
    switch (inviteFilterState) {
      case 'sent':
        list = list.filter(i => !i.postponed && ((i.status || 'sent') === 'sent' || (i.status || 'sent') === 'delivered'));
        break;
      case 'read':
        list = list.filter(i => i.read === true);
        break;
      case 'failed':
        list = list.filter(i => (i.status || 'sent') === 'failed');
        break;
      case 'postponed':
        list = list.filter(i => i.postponed === true);
        break;
      default:
        break;
    }
    return list;
  }, [invites, inviteFilterQuery, inviteFilterState]);

  const [isCenterLoading, setIsCenterLoading] = React.useState(false);
  const emailInputRef = React.useRef<HTMLInputElement | null>(null);
  const [chatFilterAnchorEl, setChatFilterAnchorEl] = React.useState<HTMLElement | null>(null);
  const chatFilterOpen = Boolean(chatFilterAnchorEl);
  // (moved to top) duplicate declarations removed
  const [groups, setGroups] = React.useState<string[]>(["Support Group"]);
  const [createGroupOpen, setCreateGroupOpen] = React.useState<boolean>(false);
  const [newGroupName, setNewGroupName] = React.useState<string>("");
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (activeTopTab === "new" && !isCenterLoading) {
      setTimeout(() => {
        try { emailInputRef.current?.focus(); } catch (_) {}
      }, 50);
    }
  }, [activeTopTab, isCenterLoading]);

  React.useEffect(() => {
    if (activeTopTab === 'chats') {
      try { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); } catch (_) {}
    }
  }, [messages.length, activeTopTab]);

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
            onClick={() => {
              setIsCenterLoading(true);
              setActiveTopTab("new");
              setTimeout(() => setIsCenterLoading(false), 1000);
            }}
            className={`px-2 py-1 text-sm inline-flex items-center gap-1 ${activeTopTab === "new" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-700 hover:text-blue-600"}`}
            title="New Chat"
          >
            <AddIcon fontSize="small" /> New Chat
          </button>
          <button
            onClick={() => {
              setIsCenterLoading(true);
              setActiveTopTab("prefs");
              setTimeout(() => setIsCenterLoading(false), 1000);
            }}
            className={`px-2 py-1 text-sm inline-flex items-center gap-1 ${activeTopTab === "prefs" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-700 hover:text-blue-600"}`}
            title="Preferences"
          >
            <SettingsOutlinedIcon fontSize="small" /> Preferences
          </button>
          {activeTopTab === "chats" && (
            <Tooltip title="Mark all as read"><IconButton size="small"><DoneAllIcon /></IconButton></Tooltip>
          )}
        </div>
      </div>
      <div className="flex flex-1 h-0 min-h-0">
        <LeftMenu />
        {/* Content area with tabs */}
        <div className="flex flex-1 h-full">
          {/* Column 1: Chat List (visible in Chats tab only) */}
          <div className={`w-80 min-w-[280px] border-r bg-white h-full flex flex-col ${activeTopTab === 'chats' ? 'opacity-100' : 'blur-sm pointer-events-none'}`}>
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
                <IconButton size="small" onClick={(e) => setChatFilterAnchorEl(e.currentTarget)}>
                  <FilterListIcon fontSize="small" />
                </IconButton>
                <Popover
                  open={chatFilterOpen}
                  anchorEl={chatFilterAnchorEl}
                  onClose={() => setChatFilterAnchorEl(null)}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  PaperProps={{ sx: { p: 1.5 } }}
                >
                  <div className="min-w-[220px]">
                    <div className="text-sm font-medium mb-1">Show chats</div>
                    <FormGroup>
                      <FormControlLabel control={<Checkbox size="small" checked={filterUnread} onChange={(e) => setFilterUnread(e.target.checked)} />} label="Unread" />
                      <FormControlLabel control={<Checkbox size="small" checked={filterGroups} onChange={(e) => setFilterGroups(e.target.checked)} />} label="Groups" />
                    </FormGroup>
                    <div className="mt-2">
                      <Button size="small" variant="outlined" onClick={() => { setCreateGroupOpen(true); setChatFilterAnchorEl(null); }}>Create group</Button>
                    </div>
                  </div>
                </Popover>
                <Dialog open={createGroupOpen} onClose={() => setCreateGroupOpen(false)}>
                  <DialogTitle>Create new group</DialogTitle>
                  <DialogContent>
                    <TextField
                      autoFocus
                      margin="dense"
                      label="Group name"
                      fullWidth
                      variant="outlined"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setCreateGroupOpen(false)}>Cancel</Button>
                    <Button
                      variant="contained"
                      onClick={() => {
                        const name = (newGroupName || '').trim();
                        if (name) {
                          setGroups(prev => Array.from(new Set([...prev, name])));
                        }
                        setNewGroupName("");
                        setCreateGroupOpen(false);
                      }}
                    >
                      Create
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            </div>
            <Dialog open={createGroupOpen} onClose={() => setCreateGroupOpen(false)}>
              <DialogTitle>Create group</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Group name"
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value.replace(/[^A-Za-z0-9 _-]/g, ''))}
                />
                <div className="mt-3">
                  <div className="text-sm font-medium mb-1">Add members (e-mail)</div>
                  <TextField
                    placeholder="Type email and press Enter"
                    fullWidth
                    size="small"
                    variant="outlined"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const target = e.target as HTMLInputElement;
                        const val = (target.value || '').trim();
                        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
                          setGroups((g) => g);
                          // store members in a temp array on dialog element
                          const container: any = (e.currentTarget as any).__members || [];
                          container.push(val);
                          (e.currentTarget as any).__members = container;
                          target.value = '';
                        }
                      }
                    }}
                  />
                  <div className="text-[11px] text-gray-500 mt-1">Multiple emails supported. Press Enter to add each.</div>
                </div>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setCreateGroupOpen(false)}>Cancel</Button>
                <Button
                  onClick={() => {
                    const name = (newGroupName || '').trim();
                    if (!name) return;
                    setGroups((g) => Array.from(new Set([...g, name])));
                    setThreads((t) => [{ id: `g_${Date.now()}`, name, lastMessage: "", time: "", unread: 0, isGroup: true }, ...t]);
                    setNewGroupName("");
                    setCreateGroupOpen(false);
                  }}
                  variant="contained"
                >
                  Create
                </Button>
              </DialogActions>
            </Dialog>
            {/* Chats */}
            <div className={`flex-1 overflow-y-auto ${activeTopTab === "chats" ? "" : "opacity-30 pointer-events-none blur-sm"}`}>
              {filteredThreads.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveThreadId(t.id)}
                  className={`w-full text-left px-3 py-2 border-b hover:bg-gray-50 flex items-center gap-3 h-20 ${activeThreadId === t.id ? "bg-[#eef3ff]" : ""
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

            {/* Content panels */}
            <div className="flex-1 relative overflow-hidden">
              {isCenterLoading && (
                <div className="absolute inset-0 z-10 bg-white flex items-center justify-center">
                  <span className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-blue-600" />
                </div>
              )}
              {/* Chats panel */}
              <div className={`${activeTopTab === 'chats' ? '' : 'hidden'} h-full`}>
                <div className="h-full overflow-y-auto bg-[#f8fafc] px-4 py-3">
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
                          className={`max-w-[70%] rounded-lg px-3 py-2 shadow-sm ${m.sender === "me" ? "bg-blue-600 text-white" : "bg-white text-gray-800 border"
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
                  <div ref={messagesEndRef} />
                </div>
              </div>
              {/* New chat panel */}
              <div className={`${activeTopTab === 'new' ? '' : 'hidden'} h-full`}>
                <div className="h-full overflow-y-auto bg-white px-4 py-3">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                    {/* Left: Invite form */}
                    <div className="max-w-xl">
                      <TextField
                        fullWidth
                        label="To (e-mail address)"
                        variant="outlined"
                        size="medium"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        inputRef={emailInputRef}
                        value={newChatTo}
                        onChange={(e) => {
                          const sanitized = (e.target.value || '')
                            .replace(/\s+/g, '')
                            .replace(/[^A-Za-z0-9@._-]/g, '');
                          setNewChatTo(sanitized);
                        }}
                        onBlur={(e) => setNewChatTo((e.target.value || '').trim())}
                        placeholder="name@example.com"
                        helperText={newChatTo !== '' && !(/[^^\s@]+@[^\s@]+\.[^\s@]+/.test(newChatTo)) ? 'Please enter a valid email address' : ' '}
                        error={newChatTo !== '' && !(/[^^\s@]+@[^\s@]+\.[^\s@]+/.test(newChatTo))}
                        FormHelperTextProps={{ sx: { m: 0 } }}
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        fullWidth
                        label="Message"
                        variant="outlined"
                        multiline
                        minRows={9}
                        placeholder={"Hi there!\n\nI would like to invite you to a quick chat about your request.\n\nPlease join when you're available. Thanks!"}
                        value={newChatMessage}
                        inputProps={{ maxLength: 200 }}
                        onChange={(e) => {
                          const raw = e.target.value || '';
                         const allowed = raw.replace(/[^A-Za-z0-9\s\n,.@#'\[\]\{\}\|\/\\!&\*%\(\);]/g, '');
                          setNewChatMessage(allowed);
                        }}
                      />

                      <div className="mt-1 text-[11px] text-gray-500 text-right">{200 - newChatMessage.length} characters left</div>
                      <div className="mt-3 flex items-center justify-end">
                        {/[^\s@]+@[^\s@]+\.[^\s@]+/.test(newChatTo) && (
                          <Tooltip title="Send">
                            <span>
                              <IconButton color="primary" onClick={() => { /* hook to API */ }}>
                                <SendIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                        )}
                      </div>
                    </div>

                    {/* Right: Invites history */}
                    <div className="bg-[#f8fafc] border rounded flex flex-col h-full">
                      <div className="h-12 border-b flex items-center justify-between px-3">
                        <span className="font-medium text-gray-800">Invite history</span>
                        <Chip size="small" label={`${filteredInvites.length}`} />
                      </div>
                      {/* Filters */}
                      <div className="border-b px-3 py-2 flex items-center gap-2 bg-white">
                        <TextField
                          size="small"
                          placeholder="Search @e-mail address"
                          value={inviteFilterQuery}
                          onChange={(e) => setInviteFilterQuery(e.target.value)}
                          sx={{ flex: 1 }}
                        />
                        <Select size="small" value={inviteFilterState} onChange={(e) => setInviteFilterState(e.target.value as any)}>
                          <MenuItem value="sent">Sent</MenuItem>
                          <MenuItem value="read">Read</MenuItem>
                          <MenuItem value="unread">Unread</MenuItem>
                          <MenuItem value="failed">Failed</MenuItem>
                          <MenuItem value="postponed">Postponed</MenuItem>
                        </Select>
                      </div>
                      <div className="border-b px-3 py-1 text-[11px] text-gray-500 bg-yellow-100">
                        Note: Filters apply to last 3 months only.
                      </div>
                      <div className="flex-1 overflow-y-auto p-3 h-full">
                        {filteredInvites.length === 0 ? (
                          <div className="h-full flex items-center justify-center">
                            <div className="text-xs text-gray-500">No invites yet</div>
                          </div>
                        ) : (
                          filteredInvites.map((i) => (
                            <div key={i.id} className="bg-white border rounded p-3 mb-2">
                              <div className="flex items-center justify-between">
                                <div className="text-sm font-medium text-gray-800">{i.email}</div>
                                <div className="flex items-center gap-2">
                                  <span className={`text-[11px] px-2 py-0.5 rounded-full ${i.read ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{i.read ? 'Read' : 'Unread'}</span>
                                  <span
                                    className={`text-[11px] px-2 py-0.5 rounded-full capitalize ${(i.status || 'sent') === 'delivered'
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-blue-100 text-blue-700'
                                      }`}
                                  >
                                    {i.status || 'sent'}
                                  </span>
                                </div>
                              </div>
                              <div className="text-[11px] text-gray-400 mt-1">Invited at {i.invitedAt}</div>
                              <div className="mt-2">
                                {i.postponed ? (
                                  <div className="text-[11px] text-red-600 mt-1 font-semibold">
                                    Invitation link disabled (Postponed)
                                  </div>
                                ) : (
                                  <Button
                                    size="small"
                                    variant="text"
                                    sx={{ fontWeight: 600, textTransform: 'none', padding: 0 }}
                                    color="error"
                                    onClick={() => handlePostponeInvite(i.id)}
                                  >
                                    Postpone
                                  </Button>
                                )}
                              </div>

                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Preferences panel */}
              <div className={`${activeTopTab === 'prefs' ? '' : 'hidden'}`}>
                <div className="h-full overflow-y-auto bg-white px-4 py-3">
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
                        <div className="font-medium text-gray-800">Enter to send</div>
                        <div className="text-xs text-gray-500">Press Enter to send; Shift+Enter for new line</div>
                      </div>
                      <label className="inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={prefEnterToSend} onChange={(e) => setPrefEnterToSend(e.target.checked)} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600 relative">
                          <div className={`absolute top-0.5 left-0.5 h-5 w-5 bg-white rounded-full transition-all ${prefEnterToSend ? 'translate-x-5' : ''}`}></div>
                        </div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-800">Mute chat</div>
                        <div className="text-xs text-gray-500">Stop notifications for this chat</div>
                      </div>
                      <label className="inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={prefMuteChat} onChange={(e) => setPrefMuteChat(e.target.checked)} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600 relative">
                          <div className={`absolute top-0.5 left-0.5 h-5 w-5 bg-white rounded-full transition-all ${prefMuteChat ? 'translate-x-5' : ''}`}></div>
                        </div>
                      </label>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {activeTopTab === "chats" && (
              <div className="border-t flex items-start gap-2 px-3 bg-white py-2 min-h-[64px]">
                <Tooltip title="Emoji">
                  <IconButton size="small"><InsertEmoticonIcon /></IconButton>
                </Tooltip>
                <Tooltip title="Attach file">
                  <IconButton size="small"><AttachFileIcon /></IconButton>
                </Tooltip>
                <textarea
                  value={composerValue}
                  onChange={(e) => setComposerValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (prefEnterToSend && e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Type a message"
                  className="flex-1 bg-[#f5f7fb] rounded px-3 py-2 outline-none text-sm resize-none overflow-y-auto"
                  style={{ maxHeight: '25vh', minHeight: '64px' }}
                  rows={3}
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
              className={`border-l bg-white h-full flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${showRecentTickets ? "w-80 min-w-[300px]" : "w-6 min-w-[24px]"
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
              <div className={`flex-1 overflow-y-auto p-3 transition-opacity duration-300 ${showRecentTickets ? 'opacity-100' : 'opacity-0 pointer-events-none blur-sm'}`}>
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


