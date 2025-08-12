import { Box, Divider, List, ListItem, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useTabs } from "../../contextApi/TabsContext";
import { useEffect } from "react";
import { Label } from "@mui/icons-material";

const details = [
  { label: "Article ID:", value: "12" },
  { label: "Category:", value: "Knowledgebase", link: true },
  { label: "Date added:", value: "2014-09-06 10:41:49" },
  { label: "Views:", value: "88,059" },
  { label: "Rating (Votes):", value: "⭐⭐⭐⭐☆ (1,620)" },
];

const ArticalViewPage = () => {
  const id = useParams();

  const path = window.location.pathname;
  const navigate = useNavigate();
  const { addTab, setActiveTab } = useTabs();

  useEffect(() => {
    addTab({ label: id.id || "", path: path });
    setActiveTab(id?.id || "");
  }, []);
  return (
    <div className="w-full min-h-[calc(100vh-205px)] overflow-auto will-change-transform">
      <div className="grid grid-cols-[2fr_1fr] mx-auto w-4/5 gap-10 py-6">
        <div className="w-full shadow-[0_0_10px_rgba(0,0,0,0.25)] rounded p-4   "></div>
        <div className="w-full shadow-[0_0_10px_rgba(0,0,0,0.25)] rounded p-4 ">
          <Typography variant="subtitle1">Article Details</Typography>
          {details.map((item, index) => (
            <Box key={index}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {item.label}
                </Typography>
                <Typography
                  onClick={() =>
                    item.link && navigate("/ticket/support/knowledge-base")
                  }
                  variant="body2"
                  sx={{
                    color: item.link ? "primary.main" : "text.primary",
                    textDecoration: item.link ? "underline" : "none",
                    cursor: item.link ? "pointer" : "default",
                    "&:hover": {
                      textDecoration: item.link ? "none" : "underline",
                    },
                  }}
                >
                  {item.value}
                </Typography>
              </Box>
              {index < details.length - 1 && <Divider />}
            </Box>
          ))}
          <Box sx={{ mt: 2, textAlign: "right" }}>
            <Typography
              variant="body2"
              color="primary"
              sx={{
                cursor: "pointer",
                textDecoration: "underline",
                "&:hover": {
                  textDecoration: "none",
                },
              }}
            >
              ← Go back
            </Typography>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default ArticalViewPage;
