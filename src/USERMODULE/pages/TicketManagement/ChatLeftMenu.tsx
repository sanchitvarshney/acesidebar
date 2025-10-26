import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Tooltip, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Collapse
} from "@mui/material";
import AssessmentIcon from '@mui/icons-material/Assessment';
import {
  ExpandLess,
  ExpandMore,
  Chat as ChatIcon,
  History as HistoryIcon,
  People as PeopleIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  ChatBubble as ChatBubbleIcon,
  Mail as MailIcon,
  Tune as TuneIcon
} from "@mui/icons-material";

const ChatLeftMenu: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openSections, setOpenSections] = useState({
    chats: true,
    reports: false,
    configuration: false
  });

  const handleSectionToggle = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  const menuItems = [
    {
      section: "chats",
      title: "Chats",
      icon: <ChatIcon />,
      items: [
        { key: "overview", label: "Chats overview", icon: <ChatIcon />, path: "/chat/overview" },
        { key: "history", label: "Chats history", icon: <HistoryIcon />, path: "/chat/history" },
        { key: "visitors", label: "Online visitors", icon: <PeopleIcon />, path: "/chat/visitors" }
      ]
    },
    {
      section: "reports",
      title: "Reports",
      icon: <ReportsIcon />,
      items: [
        { key: "option1", label: "Your Options 1", icon: <AssessmentIcon />, path: "/chat/reports/option1" },
        { key: "option2", label: "Your Options 2", icon: <AssessmentIcon />, path: "/chat/reports/option2" },
        { key: "option3", label: "Your Options 3", icon: <AssessmentIcon />, path: "/chat/reports/option3" }
      ]
    },
    {
      section: "configuration",
      title: "Configuration",
      icon: <SettingsIcon />,
      items: [
        { key: "buttons", label: "Chat Buttons", icon: <ChatBubbleIcon />, path: "/chat/config/buttons" },
        { key: "invitations", label: "Invitations", icon: <MailIcon />, path: "/chat/config/invitations" },
        { key: "settings", label: "Chat settings", icon: <TuneIcon />, path: "/chat/config/settings" }
      ]
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="w-64 min-w-[256px] border-r bg-white h-full">
      <List sx={{ p: 1 }}>
        {menuItems.map((section) => (
          <React.Fragment key={section.section}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleSectionToggle(section.section)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&:hover': {
                    backgroundColor: '#f5f7fb'
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: '#20364d' }}>
                  {section.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={section.title}
                  primaryTypographyProps={{
                    fontWeight: 'medium',
                    color: '#20364d'
                  }}
                />
                {openSections[section.section as keyof typeof openSections] ? 
                  <ExpandLess /> : <ExpandMore />
                }
              </ListItemButton>
            </ListItem>
            
            <Collapse 
              in={openSections[section.section as keyof typeof openSections]} 
              timeout="auto" 
              unmountOnExit
            >
              <List component="div" disablePadding>
                {section.items.map((item) => (
                  <ListItem key={item.key} disablePadding>
                    <ListItemButton
                      onClick={() => handleNavigation(item.path)}
                      sx={{
                        pl: 4,
                        borderRadius: 1,
                        mb: 0.5,
                        backgroundColor: isActive(item.path) ? '#e3f2fd' : 'transparent',
                        '&:hover': {
                          backgroundColor: isActive(item.path) ? '#e3f2fd' : '#f5f7fb'
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40, color: isActive(item.path) ? '#1976d2' : '#666' }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: '0.875rem',
                          color: isActive(item.path) ? '#1976d2' : '#666',
                          fontWeight: isActive(item.path) ? 'medium' : 'normal'
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        ))}
      </List>
    </div>
  );
};

export default ChatLeftMenu;