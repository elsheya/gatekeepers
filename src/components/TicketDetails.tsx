import { useState } from 'react';
  import { Card } from "@/components/ui/card";
  import { Button } from "@/components/ui/button";
  import { Textarea } from "@/components/ui/textarea";
  import { Badge } from "@/components/ui/badge";
  import { ScrollArea } from "@/components/ui/scroll-area";
  import { MessageSquareIcon, ClockIcon, AlertCircleIcon, UserIcon, PhoneIcon, MailIcon, ListOrderedIcon } from './ui/icons';
  import type { Ticket, TicketComment } from '@/lib/types';
  import { cn } from '@/lib/utils';

  type Props = {
    ticket: Ticket;
    onAddComment: (ticketId: string, comment: string) => void;
  };

  export function TicketDetails({ ticket, onAddComment }: Props) {
    const [newComment, setNewComment] = useState('');

    const handleSubmitComment = () => {
      if (newComment.trim()) {
        onAddComment(ticket.id, newComment);
        setNewComment('');
      }
    };

    const getStatusColor = (status: string) => {
      const colors = {
        Open: 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100',
        'In Progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100',
        Closed: 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100',
      };
      return colors[status as keyof typeof colors] || '';
    };

    const capitalizeFirstLetter = (str: string) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
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

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start flex-wrap">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{ticket.ticketNumber}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Created on {new Date(ticket.createdAt).toLocaleString()}</p>
          </div>
          <div className="flex space-x-2 items-center">
            <Badge variant="outline" className={getStatusColor(ticket.status)}>
              {ticket.status}
            </Badge>
            <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
              {capitalizeFirstLetter(ticket.priority)}
            </Badge>
          </div>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1"><UserIcon className="h-3 w-3"/>Customer Name (School System Name)</p>
                <p className="text-gray-900 dark:text-gray-100 mb-1">{ticket.customerName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1"><MailIcon className="h-3 w-3"/>Email</p>
                <p className="text-gray-900 dark:text-gray-100 mb-1">{ticket.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1"><PhoneIcon className="h-3 w-3"/>Phone</p>
                <p className="text-gray-900 dark:text-gray-100 mb-1">{ticket.phoneNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Representative Initial</p>
                <p className="text-gray-900 dark:text-gray-100 mb-1">{ticket.representativeName}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1"><ListOrderedIcon className="h-3 w-3"/>Issue Description</p>
              <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap mb-1">{ticket.issueDescription}</p>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">Closing Note</p>
              <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap mt-1">{ticket.notes}</p>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MessageSquareIcon className="h-5 w-5" />
            Comments
          </h3>
          <ScrollArea className="h-[150px] sm:h-[200px] rounded-md border p-4">
            {ticket.comments.map((comment: TicketComment) => (
              <div key={comment.id} className="mb-4 last:mb-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Staff Member</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                  {comment.content}
                </p>
              </div>
            ))}
          </ScrollArea>

          <div className="space-y-2">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px]"
            />
            <Button onClick={handleSubmitComment} className="w-full">
              Add Comment
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 flex-wrap">
          <div className="flex items-center gap-1">
            <ClockIcon className="h-4 w-4" />
            Last updated: {new Date(ticket.updatedAt).toLocaleString()}
          </div>
          {ticket.notified && (
            <div className="flex items-center gap-1">
              <AlertCircleIcon className="h-4 w-4" />
              Customer notified
            </div>
          )}
          {ticket.status === 'Closed' && (
            <div className="flex items-center gap-1">
              <ClockIcon className="h-4 w-4" />
              Closed at: {new Date(ticket.updatedAt).toLocaleString()}
            </div>
          )}
        </div>
      </div>
    );
  }
