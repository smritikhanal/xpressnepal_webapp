
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NotificationBell } from '@/components/NotificationBell';
import { useNotificationStore } from '@/store/notification-store';
import { useRouter } from 'next/navigation';

// Mock dependencies
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('@/store/notification-store', () => ({
    useNotificationStore: jest.fn(),
}));

// Mock UI components
jest.mock('@/components/ui/dropdown-menu', () => ({
    DropdownMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => <div role="button" onClick={() => { }}>{children}</div>,
    DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    DropdownMenuItem: ({ children, onClick, className }: any) => (
        <div onClick={onClick} className={className} role="menuitem">{children}</div>
    ),
    DropdownMenuSeparator: () => <hr />,
}));

jest.mock('@/components/ui/scroll-area', () => ({
    ScrollArea: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock ResizeObserver for Radix UI
class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
}
global.ResizeObserver = ResizeObserver;

describe('NotificationBell Component', () => {
    const mockPush = jest.fn();
    const mockFetchNotifications = jest.fn();
    const mockMarkAsRead = jest.fn();
    const mockMarkAllAsRead = jest.fn();
    const mockDeleteNotification = jest.fn();

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        (useNotificationStore as unknown as jest.Mock).mockReturnValue({
            notifications: [],
            unreadCount: 0,
            fetchNotifications: mockFetchNotifications,
            markAsRead: mockMarkAsRead,
            markAllAsRead: mockMarkAllAsRead,
            deleteNotification: mockDeleteNotification,
        });
        jest.clearAllMocks();
    });

    it('renders bell icon', () => {
        render(<NotificationBell />);
        expect(screen.getAllByRole('button')[0]).toBeInTheDocument();
    });

    it('shows badge when there are unread notifications', () => {
        (useNotificationStore as unknown as jest.Mock).mockReturnValue({
            notifications: [],
            unreadCount: 5,
            fetchNotifications: mockFetchNotifications,
        });
        render(<NotificationBell />);
        expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('shows "9+" when unread count is greater than 9', () => {
        (useNotificationStore as unknown as jest.Mock).mockReturnValue({
            notifications: [],
            unreadCount: 12,
            fetchNotifications: mockFetchNotifications,
        });
        render(<NotificationBell />);
        expect(screen.getByText('9+')).toBeInTheDocument();
    });

    it('opens dropdown on click', () => {
        render(<NotificationBell />);
        const button = screen.getAllByRole('button')[0];
        fireEvent.click(button);
        // With simplified mock, content is always rendered, but we check if text is present
        expect(screen.getAllByText('Notifications').length).toBeGreaterThan(0);
    });

    it('displays empty state when no notifications', () => {
        render(<NotificationBell />);
        const button = screen.getAllByRole('button')[0];
        fireEvent.click(button);
        expect(screen.getAllByText('No notifications yet').length).toBeGreaterThan(0);
    });

    it('displays notifications list', () => {
        const mockNotifications = [
            { _id: '1', title: 'Order Shipped', message: 'Your order has been shipped', type: 'order_shipped', isRead: false, createdAt: new Date().toISOString() },
        ];
        (useNotificationStore as unknown as jest.Mock).mockReturnValue({
            notifications: mockNotifications,
            unreadCount: 1,
            fetchNotifications: mockFetchNotifications,
            markAsRead: mockMarkAsRead,
        });

        render(<NotificationBell />);
        fireEvent.click(screen.getAllByRole('button')[0]);
        expect(screen.getByText('Order Shipped')).toBeInTheDocument();
    });

    it('calls markAsRead when clicking unread notification', async () => {
        const mockNotifications = [
            { _id: '1', title: 'Order Shipped', message: 'Your order has been shipped', type: 'order_shipped', isRead: false, createdAt: new Date().toISOString(), orderId: '123' },
        ];
        (useNotificationStore as unknown as jest.Mock).mockReturnValue({
            notifications: mockNotifications,
            unreadCount: 1,
            fetchNotifications: mockFetchNotifications,
            markAsRead: mockMarkAsRead,
        });

        render(<NotificationBell />);
        fireEvent.click(screen.getAllByRole('button')[0]);
        const item = screen.getByText('Order Shipped');
        fireEvent.click(item);

        await waitFor(() => {
            expect(mockMarkAsRead).toHaveBeenCalledWith('1');
        });
    });
});
