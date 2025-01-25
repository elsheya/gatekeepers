import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Ticket } from '../lib/types';
import { cn, generateTicketNumber } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UserIcon, PhoneIcon, MailIcon, ListOrderedIcon, CheckIcon } from '@/components/ui/icons';
import { supabase } from '@/lib/supabase';
import { getSession, signIn } from '@/lib/auth';

type Props = {
  onSubmit: (ticket: Ticket) => void;
};

export function CustomerServiceForm({ onSubmit }: Props) {
  const [notified, setNotified] = useState(false);
  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm<Ticket>();
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submittedTicketNumber, setSubmittedTicketNumber] = useState('');
  const [localTickets, setLocalTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedTickets = localStorage.getItem('localTickets');
    if (storedTickets) {
      setLocalTickets(JSON.parse(storedTickets));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('localTickets', JSON.stringify(localTickets));
  }, [localTickets]);

  const onSubmitForm = async (data: any) => {
    setLoading(true);
    console.log('onSubmitForm called');
    const ticketNumber = generateTicketNumber();
    const newTicket: Omit<Ticket, 'id'> = {
      ...data,
      ticketNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notified,
      status: selectedStatus || 'Open',
      comments: [],
      representativeName: data.representativeName,
      priority: 'medium',
      notes: data.notes || null,
    };

    if (!supabase) {
      console.error('Supabase client is not initialized.');
      toast({
        title: 'Error submitting ticket',
        description: 'Supabase client is not initialized. Please try again later.',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    try {
      const { data: sessionData, error: sessionError } = await getSession();

      if (sessionError || !sessionData?.session) {
        const signInData = await signIn();
        if (!signInData?.session) {
          console.error('Error signing in user.');
          toast({
            title: 'Error submitting ticket',
            description: 'Could not sign in user. Please try again later.',
            variant: 'destructive',
          });
          setLoading(false);
          return;
        }
        sessionData = signInData;
      }

      const { error } = await supabase
        .from('tickets')
        .insert([
          {
            ...newTicket,
            comments: [],
          }
        ], {
          headers: {
            Authorization: `Bearer ${sessionData.session.access_token}`,
          },
        });

      if (error) {
        console.error('Error inserting ticket:', error);
        toast({
          title: 'Error submitting ticket',
          description: 'Please try again.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      setLocalTickets(prevTickets => [...prevTickets, newTicket as Ticket]);
      setSubmittedTicketNumber(ticketNumber);
      setIsModalOpen(true);
      onSubmit(newTicket as Ticket);
      reset();
      setNotified(false);
      setSelectedStatus(undefined);
      toast({
        title: 'Ticket submitted successfully',
        description: `Your ticket number is: ${ticketNumber}`,
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Unexpected error',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string | undefined) => {
    const colors = {
      Open: 'bg-green-100 text-green-800',
      'In Progress': 'bg-yellow-100 text-yellow-800',
      Closed: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || '';
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="customerName">Customer Name (School System Name)</Label>
            <div className="relative">
              <Input
                id="customerName"
                {...register('customerName', { required: true })}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-10"
              />
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            {errors.customerName && <span className="text-sm text-red-500">This field is required</span>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <div className="relative">
              <Input
                id="phoneNumber"
                {...register('phoneNumber', { required: true })}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-10"
              />
              <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            {errors.phoneNumber && <span className="text-sm text-red-500">This field is required</span>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                {...register('email', { required: true })}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-10"
              />
              <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            {errors.email && <span className="text-sm text-red-500">This field is required</span>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select onValueChange={(value) => {
              setSelectedStatus(value);
              register('status').onChange({ target: { value } });
            }}>
              <SelectTrigger className={cn(getStatusColor(selectedStatus), 'w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50')}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Open" className={getStatusColor('Open')}>Open</SelectItem>
                <SelectItem value="In Progress" className={getStatusColor('In Progress')}>In Progress</SelectItem>
                <SelectItem value="Closed" className={getStatusColor('Closed')}>Closed</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && <span className="text-sm text-red-500">This field is required</span>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="issueDescription">Issue Description</Label>
          <div className="relative">
            <Textarea
              id="issueDescription"
              {...register('issueDescription', { required: true })}
              className="min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-10"
            />
            <ListOrderedIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          </div>
          {errors.issueDescription && <span className="text-sm text-red-500">This field is required</span>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="notified">Customer Notified</Label>
          <Select
            onValueChange={(value) => {
              setNotified(value === 'yes');
              register('notified').onChange({ target: { value: value === 'yes' } });
            }}
          >
            <SelectTrigger className={cn(notified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800', 'w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50')}>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="representativeName">Representative Initial</Label>
          <div className="relative">
            <Input
              id="representativeName"
              {...register('representativeName', { required: true })}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-10"
            />
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          {errors.representativeName && <span className="text-sm text-red-500">This field is required</span>}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Ticket'}
        </Button>
      </form>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ticket Submitted</DialogTitle>
          </DialogHeader>
          <p>Your ticket number is: {submittedTicketNumber}</p>
        </DialogContent>
      </Dialog>
    </>
  );
}
