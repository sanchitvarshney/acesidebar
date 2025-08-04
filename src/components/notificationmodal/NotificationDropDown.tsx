import { Typography } from "@mui/material";

import NotificationContent from "../notificationmodal/NotificationContent";

const NotificationDropDown = () => {
  return (
    <div className="h-90 bg-white rounded-lg overflow-y-auto w-full p-3  custom-scrollbar-for-menu space-y-2 ">
      <Typography sx={{ fontSize: 19, fontWeight: 600, mb: 1 }}>
        Notifications
      </Typography>
      <NotificationContent
        title={"name"}
        message={"This is dummy msg"}
        time={"9:23 am"}
      />
      <NotificationContent
        title={"name"}
        message={"This is dummy msg"}
        time={"9:23 am"}
      />
      <NotificationContent
        title={"name"}
        message={"This is dummy msg"}
        time={"9:23 am"}
      />

    </div>
  );
};

export default NotificationDropDown;
