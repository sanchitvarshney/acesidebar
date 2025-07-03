import { useContext } from "react";
import   { ReplyContextApi } from "../contextApi/ReplyContext";

export const useReplyContext = () =>  {
const context = useContext(ReplyContextApi);
if (!context) {
    throw new Error("useReplyContext must be used within a ReplyProvider");
}
return context;
}