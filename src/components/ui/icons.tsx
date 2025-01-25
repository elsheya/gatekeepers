import * as React from 'react';

    const Icon = React.forwardRef<
      SVGSVGElement,
      React.SVGProps<SVGSVGElement>
    >(({ className, ...props }, ref) => (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
      />
    ));

    const MessageSquareIcon = React.forwardRef<
      SVGSVGElement,
      React.SVGProps<SVGSVGElement>
    >(({ className, ...props }, ref) => (
      <Icon ref={ref} className={className} {...props}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </Icon>
    ));
    MessageSquareIcon.displayName = 'MessageSquareIcon';

    const ClockIcon = React.forwardRef<
      SVGSVGElement,
      React.SVGProps<SVGSVGElement>
    >(({ className, ...props }, ref) => (
      <Icon ref={ref} className={className} {...props}>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </Icon>
    ));
    ClockIcon.displayName = 'ClockIcon';

    const CheckCircleIcon = React.forwardRef<
      SVGSVGElement,
      React.SVGProps<SVGSVGElement>
    >(({ className, ...props }, ref) => (
      <Icon ref={ref} className={className} {...props}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </Icon>
    ));
    CheckCircleIcon.displayName = 'CheckCircleIcon';

    const AlertCircleIcon = React.forwardRef<
      SVGSVGElement,
      React.SVGProps<SVGSVGElement>
    >(({ className, ...props }, ref) => (
      <Icon ref={ref} className={className} {...props}>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </Icon>
    ));
    AlertCircleIcon.displayName = 'AlertCircleIcon';

    const TicketIcon = React.forwardRef<
      SVGSVGElement,
      React.SVGProps<SVGSVGElement>
    >(({ className, ...props }, ref) => (
      <Icon ref={ref} className={className} {...props}>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <path d="M22 6H2v12h20V6z" />
        <path d="M2 6h20M2 18h20" />
      </Icon>
    ));
    TicketIcon.displayName = 'TicketIcon';

    const Pencil = React.forwardRef<
      SVGSVGElement,
      React.SVGProps<SVGSVGElement>
    >(({ className, ...props }, ref) => (
      <Icon ref={ref} className={className} {...props}>
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
      </Icon>
    ));
    Pencil.displayName = 'Pencil';

    const Trash2 = React.forwardRef<
      SVGSVGElement,
      React.SVGProps<SVGSVGElement>
    >(({ className, ...props }, ref) => (
      <Icon ref={ref} className={className} {...props}>
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
      </Icon>
    ));
    Trash2.displayName = 'Trash2';

    const UserIcon = React.forwardRef<
      SVGSVGElement,
      React.SVGProps<SVGSVGElement>
    >(({ className, ...props }, ref) => (
      <Icon ref={ref} className={className} {...props}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </Icon>
    ));
    UserIcon.displayName = 'UserIcon';

    const PhoneIcon = React.forwardRef<
      SVGSVGElement,
      React.SVGProps<SVGSVGElement>
    >(({ className, ...props }, ref) => (
      <Icon ref={ref} className={className} {...props}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 1979 1979 0 0 1-8.63-.73 11.9 11.9 0 0 1-3.91-3.91 1979 1979 0 0 1-.73-8.63A2 2 0 0 1 5 4h3a2 2 0 0 1 2 1.86 10.5 10.5 0 0 0 2.5 2.5 2 2 0 0 1 1.86 2v3a2 2 0 0 1 2 2z" />
      </Icon>
    ));
    PhoneIcon.displayName = 'PhoneIcon';

    const MailIcon = React.forwardRef<
      SVGSVGElement,
      React.SVGProps<SVGSVGElement>
    >(({ className, ...props }, ref) => (
      <Icon ref={ref} className={className} {...props}>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22 6 12 13 2 6" />
      </Icon>
    ));
    MailIcon.displayName = 'MailIcon';

    const ListOrderedIcon = React.forwardRef<
      SVGSVGElement,
      React.SVGProps<SVGSVGElement>
    >(({ className, ...props }, ref) => (
      <Icon ref={ref} className={className} {...props}>
        <path d="M10 6h10" />
        <path d="M10 12h10" />
        <path d="M10 18h10" />
        <path d="M4 6h.01" />
        <path d="M4 12h.01" />
        <path d="M4 18h.01" />
      </Icon>
    ));
    ListOrderedIcon.displayName = 'ListOrderedIcon';

    export {
      MessageSquareIcon,
      ClockIcon,
      CheckCircleIcon,
      AlertCircleIcon,
      TicketIcon,
      Pencil,
      Trash2,
      UserIcon,
      PhoneIcon,
      MailIcon,
      ListOrderedIcon,
    };
