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

export const fetchOptions =  (query:any) => {
    if (!query) {
      return;
    }
    const allData = [
      { userName: "abc", userEmail: "abc@gmail.com" },
      { userName: "xyz", userEmail: "xyz@gmail.com" },
      {
        userName: "abcde",
        userEmail: " abcde@ReportGmailerrorred.com,",
      },
    ];
    const filtered = allData?.filter((opt) =>
      opt?.userName.toLowerCase().includes(query.toLowerCase())
    );

    return filtered;
  };