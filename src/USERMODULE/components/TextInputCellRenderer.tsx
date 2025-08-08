import { Avatar, Checkbox, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useEffect, useState } from "react";

const selectionsOptions = [
    {
        label: "Option 1",
        value: 1,
    },
    {
        label: "Option 2",
        value: 2,
    },
    {
        label: "Option 3",
        value: 3,
    },
]

const TextInputCellRenderer = (props: any) => {
  const { value, colDef, data, context } = props;
  const { isAllSelect } = context;
  const [checked, setChecked] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(1);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (index: any) => {
    setSelectedIndex(index);
    handleClose();
  };

  useEffect(() => {
    setChecked(isAllSelect);
  }, [isAllSelect]);

  const renderContent = () => {
    switch (colDef.field) {
      case "checkbox":
        return (
          <div className="flex items-center  ">
            <Checkbox
              checked={checked}
              onClick={() => setChecked(!checked)}
              size="small"
            />
          </div>
        );
      case "contact":
        return (
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              console.log("clicked");
            }}
          >
            {data?.avatar ? (
              <Avatar alt={data?.name} src={data?.avatar} />
            ) : (
              <Avatar>
                {data?.name ? data?.name.charAt(0).toUpperCase() : "T"}
              </Avatar>
            )}
            <Typography fontWeight={500} color="text.primary">
              {data?.name}
            </Typography>
          </div>
        );
      case "actions":
        return (
          <>
            <IconButton
              size="small"
              onClick={handleClick}
              aria-controls={open ? 'actions-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
            <Menu
              id="actions-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              {selectionsOptions.map((item, index) => (
                <MenuItem
                  key={index}
                  onClick={() => handleSelect(item.value)}
                  sx={{
                    minWidth: 150,
                    py: 1,
                    px: 2,
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
          </>
        );
      default:
        return <span>{value}</span>;
    }
  };

  return renderContent();
};

export default TextInputCellRenderer;
