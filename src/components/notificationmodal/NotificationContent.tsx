import { Card } from "@mui/material";
import type { FC } from "react";
import { Bell, Clock } from "lucide-react";

type NotificationContentPropsType = {
  title: string;
  message: any;
  time: string;
};

const NotificationContent: FC<NotificationContentPropsType> = ({
  title,
  message,
  time,
}) => {
  return (
    <Card
      elevation={1}
      sx={{ 
        borderRadius: "12px",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
        }
      }}
      className="py-2 px-3 bg-gradient-to-br from-[#f0f7fa] to-[#e0f2f1]  border border-gray-100  hover:border-[#2eacb3]  cursor-pointer"
    >
      <div className="flex items-start gap-4">
    
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-[#e0f2f1]  rounded-full flex items-center justify-center">
            <Bell className="w-5 h-5 text-[#2eacb3]" />
          </div>
        </div>

      
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h5 className="text-base font-semibold text-gray-900 dark:text-gray-100 leading-tight mb-2">
                {title}
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                {message}
              </p>
            </div>
            
        
            <div className="flex-shrink-0 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Clock className="w-3 h-3" />
              <span className="whitespace-nowrap">{time}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NotificationContent;
