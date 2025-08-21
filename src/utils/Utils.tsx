 import relativeTime from "dayjs/plugin/relativeTime";
 import dayjs from "dayjs";
 dayjs.extend(relativeTime);

 export const helper = {
   formatRelativeTime: (timestamp: string) => {
     return dayjs(timestamp).fromNow();
   },
 };

 export const isValidEmail = (email:string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};