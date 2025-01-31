import { useState, useEffect } from 'react';
import { CustomerServiceForm } from './components/CustomerServiceForm';
import { Dashboard } from './components/Dashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { TicketDetails } from './components/TicketDetails';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { generateTicketNumber } from './lib/utils';
import type { Ticket, TicketComment } from './lib/types';
import { MessageSquareIcon, ClockIcon, CheckCircleIcon, AlertCircleIcon } from './components/ui/icons';
import { AuthForm } from './components/auth-form';
import { useAuth } from './components/auth-provider';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useTicketStore } from './lib/store';
import { useToast } from './hooks/use-toast';
import { getSession } from './lib/auth';
import { AllTickets } from './components/AllTickets';
import { ModeToggle } from './components/mode-toggle';
import { cn } from '@/lib/utils';
import { ThemeProvider } from './components/theme-provider';

function App() {
  const { session, loading, signOut } = useAuth();
  const { tickets, setTickets } = useTicketStore();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    console.log('App component is rendering');
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    if (!supabase) {
      console.error('Supabase client is not initialized.');
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
    }
  };

  const handleSubmit = (ticketData: Omit<Ticket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt' | 'comments'>) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: crypto.randomUUID(),
      ticketNumber: generateTicketNumber(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
      priority: 'medium', // Default priority
    };

    setTickets(prevTickets => {
      const updatedTickets = [...prevTickets, newTicket];
      localStorage.setItem('localTickets', JSON.stringify(updatedTickets));
      return updatedTickets;
    });
  };

  const handleUpdateTicket = async (updatedTicket: Ticket) => {
    if (!supabase) {
      console.error('Supabase client is not initialized.');
      return;
    }
    try {
      const { data, error } = await supabase
        .from('tickets')
        .update(updatedTicket)
        .eq('id', updatedTicket.id);

      if (error) {
        console.error('Error updating ticket:', error);
      } else {
        console.log('Ticket updated successfully:', data);
        await fetchTickets();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const handleDeleteTicket = async (id: string) => {
    if (!supabase) {
      console.error('Supabase client is not initialized.');
      return;
    }
    try {
      const { error } = await supabase
        .from('tickets')
        .delete()
        .eq('id', Number(id));

      if (error) {
        console.error('Error deleting ticket:', error);
      } else {
        console.log('Ticket deleted successfully with id:', id);
        await fetchTickets();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const handleAddComment = async (ticketId: string, content: string) => {
    if (!supabase) {
      console.error('Supabase client is not initialized.');
      return;
    }
    try {
      const { data: sessionData, error: sessionError } = await getSession();

      if (sessionError || !sessionData?.session) {
        console.error('User is not authenticated.');
        toast({
          title: 'Error adding comment',
          description: 'Could not get user session. Please sign in.',
          variant: 'destructive',
        });
        return;
      }

      const newComment: TicketComment = {
        id: crypto.randomUUID(),
        ticketId,
        userId: 'staff', // This would come from auth context in a full implementation
        content,
        createdAt: new Date().toISOString(),
      };

      const { data: updatedTicketData, error: updateError } = await supabase
        .from('tickets')
        .select('comments')
        .eq('id', Number(ticketId))
        .single();

      if (updateError) {
        console.error('Error fetching ticket for comment update:', updateError);
        toast({
          title: 'Error adding comment',
          description: 'Could not fetch ticket data. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      const updatedComments = updatedTicketData?.comments ? [...updatedTicketData.comments, newComment] : [newComment];

      const { error } = await supabase
        .from('tickets')
        .update({ comments: updatedComments })
        .eq('id', Number(ticketId));

      if (error) {
        console.error('Error updating ticket with comment:', error);
        toast({
          title: 'Error adding comment',
          description: 'Could not add comment. Please try again.',
          variant: 'destructive',
        });
        return;
      }
      
      setTickets(prevTickets => {
        return prevTickets.map(ticket => {
          if (ticket.id === ticketId) {
            return { ...ticket, comments: [...(ticket.comments || []), newComment] };
          }
          return ticket;
        });
      });
      await fetchTickets();
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Unexpected error',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsDetailsOpen(true);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-900 dark:to-gray-700">
        <div className="container mx-auto px-4 py-8 relative flex flex-col items-center justify-center">
          <img
            src="https://www.gatekeeper-systems.com/wp-content/uploads/2021/05/Gatekeeper-Logo-with-USP3.png"
            alt="Gatekeeper Logo"
            className="h-12 mb-4"
          />
          <AuthForm onSuccess={() => {}} />
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true} disableTransitionOnChange={true}>
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-900 dark:to-gray-700">
        <div className="container mx-auto px-4 py-8 relative">
          <div className="flex items-center justify-between sm:flex-row sm:items-center">
            <img
              src="https://www.gatekeeper-systems.com/wp-content/uploads/2021/05/Gatekeeper-Logo-with-USP3.png"
              alt="Gatekeeper Logo"
              className="h-12 sm:absolute sm:top-4 sm:left-4"
            />
            <div className="absolute top-4 right-4 flex space-x-4">
              <ModeToggle />
              <Button
                variant="outline"
                className="sm:top-4 sm:right-4"
                onClick={signOut}
              >
                Sign Out
              </Button>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-200 mb-8">
            Customer Service Portal
          </h1>
          
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="new-ticket">New Ticket</TabsTrigger>
              <TabsTrigger value="all-tickets">All Tickets</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard">
              <Card className="p-6">
                <Dashboard tickets={tickets} onTicketClick={handleTicketClick} />
              </Card>
            </TabsContent>
            
            <TabsContent value="new-ticket">
              <Card className="p-8 max-w-3xl mx-auto">
                <CustomerServiceForm onSubmit={handleSubmit} />
              </Card>
            </TabsContent>

            <TabsContent value="all-tickets">
              <Card className="p-6">
                <AllTickets tickets={tickets} onTicketClick={handleTicketClick} />
              </Card>
            </TabsContent>
            
            <TabsContent value="admin">
              <Card className="p-6">
                <AdminDashboard 
                  tickets={tickets} 
                  onDelete={handleDeleteTicket}
                  onUpdate={handleUpdateTicket}
                />
              </Card>
            </TabsContent>
          </Tabs>

          <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  Ticket Details {selectedTicket?.ticketNumber}
                </DialogTitle>
              </DialogHeader>
              {selectedTicket && (
                <TicketDetails
                  ticket={selectedTicket}
                  onAddComment={handleAddComment}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
