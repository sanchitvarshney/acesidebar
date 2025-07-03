import React, { ReactNode, useState } from "react";

interface ReplyContextValue {
  showReplyEditor: boolean;
  setShowReplyEditor: React.Dispatch<React.SetStateAction<boolean>>;
  handleReplyClick: () => void;

}

export const ReplyContextApi = React.createContext<ReplyContextValue | null>(
  null
);


interface ReplyProviderProps {
  children: ReactNode;
}

const ReplyContext = ({children}: ReplyProviderProps) => {
  const [showReplyEditor, setShowReplyEditor] = useState(false);

  const handleReplyClick = () => {
    setShowReplyEditor(true);
  };
  return (
    <ReplyContextApi.Provider
      value={{ showReplyEditor, setShowReplyEditor, handleReplyClick }}
    >
      {children}
    </ReplyContextApi.Provider>
  );
};

export default ReplyContext;
