import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RemoveIcon from "@mui/icons-material/Remove";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import CustomToolTip from "../../reusable/CustomToolTip";

const MergeContact = ({ data, onchange }: any) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<any[]>([]);
  const [selectedOption, setSelectedOptions] = useState<string[]>([]);
  console.log(selectedOption, "selectedOption");

  // simulate API call
  const fetchOptions = async (query: string) => {
    if (!query) {
      setOptions([]);
      return;
    }
    const allData = [
      { userName: "abc", userEmail: "abc@gmail.com", isPrimaryEmail: false },
      { userName: "xyz", userEmail: "xyz@gmail.com", isPrimaryEmail: false },
      {
        userName: "abcde",
        userEmail: " abcde@ReportGmailerrorred.com,",
        isPrimaryEmail: false,
      },
    ];
    const filtered = allData.filter((opt) =>
      opt?.userName.toLowerCase().includes(query.toLowerCase())
    );
    setOptions(filtered);
  };

  useEffect(() => {
    fetchOptions(inputValue);
  }, [inputValue]);

  const displayOptions = inputValue ? options : ["Type to search"];

  const handleSelectedOption = (_: React.SyntheticEvent, value: any) => {
    if (!value || value === "Type to search") return;
    console.log(value, "value");
    setSelectedOptions((prev: any[]) => {
      return [...prev, value];
    });
  };

  useEffect(() => {
    if (!data) {
      return;
    }
    setSelectedOptions(() => [data]);
  }, [data]);

  return (
    <div className="p-6  w-full">
      <Autocomplete
        size="small"
        fullWidth
        disablePortal
        value={null}
        options={displayOptions}
        getOptionLabel={(option: any) => {
          if (typeof option === "string") return option; // ✅ show placeholder
          if (option?.userName) return option.userName; // ✅ show contact name
          return "";
        }}
        renderOption={(props, option: any) => (
          <li {...props}>
            {typeof option === "string" ? (
              option
            ) : (
              <div
                className="flex items-center gap-3 p-2 rounded-md w-full"
                style={{ cursor: "pointer" }}
              >
             
                <Avatar sx={{ width: 30, height: 30, backgroundColor:"primary.main" }}>
                  {option.userName?.charAt(0).toUpperCase()}
                </Avatar>

          
                <div className="flex flex-col">
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {option.userName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.userEmail}
                  </Typography>
                </div>
              </div>
            )}
          </li>
        )}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        inputValue={inputValue}
        onInputChange={(_, value) => setInputValue(value)}
        onChange={handleSelectedOption}
        filterOptions={(x) => x} // disable default filtering
        getOptionDisabled={(option) => option === "Type to search"}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search contacts to merge"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  <SearchIcon sx={{ color: "gray", mr: 1 }} fontSize="small" />
                  {params.InputProps.startAdornment}
                </>
              ),
            }}
          />
        )}
      />

      <div className="w-full my-3">
        <List>
          {selectedOption?.map((item: any) => (
            <ListItem
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",

                gap: 2,
                border: "1px solid #e4e4e4ff",
              }}
            >
              <CustomToolTip
                title={
                  item.isPrimaryEmail ? (
                    <Typography
                      variant="subtitle1"
                      fontSize={10}
                      sx={{ py: 0.2, px: 0.8 }}
                    >
                      Primary contact can not remove
                    </Typography>
                  ) : (
                    ""
                  )
                }
              >
                <span>
                  <IconButton
                    disabled={item.isPrimaryEmail}
                    size="small"
                    sx={{
                      border: "1px solid",
                      borderRadius: "50%",
                      width: 20,
                      height: 20,
                      mr: 2,
                      color: item.isPrimaryEmail ? "#f28b82" : "#d32f2f", // light red when disabled, normal red otherwise
                      borderColor: item.isPrimaryEmail ? "#f28b82" : "#d32f2f",
                      "&.Mui-disabled": {
                        color: "#f28b82", // keep icon light red instead of grey
                        borderColor: "#f28b82",
                      },
                    }}
                    onClick={() => {
                      setSelectedOptions((prev) =>
                        prev.filter(
                          (contact: any) => contact.userEmail !== item.userEmail
                        )
                      );
                    }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                </span>
              </CustomToolTip>
              <ListItemText
                primary={
                  <div className="flex items-center gap-4">
                    <Avatar sx={{ width: 30, height: 30 ,backgroundColor:"primary.main"}} >
                        {item?.userName?.charAt(0).toUpperCase()}
                      </Avatar>
                    <div>
                      <Typography variant="subtitle2">
                        {item?.userName}
                      </Typography>
                      <p className="text-xs">{item?.userEmail}</p>
                    </div>
                  </div>
                }
                sx={{}}
              />
              <div className="flex flex-col items-center gap-1">
                <IconButton
                  disableRipple={selectedOption.length === 1}
                  size="small"
                  color="primary"
                  sx={{
                    border: "1px solid",
                    borderRadius: "50%",
                    width: 20,
                    height: 20,
                  }}
                  onClick={() => {
                    if (selectedOption.length === 1) {
                      return;
                    }

                    setSelectedOptions((prev) =>
                      prev.map((contact: any) =>
                        contact.userEmail === item.userEmail
                          ? {
                              ...contact,
                              isPrimaryEmail: !contact.isPrimaryEmail,
                            }
                          : { ...contact, isPrimaryEmail: false }
                      )
                    );
                  }}
                >
                  {item?.isPrimaryEmail ? (
                    <Brightness7Icon fontSize="small" />
                  ) : null}
                </IconButton>
                <Typography variant="subtitle1" fontSize={10}>
                  Primary
                </Typography>
              </div>
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  );
};

export default MergeContact;
