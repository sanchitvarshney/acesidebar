import React from "react";
import { useLocation, Outlet } from "react-router-dom";
import {
  Avatar,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment
} from "@mui/material";
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  InsertEmoticon as InsertEmoticonIcon,
  Phone as PhoneIcon,
  VideoCall as VideoCallIcon,
  InfoOutlined as InfoOutlinedIcon,
  MoreVert as MoreVertIcon
} from "@mui/icons-material";
import ChatLeftMenu from "./ChatLeftMenu";

// Types
interface ChatThread {
  id: string;
  name: string;
  avatarUrl?: string;
  online: boolean;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "agent";
  timestamp: string;
  day?: string;
}

// Sample data
const sampleThreads: ChatThread[] = [
  {
    id: "1",
    name: "John Doe",
    avatarUrl: "/api/placeholder/40/40",
    online: true,
    unreadCount: 2,
    lastMessage: "Thanks for the help!",
    lastMessageTime: "2m ago"
  },
  {
    id: "2", 
    name: "Jane Smith",
    avatarUrl: "/api/placeholder/40/40",
    online: false,
    unreadCount: 0,
    lastMessage: "I'll get back to you soon",
    lastMessageTime: "1h ago"
  }
];

const initialMessages: ChatMessage[] = [
  { id: "1", text: "Hello! How can I help you today?", sender: "agent", timestamp: "10:30 AM", day: "Today" },
  { id: "2", text: "I'm having trouble with my account", sender: "user", timestamp: "10:32 AM" },
  { id: "3", text: "I'd be happy to help you with that. Can you tell me more about the issue?", sender: "agent", timestamp: "10:33 AM" },
  { id: "4", text: "I can't log in to my dashboard", sender: "user", timestamp: "10:35 AM" }
];


const Chat: React.FC = () => {
  const location = useLocation();
  const [threads, setThreads] = React.useState<ChatThread[]>(sampleThreads);
  const [activeThreadId, setActiveThreadId] = React.useState<string>(threads[0]?.id || "");
  const [messages, setMessages] = React.useState<ChatMessage[]>(initialMessages);
  const [composerValue, setComposerValue] = React.useState<string>("");
  const [isCenterLoading, setIsCenterLoading] = React.useState(false);
  const emailInputRef = React.useRef<HTMLInputElement | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);

  const activeThread = React.useMemo(() => threads.find(t => t.id === activeThreadId) || null, [threads, activeThreadId]);

  const handleSend = () => {
    const text = composerValue.trim();
    if (!text) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);
    setComposerValue("");

    // Simulate agent response
    setTimeout(() => {
      const agentResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for your message. I'll get back to you shortly.",
        sender: "agent",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, agentResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col bg-[#f0f4f9] h-[calc(100vh-115px)]">
      <div className="flex items-center justify-between px-5 py-2 pb-2 border-b w-full bg-#f0f4f9">
        <span className="text-xl font-semibold">Chat</span>
        <div className="flex items-center gap-3">
        </div>
      </div>
      <div className="flex flex-1 h-0 min-h-0">
        <ChatLeftMenu />
        {/* Content area with tabs */}
        <div className="flex flex-1 h-full" id="chat-content">
          {/* Render child routes or default chat interface */}
          {location.pathname === "/chat" ? (
          <div className="flex-1 h-full bg-white flex flex-col">
            {/* Chat header */}
            <div className="h-14 border-b flex items-center justify-between px-4">
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
            </div>

            {/* Content panels */}
            <div className="flex-1 relative overflow-hidden">
              {isCenterLoading && (
                <div className="absolute inset-0 z-10 bg-white flex items-center justify-center">
                  <span className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-blue-600" />
                </div>
              )}
              {/* Chats panel */}
              <div className="h-full">
                <div className="h-full overflow-y-auto bg-[#f8fafc] px-4 py-3">
                  {messages.map((m) => (
                    m.day ? (
                      <div key={m.id} className="flex items-center my-4">
                        <div className="flex-1 h-px bg-gray-300" />
                        <span className="px-3 text-xs text-gray-500 bg-[#f8fafc]">{m.day}</span>
                        <div className="flex-1 h-px bg-gray-300" />
                      </div>
                    ) : (
                      <div key={m.id} className={`flex mb-4 ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${m.sender === "user" ? "bg-blue-600 text-white" : "bg-white text-gray-800 border"}`}>
                          <div className="text-sm">{m.text}</div>
                          <div className={`text-xs mt-1 ${m.sender === "user" ? "text-blue-100" : "text-gray-500"}`}>
                            {m.timestamp}
                          </div>
                        </div>
                      </div>
                    )
                  ))}
                  {activeThread?.online && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                      <div className="mt-3 text-xs text-gray-500">{activeThread?.name} is typing...</div>
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t flex items-start gap-2 px-3 bg-white py-2 min-h-[64px]">
                <Tooltip title="Emoji">
                  <IconButton size="small"><InsertEmoticonIcon /></IconButton>
                </Tooltip>
                <Tooltip title="Attach file">
                  <IconButton size="small"><AttachFileIcon /></IconButton>
                </Tooltip>
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  placeholder="Type a message..."
                  value={composerValue}
                  onChange={(e) => setComposerValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  variant="outlined"
                  size="small"
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: '20px',
                      backgroundColor: '#f8fafc'
                    }
                  }}
                />
                <Tooltip title="Send">
                  <IconButton 
                    onClick={handleSend}
                    disabled={!composerValue.trim()}
                    sx={{ 
                      color: composerValue.trim() ? '#1976d2' : '#ccc',
                      '&:hover': { backgroundColor: '#e3f2fd' }
                    }}
                  >
                    <SendIcon />
                  </IconButton>
                </Tooltip>
            </div>
          </div>
          ) : (
            <Outlet />
          )}

        </div>
      </div>
    </div>
  );
};

export default Chat;