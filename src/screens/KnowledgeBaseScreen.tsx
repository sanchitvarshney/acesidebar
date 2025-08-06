import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Divider,
  Paper,
} from "@mui/material";
import {
  Folder as FolderIcon,
  Description as DocumentIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Layers as CategoryIcon,
} from "@mui/icons-material";
import { knowledgeBaseData } from "../data/instractions";
import { useNavigate } from "react-router-dom";

const KnowledgeBaseScreen = () => {
    const navigate = useNavigate();
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "calc(100vh - 205px)",
        

        padding: 3,
      }}
    >
      <Typography
        variant="h5"
        component="h1"
        sx={{ mb: 3, fontWeight: 600, color: "#2c3e50", textAlign: "center" }}
      >
        Knowledge Base
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          },
          gap: 3,
        }}
      >
        {knowledgeBaseData.map((category) => (
          <Card
          onClick={() => navigate(`/ticket/support/knowledge-base/${category.title}`)}
            sx={{
              height: "100%",
              borderRadius: 3,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              transition: "transform 0.2s ease-in-out",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <CategoryIcon
                  sx={{
                    color: "#34495e",
                    mr: 2,
                    fontSize: 28,
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#2c3e50",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    {category.title}
                    <Chip
                      label={category.subcategories.length}
                      size="small"
                      sx={{
                        backgroundColor: "#3498db",
                        color: "white",
                        fontSize: "0.75rem",
                      }}
                    />
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#7f8c8d",
                      mt: 0.5,
                    }}
                  >
                    {category.description}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Subcategories */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {category.subcategories.map((subcategory) => (
                  <Box key={subcategory.id}>
                    {/* Subcategory Header */}
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <FolderIcon
                        sx={{
                          color: "#95a5a6",
                          mr: 1.5,
                          fontSize: 20,
                        }}
                      />
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 500,
                          color: "#34495e",
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        {subcategory.title}
                        <Chip
                          label={subcategory.articles.length}
                          size="small"
                          sx={{
                            backgroundColor: "#ecf0f1",
                            color: "#7f8c8d",
                            fontSize: "0.7rem",
                            height: "20px",
                          }}
                        />
                      </Typography>
                    </Box>

                    {/* Articles */}
                    <Box sx={{ ml: 3.5 }}>
                      {subcategory.articles.map((article) => (
                        <Box
                          key={article.id}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            py: 0.5,
                            cursor: "pointer",
                            "&:hover": {
                              backgroundColor: "#f8f9fa",
                              borderRadius: 1,
                            },
                          }}
                        >
                          <DocumentIcon
                            sx={{
                              color: "#3498db",
                              mr: 1.5,
                              fontSize: 18,
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#3498db",
                              fontWeight: 500,
                              "&:hover": {
                                textDecoration: "underline",
                              },
                            }}
                          >
                            {article.title}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default KnowledgeBaseScreen;
