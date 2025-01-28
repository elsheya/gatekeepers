
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2 } from './ui/icons';
import type { Ticket, TicketPriority } from '../lib/types';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { MessageSquareIcon } from './ui/icons';
import { checkAdminPassword } from '@/lib/auth';
import { useTicketStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogFooter } from './ui/alert-dialog';

type Props = {
  tickets: Ticket[];
  onDelete: (id: string) => void;
  onUpdate: (ticket: Ticket) => void;
};

export function AdminDashboard({ tickets, onDelete, onUpdate }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [closingComment, setClosingComment] = useState('');
  const [closingPerson, setClosingPerson] = useState('');
  const [representativeInitial, setRepresentativeInitial] = useState('');
  const [viewingNotes, setViewingNotes] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setTickets, deleteTicket } = useTicketStore();
  const { toast } = useToast();
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);

  const handleAdminLogin = async () => {
    setLoading(true);
    try {
      const isValid = await checkAdminPassword(password);
      if (isValid) {
        setIsAdmin(true);
        console.log('Admin login successful');
      } else {
        alert('Invalid password');
        console.log('Admin login failed');
      }
    } catch (error) {
      console.error('Error during admin login:', error);
      alert('An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (ticket: Ticket) => {
    setEditingTicket({ ...ticket });
    setIsDialogOpen(true);
    setClosingComment(ticket.notes || '');
    setClosingPerson('');
    setRepresentativeInitial(ticket.representativeName || '');
  };

  const handleSave = async () => {
    if (editingTicket) {
      const updatedTicket = {
        ...editingTicket,
        notes: closingComment,
        representativeName: representativeInitial,
      };
      onUpdate(updatedTicket);
      setIsDialogOpen(false);
      setEditingTicket(null);
      setClosingComment('');
      setClosingPerson('');
      setRepresentativeInitial('');
      await fetchTickets();
    }
  };

  const handleDeleteTicket = async (id: string) => {
    setTicketToDelete(id);
    setDeleteConfirmationOpen(true);
  };

  const confirmDeleteTicket = async () => {
    if (!ticketToDelete) return;
    setDeleteConfirmationOpen(false);
    if (!supabase) {
      console.error('Supabase client is not initialized.');
      return;
    }
    try {
      console.log('Attempting to delete ticket from Supabase with id:', ticketToDelete);
      const { error } = await supabase.from('tickets').delete().eq('id', ticketToDelete);
      if (error) {
        console.error('Error deleting ticket:', error);
        toast({
          title: 'Error deleting ticket',
          description: 'Could not delete ticket. Please try again.',
          variant: 'destructive',
        });
      } else {
        console.log('Ticket deleted from Supabase successfully with id:', ticketToDelete);
        deleteTicket(ticketToDelete);
        await fetchTickets();
        toast({
          title: 'Ticket deleted',
          description: 'This action is irreversible.',
        });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Unexpected error',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setTicketToDelete(null);
    }
  };

  const cancelDeleteTicket = () => {
    setTicketToDelete(null);
    setDeleteConfirmationOpen(false);
  };

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
    } finally {
      setLoading(false);
    }
  };

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

  const getNotifiedColor = (notified: boolean) => {
    return notified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        <Input
          type="password"
          placeholder="Enter admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 h-7 px-2 py-0.5"
        />
        <Button onClick={handleAdminLogin} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <TooltipProvider>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Notified</TableHead>
            <TableHead>Representative Initial</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Closed At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map(ticket => (
            <TableRow key={ticket.id}>
              <TableCell>
                {new Date(ticket.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>{ticket.customerName}</TableCell>
              <TableCell>{ticket.phoneNumber}</TableCell>
              <TableCell>
                <span className={cn('px-2 py-1 rounded-full text-sm', getStatusColor(ticket.status))}>
                  {ticket.status}
                </span>
              </TableCell>
              <TableCell>
                <span className={cn('px-2 py-1 rounded-full text-sm', getNotifiedColor(ticket.notified))}>
                  {ticket.notified ? 'Yes' : 'No'}
                </span>
              </TableCell>
              <TableCell>{ticket.representativeName}</TableCell>
              <TableCell>
                <span className={cn('px-2 py-1 rounded-full text-sm', getPriorityColor(ticket.priority))}>
                  {capitalizeFirstLetter(ticket.priority)}
                </span>
              </TableCell>
              <TableCell>{ticket.status === 'Closed' ? new Date(ticket.updatedAt).toLocaleDateString() : 'N/A'}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(ticket)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteTicket(ticket.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  {ticket.notes && (
                    <Button size="sm" variant="ghost" onClick={() => setViewingNotes(ticket.notes)}>
                      <MessageSquareIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!viewingNotes} onOpenChange={setViewingNotes}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Closing Notes</DialogTitle>
          </DialogHeader>
          <p>{viewingNotes}</p>
        </DialogContent>
      </Dialog>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Ticket</DialogTitle>
          </DialogHeader>
          {editingTicket && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    value={editingTicket.customerName}
                    onChange={e => setEditingTicket(prev => prev ? { ...prev, customerName: e.target.value } : null)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={editingTicket.phoneNumber}
                    onChange={e => setEditingTicket(prev => prev ? { ...prev, phoneNumber: e.target.value } : null)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editingTicket.email}
                    onChange={e => setEditingTicket(prev => prev ? { ...prev, email: e.target.value } : null)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={editingTicket.status}
                    onValueChange={value => setEditingTicket(prev => prev ? { ...prev, status: value as Ticket['status'] } : null)}
                  >
                    <SelectTrigger className={cn(getStatusColor(editingTicket.status))}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={editingTicket.priority}
                  onValueChange={value => setEditingTicket(prev => prev ? { ...prev, priority: value as TicketPriority } : null)}
                >
                  <SelectTrigger className={cn(getPriorityColor(editingTicket.priority))}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="issueDescription">Issue Description</Label>
                <Textarea
                  id="issueDescription"
                  value={editingTicket.issueDescription}
                  onChange={e => setEditingTicket(prev => prev ? { ...prev, issueDescription: e.target.value } : null)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notified">Customer Notified</Label>
                <Select
                  value={editingTicket.notified ? 'yes' : 'no'}
                  onValueChange={value => setEditingTicket(prev => prev ? { ...prev, notified: value === 'yes' } : null)}
                >
                  <SelectTrigger className={cn(editingTicket.notified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="representativeName">Representative Initial</Label>
                <Input
                  id="representativeName"
                  value={representativeInitial}
                  onChange={e => setRepresentativeInitial(e.target.value)}
                />
              </div>

              {editingTicket.status === 'Closed' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="closingComment">Closing Comment</Label>
                    <Textarea
                      id="closingComment"
                      value={closingComment}
                      onChange={e => setClosingComment(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <AlertDialog open={deleteConfirmationOpen} onOpenChange={setDeleteConfirmationOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this ticket? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDeleteTicket}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTicket}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  </div>
  );
}

