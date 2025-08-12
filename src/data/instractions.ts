export const Instractions = [
  {
    id: 1,
    des: "Create and manage tickets with priority levels and status tracking",
  },
  {
    id: 2,
    des: "Assign tickets to team members and track resolution progress",
  },
  {
    id: 3,
    des: "Generate detailed reports and analytics for ticket performance",
  },
  {
    id: 4,
    des: "Set up automated workflows and escalation rules",
  },
  {
    id: 5,
    des: "Integrate with email and chat platforms for seamless communication",
  },
  {
    id: 6,
    des: "Customize ticket fields and categories for your business needs",
  },
  {
    id: 7,
    des: "Monitor SLA compliance and response times in real-time",
  },
  {
    id: 8,
    des: "Collaborate with team members through internal notes and comments",
  },
];

export const navItems = [
  { id: 1, label: "Home", path: "/ticket/support" },
  { id: 2, label: "Knowledge Base", path: "knowledge-base" },
  { id: 3, label: "Submit Ticket", path: "submit" },
];
export // Mock data for knowledge base categories
const knowledgeBaseData = [
  {
    id: 1,
    title: "How tos",

    description: "How tos category",
    subcategories: [
      {
        id: 1,
        title: "Installation",

        articles: [
          {
            id: 1,
            title: "How to Install Our Software",
            type: "document",
          },
        ],
      },
      {
        id: 2,
        title: "Account creation",

        articles: [
          {
            id: 2,
            title: "How to Create a New User Account",
            type: "document",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "FAQs",

    description: "FAQs category",
    subcategories: [
      {
        id: 1,
        title: "Updating software",

        articles: [
          {
            id: 1,
            title: "How to Update Software Settings",
            type: "document",
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Troubleshooting",

    description: "Common issues and solutions",
    subcategories: [
      {
        id: 3,
        title: "Login Issues",

        articles: [
          {
            id: 3,
            title: "Password Reset Guide",
            type: "document",
          },
          {
            id: 4,
            title: "Account Locked Solutions",
            type: "document",
          },
        ],
      },
    ],
  },
];


