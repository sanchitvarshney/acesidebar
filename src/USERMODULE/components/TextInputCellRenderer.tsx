import { Avatar, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditUser from "../pages/EditUser";
import ConfirmationModal from "../../components/reusable/ConfirmationModal";
import { useNavigate } from "react-router-dom";

const TextInputCellRenderer = (props: any) => {
  const { value, field, row } = props;

  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const renderContent = () => {
    switch (field) {
      case "contact":
        return (
          <div
            className="flex items-center gap-3 cursor-pointer w-full h-full"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`user-profile/${row?.userID}`);
            }}
          >
            {row?.avatar ? (
              <Avatar alt={row?.name} src={row?.avatar} />
            ) : (
              <Avatar>
                {row?.name ? row?.name.charAt(0).toUpperCase() : "T"}
              </Avatar>
            )}
            <Typography fontWeight={500} color="text.primary">
              {row?.name}
            </Typography>
          </div>
        );
      case "email":
        return (
          <div
            className="flex items-center gap-3 cursor-pointer w-full h-full"
            onClick={() => window.open(`mailto:${row.email}`)}
          >
            <Typography
              variant="body2"
              sx={{
                color: "#03363d",
                textDecoration: "none",
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                textAlign: "left",
              }}
            >
              {row.email || "-"}
            </Typography>
          </div>
        );
      case "phoneNumber":
        return (
          <div className="flex items-center gap-3 cursor-pointer w-full h-full">
            <Typography
              variant="body2"
              sx={{
                color: "#424242",
                fontFamily: "monospace",
                fontSize: "0.875rem",
              }}
            >
              {row.phone || "-"}
            </Typography>
          </div>
        );
      case "facebook":
        return (
          <div
            className="flex items-center gap-3 cursor-pointer w-full h-full"
            onClick={() =>
              row?.socialData?.facebook &&
              window.open(
                `https://facebook.com/${row?.socialData?.facebook}`,
                "_blank"
              )
            }
          >
            <Typography
              variant="body2"
              sx={{
                color: "#1877f2",
                cursor: row?.socialData?.facebook ? "pointer" : "default",
                "&:hover": row?.socialData?.facebook
                  ? { textDecoration: "underline" }
                  : {},
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {row?.socialData?.facebook || "-"}
            </Typography>
          </div>
        );
      case "twitter":
        return (
          <div
            className="flex items-center gap-3 cursor-pointer w-full h-full"
            onClick={() =>
              row?.socialData?.twitter &&
              window.open(
                `https://twitter.com/${row?.socialData?.twitter}`,
                "_blank"
              )
            }
          >
            <Typography
              variant="body2"
              sx={{
                color: "#1da1f2",
                cursor: row?.socialData?.twitter ? "pointer" : "default",
                "&:hover": row?.socialData?.twitter
                  ? { textDecoration: "underline" }
                  : {},
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {row?.socialData?.twitter ? `${row?.socialData?.twitter}` : "-"}
            </Typography>
          </div>
        );

      case "actions":
        return (
          <>
            <IconButton
              size="small"
              onClick={handleClick}
              aria-controls={open ? "actions-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
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
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 30,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem
                onClick={() => setIsEdit(true)}
                sx={{
                  minWidth: 80,
                  py: 1,
                  px: 2,
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                <EditIcon fontSize="small" sx={{ mr: 2 }} /> Edit
              </MenuItem>
              <MenuItem
                onClick={() => setIsDelete(true)}
                sx={{
                  minWidth: 150,
                  py: 1,
                  px: 2,
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                <DeleteIcon fontSize="small" sx={{ mr: 2 }} /> Delete
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

      <EditUser isEdit={isEdit} close={() => setIsEdit(false)} />

      <ConfirmationModal
        open={isDelete}
        onClose={() => setIsDelete(false)}
        onConfirm={() => {}}
        type="delete"
      />
    </>
  );
};

export default TextInputCellRenderer;
