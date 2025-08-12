import { Card, CardContent, Typography } from "@mui/material";
import React, { useEffect } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate, useParams } from "react-router-dom";
import { useTabs } from "../../contextApi/TabsContext";

const submitTicketTitle = [
  {
    id: 1,
    title: "General",
  },
  {
    id: 2,
    title: "Support",
  },
  {
    id: 3,
    title: "Billing",
  },
  {
    id: 4,
    title: "Advertising",
  },
  {
    id: 5,
    title: "Category with custom fields",
  },
  {
    id: 6,
    title: "Category due in 5 days",
  },
];

const SubmitTicketPage = () => {

    const navigate = useNavigate();

  
      const path = window.location.pathname;
        console.log(path)
  
      const { addTab, setActiveTab } = useTabs();
        const lastSegment = path.split("/").filter(Boolean).pop();
    
      useEffect(() => {
        addTab({ label: lastSegment || "", path: path });
        setActiveTab(lastSegment || "");
      }, []);
  return (
    <div className="w-full flex flex-col">
      <Typography variant="h5" sx={{ textAlign: "center", py: 4 }}>
        What can we help you with?
      </Typography>
      <div className="w-1/2 mx-auto grid grid-cols-2 gap-6">
        {submitTicketTitle.map((item) => (
          <Card
            key={item.id}
            onClick={() =>  {
                const title = item.title.toLowerCase();
                navigate(`/ticket/support/submit-ticket/${title}/${item.id}`)}}
            sx={{
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              borderRadius: "8px",
              boxShadow: 3,
              userSelect: "none",
              cursor: "pointer",
              "&:hover": {
                transform: "scale(1.02)",
                boxShadow: 6,
              },
            }}
            
          >
            <CardContent 
              sx={{ 
                padding: "16px !important",
                "&:last-child": {
                  paddingBottom: "16px !important"
                }
              }}
            >
              <div className="flex items-center gap-3">
                <span className="bg-blue-600 text-white p-1.5 rounded-md flex items-center justify-center">
                  <ArrowForwardIosIcon fontSize="small" />
                </span>
                <Typography variant="body1" component="div">
                  {item.title}
                </Typography>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubmitTicketPage;
