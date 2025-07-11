import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import logo from "../../assets/buildings.png";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const InstractionComponent = ({ data }: { data: any }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <>
      <Box sx={{ width: { xs: 100, sm: 150, md: 180 }, mb: 2 }}>
        <img
          src={logo}
          alt="logo"
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </Box>
      <Typography
        variant="h5"
        fontWeight={700}
        sx={{ mb: 2, letterSpacing: 1 }}
      >
        Ticket Management
      </Typography>
      <List dense sx={{ color: { md: "white" } }}>
        {data?.map((item: any) => (
          <ListItem key={item.id}>
            <ListItemIcon>
              <CheckCircleIcon color={isSmall ? "primary" : "inherit"} />
            </ListItemIcon>
            <ListItemText sx={{ textAlign: "justify" }} primary={item.des} />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default InstractionComponent;
