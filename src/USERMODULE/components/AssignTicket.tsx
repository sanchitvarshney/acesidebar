import { Menu, MenuItem } from "@mui/material";
import { SearchIcon } from "lucide-react";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useCommanApiMutation } from "../../services/threadsApi";


const dummyUsers: any[] = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Michael Johnson" },
  { id: 4, name: "Emily Davis" },
  { id: 5, name: "Robert Brown" },
];

interface AssignTicketProps {
  close: any;
  open: boolean;
  anchorEl: any;
  selectedTickets: any[]
}



const AssignTicket: FC<AssignTicketProps> = ({ close, open, anchorEl,selectedTickets }) => {
  //@ts-ignore
 
  const [searchQuery, setSearchQuery] = useState<string>("");
  const searchInputRef = useRef<HTMLInputElement | null>(null);
 const [commanApi] = useCommanApiMutation()

  const handleSubmit = (id: any) => {

    const payload = {
      url: "assign-ticket",
      body: {
        ids: selectedTickets,
        properties: {
          responder_id: id,
        },
      }
    }

  commanApi(payload).then((res: any) => {
    close()
  }).catch((err: any) => {
    close()
  })
 
};

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        if (searchInputRef.current) searchInputRef.current.focus();
      }, 200);
    }
  }, [open]);

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return dummyUsers;
    return dummyUsers.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const finalList = useMemo(() => {
    return filteredUsers.length > 0 ? filteredUsers : [];
  }, [filteredUsers]);

  return (
    <Menu
      id="basic-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={close}
      MenuListProps={{ autoFocus: false }} // Prevents MUI from stealing focus
      slotProps={{
        list: {
          "aria-labelledby": "basic-button",
        },
      }}
      PaperProps={{
        sx: {
          py: 0.5,
          px: 1, // Adds padding inside the menu
        },
      }}
    >
      <div className="transition-all duration-200 w-[260px] relative mb-2">
        <div className="flex items-center w-full bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm transition-shadow focus-within:shadow-[0_1px_6px_rgba(32,33,36,0.28)] hover:shadow-[0_1px_6px_rgba(32,33,36,0.28)]">
          <SearchIcon className="text-gray-500 mr-3" size={18} />
          <input
            ref={searchInputRef}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            placeholder="Search…"
            className="flex-1 bg-transparent outline-none text-gray-800 text-[15px] leading-tight placeholder-gray-500"
          />
        </div>
      </div>

      <MenuItem
        onClick={() => {
          //@ts-ignore
          handleSubmit(user.id);
        }}
      >
        Assign to me
      </MenuItem>

      {filteredUsers.length === 0 && searchQuery ? (
        <MenuItem disabled>No results found</MenuItem>
      ) : (
        finalList.map((user) => (
          <MenuItem
            key={user.id}
            onClick={() => {
              handleSubmit(user.id);
            }}
          >
            {user.name}
          </MenuItem>
        ))
      )}
    </Menu>
  );
};

export default AssignTicket;
