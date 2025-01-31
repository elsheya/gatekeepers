export type User = {
  id: string;
  email: string;
  password: string; // Hashed
  role: 'user' | 'admin';
  lastActive: string;
  createdAt: string;
};

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TicketComment = {
  id: string;
  ticketId: string;
  userId: string;
  content: string;
  createdAt: string;
};

export type Ticket = {
  id: string;
  ticketNumber: string;
  customerName: string;
  phoneNumber: string;
  email: string;
  issueDescription: string;
  status: 'Open' | 'In Progress' | 'Closed';
  priority: TicketPriority;
  notified: boolean;
  notes: string;
  representativeName: string;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  comments: TicketComment[];
};
