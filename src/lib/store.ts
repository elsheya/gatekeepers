import { create } from 'zustand';
import type { Ticket } from './types';

interface TicketState {
  tickets: Ticket[];
  setTickets: (tickets: Ticket[]) => void;
  addTicket: (ticket: Ticket) => void;
  updateTicket: (updatedTicket: Ticket) => void;
  deleteTicket: (id: string) => void;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
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
    darkMode: localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches),
    setDarkMode: (darkMode) => set({ darkMode }),
}));
