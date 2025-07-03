 import relativeTime from "dayjs/plugin/relativeTime";
 import dayjs from "dayjs";
 dayjs.extend(relativeTime);

 export const helper = {
   formatRelativeTime: (timestamp: string) => {
     return dayjs(timestamp).fromNow();
   },
 };