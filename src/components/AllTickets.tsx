
import { useState, useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TicketIcon, ClockIcon, CheckCircleIcon } from './ui/icons';
import type { Ticket } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

type Props = {
  tickets: Ticket[];
  onTicketClick: (ticket: Ticket) => void;
};

export function AllTickets({ tickets, onTicketClick }: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusColor = (status: string) => {
    const colors = {
      Open: 'bg-red-100 text-red-800',
      'In Progress': 'bg-yellow-100 text-yellow-800',
      Closed: 'bg-green-100 text-green-800',
    };
    return colors[status as keyof typeof colors] || '';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800',
    };
    return colors[priority as keyof typeof colors] || '';
  };

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const filteredTickets = useMemo(() => {
    if (!searchTerm) {
      return tickets;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return tickets.filter(ticket =>
      ticket.ticketNumber.toLowerCase().includes(lowerCaseSearchTerm) ||
      ticket.customerName.toLowerCase().includes(lowerCaseSearchTerm) ||
      ticket.email.toLowerCase().includes(lowerCaseSearchTerm) ||
      ticket.phoneNumber.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [tickets, searchTerm]);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">All Tickets</h2>
        <Input
          type="text"
          placeholder="Search tickets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        <div className="grid gap-4">
          {filteredTickets.map(ticket => (
            <Card key={ticket.id} className="p-4 shadow-sm hover:shadow-lg transition-shadow duration-300 hover:filter hover:brightness-110">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{ticket.ticketNumber}</span>
                    <Badge variant="outline" className={getStatusColor(ticket.status)}>
                      {ticket.status}
                    </Badge>
                    <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                      {capitalizeFirstLetter(ticket.priority)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{ticket.customerName}</p>
                  <p className="text-xs text-gray-500">
                    Created: {new Date(ticket.createdAt).toLocaleString()}
                  </p>
                </div>
                <Button variant="outline" onClick={() => onTicketClick(ticket)}>
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
