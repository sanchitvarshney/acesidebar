import { MenuItem } from "@mui/material";

const options = [
  {
    label: "Send and set as Pending",
    value: "PEN",
  },
  {
    label: "Send and set as Resolved",
    value: "RES",
  },
  {
    label: "Send and set as Closed",
    value: "CLD",
  },
];
const ReplyStatusOptions = ({ onSetData }: any) => {
  return (
    <div className="w-full p-3">
      {options.map((item: any) => (
        <MenuItem
          key={item?.value}
          value={item?.value}
          onClick={() => {
            onSetData({ value: item?.value, label: item?.label });
          }}
        >
          {item?.label}
        </MenuItem>
      ))}
    </div>
  );
};

export default ReplyStatusOptions;
