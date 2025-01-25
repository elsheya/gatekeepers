import { useState, useCallback } from 'react';
import { useTicketStore } from '@/lib/store';
import type { Ticket } from '@/lib/types';

type UseNotesProps = {
  ticketId: string;
};

export function useNotes({ ticketId }: UseNotesProps) {
  const { updateTicket, tickets } = useTicketStore();
  const [notes, setNotes] = useState<string | null>(null);

  const ticket = tickets.find((ticket) => ticket.id === ticketId);

  const addNote = useCallback(
    (newNote: string) => {
      if (!ticket) return;
      const updatedTicket = { ...ticket, notes: newNote };
      updateTicket(updatedTicket);
      setNotes(newNote);
    },
    [ticket, updateTicket]
  );

  const updateNote = useCallback(
    (updatedNote: string) => {
      if (!ticket) return;
      const updatedTicket = { ...ticket, notes: updatedNote };
      updateTicket(updatedTicket);
      setNotes(updatedNote);
    },
    [ticket, updateTicket]
  );

  const deleteNote = useCallback(() => {
    if (!ticket) return;
    const updatedTicket = { ...ticket, notes: null };
    updateTicket(updatedTicket);
    setNotes(null);
  }, [ticket, updateTicket]);

  return {
    notes: ticket?.notes || notes,
    addNote,
    updateNote,
    deleteNote,
  };
}
