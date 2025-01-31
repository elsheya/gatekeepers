import { useState, useMemo, useEffect } from 'react';
  import { Card } from "@/components/ui/card";
  import { Button } from "@/components/ui/button";
  import { Badge } from "@/components/ui/badge";
  import { TicketIcon, ClockIcon, CheckCircleIcon } from './ui/icons';
  import type { Ticket } from '@/lib/types';
  import { cn } from '@/lib/utils';
  import { Input } from '@/components/ui/input';
  import { supabase } from '@/lib/supabase';
  import { useTicketStore } from '@/lib/store';

  type Props = {
    onTicketClick: (ticket: Ticket) => void;
  };

  export function Dashboard({ onTicketClick }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const { tickets, setTickets } = useTicketStore();
    const [loading, setLoading] = useState(true);

    const fetchTickets = async () => {
      setLoading(true);
      if (!supabase) {
        console.error('Supabase client is not initialized.');
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase.from('tickets').select('*');
        if (error) {
          console.error('Error fetching tickets:', error);
        } else if (data) {
          setTickets(data as Ticket[]);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchTickets();
    }, [setTickets]);

    const openTickets = tickets.filter(t => t.status === 'Open').length;
    const inProgressTickets = tickets.filter(t => t.status === 'In Progress').length;
    const closedTickets = tickets.filter(t => t.status === 'Closed').length;

    const getStatusColor = (status: string) => {
      const colors = {
        Open: 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100',
        'In Progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100',
        Closed: 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100',
      };
      return colors[status as keyof typeof colors] || '';
    };

    const getPriorityColor = (priority: string) => {
      const colors = {
        low: 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100',
        medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100',
        high: 'bg-orange-100 text-orange-800 dark:bg-orange-700 dark:text-orange-100',
        urgent: 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100',
      };
      return colors[priority as keyof typeof colors] || '';
    };

    const capitalizeFirstLetter = (str: string) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const filteredTickets = useMemo(() => {
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setDate(twentyFourHoursAgo.getDate() - 1);

      const recentTickets = tickets.filter(ticket => new Date(ticket.createdAt) > twentyFourHoursAgo);

      if (!searchTerm) {
        return recentTickets.slice(0, 5);
      }
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      return recentTickets.filter(ticket =>
        ticket.ticketNumber.toLowerCase().includes(lowerCaseSearchTerm) ||
        ticket.customerName.toLowerCase().includes(lowerCaseSearchTerm) ||
        ticket.email.toLowerCase().includes(lowerCaseSearchTerm) ||
        ticket.phoneNumber.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }, [tickets, searchTerm]);

    if (loading) {
      return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-blue-500 text-white shadow-sm hover:shadow-lg transition-shadow duration-300 hover:filter hover:brightness-110">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">Open Tickets</p>
                <h3 className="text-4xl font-bold">{openTickets}</h3>
              </div>
              <TicketIcon size={40} />
            </div>
          </Card>

          <Card className="p-6 bg-yellow-500 text-white shadow-sm hover:shadow-lg transition-shadow duration-300 hover:filter hover:brightness-110">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">In Progress</p>
                <h3 className="text-4xl font-bold">{inProgressTickets}</h3>
              </div>
              <ClockIcon size={40} />
            </div>
          </Card>

          <Card className="p-6 bg-green-500 text-white shadow-sm hover:shadow-lg transition-shadow duration-300 hover:filter hover:brightness-110">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">Closed Tickets</p>
                <h3 className="text-4xl font-bold">{closedTickets}</h3>
              </div>
              <CheckCircleIcon size={40} />
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Tickets</h2>
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
