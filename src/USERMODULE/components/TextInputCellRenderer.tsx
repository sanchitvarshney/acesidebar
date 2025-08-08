import { Avatar, Checkbox, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useEffect, useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomSideBarPanel from "../../components/reusable/CustomSideBarPanel";



const TextInputCellRenderer = (props: any) => {
  const { value, colDef, data, context } = props;
  const { isAllSelect } = context;
  const [checked, setChecked] = useState(false);
   const [isEdit, setIsEdit] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
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
                    width: 30,
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
         
                <MenuItem
               
                  onClick={() => setIsEdit(true)}
                  sx={{
                    minWidth: 80,
                    py: 1,
                    px: 2,
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                >
                  <EditIcon fontSize="small"  sx={{mr:2}}/> Edit
                </MenuItem>
                   <MenuItem
            
                  onClick={() => setIsDelete(true)}
                  sx={{
                    minWidth: 150,
                    py: 1,
                    px: 2,
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                >
                  <DeleteIcon fontSize="small" sx={{mr:2}}/> Delete
                </MenuItem>
   
            </Menu>
          </>
        );
      default:
        return <span>{value}</span>;
    }
  };

  return (
    <>
    {renderContent()}
    <CustomSideBarPanel open={isEdit} close={()=>setIsEdit(false)} width={500 } title={"Edit User"} >
        <h1>Delete item</h1>
    </CustomSideBarPanel>
    </>
  );
};

export default TextInputCellRenderer;
