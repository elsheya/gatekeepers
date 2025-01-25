import { create } from 'zustand';
import type { Ticket } from './types';

interface TicketState {
  tickets: Ticket[];
  setTickets: (tickets: Ticket[]) => void;
  addTicket: (ticket: Ticket) => void;
  updateTicket: (updatedTicket: Ticket) => void;
  deleteTicket: (id: string) => void;
}

export const useTicketStore = create<TicketState>((set) => ({
  tickets: [],
  setTickets: (tickets) => set({ tickets: Array.isArray(tickets) ? tickets : [] }),
  addTicket: (ticket) =>
    set((state) => ({ tickets: [...state.tickets, ticket] })),
  updateTicket: (updatedTicket) =>
    set((state) => ({
      tickets: state.tickets.map((ticket) =>
        ticket.id === updatedTicket.id ? updatedTicket : ticket
      ),
    })),
  deleteTicket: (id) =>
    set((state) => ({
      tickets: state.tickets.filter((ticket) => ticket.id !== id),
    })),
}));
