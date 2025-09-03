export type UserProfileInfo = {
  username: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  address: string;
};

export type TicketItem = {
  id: number | string;
  title: string;
  description?: string;
  status: string;
  group?: string;
  created?: string;
  closed?: string;
  overdue?: boolean;
  overdue_by?: string;
  resolved_late?: boolean;
};
