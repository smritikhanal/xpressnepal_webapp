
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '@/app/auth/_components/login-form';
import { handleLogin } from '@/lib/actions/auth-action';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('@/lib/actions/auth-action', () => ({
    handleLogin: jest.fn(),
}));

jest.mock('@/store/auth-store', () => ({
    useAuthStore: jest.fn(),
}));

jest.mock('react-hot-toast', () => ({
    success: jest.fn(),
    error: jest.fn(),
}));

describe('LoginForm Integration', () => {
    const mockReplace = jest.fn();
    const mockSetAuth = jest.fn();

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });
        (useAuthStore as unknown as jest.Mock).mockReturnValue({ setAuth: mockSetAuth });
        jest.clearAllMocks();
    });

    it('renders login form correctly', () => {
        render(<LoginForm />);
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('validates empty inputs', async () => {
        render(<LoginForm />);
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
        await waitFor(() => {
            expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
            expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
        });
    });

    it('shows error on login failure', async () => {
        (handleLogin as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Invalid credentials',
        });

        render(<LoginForm />);
        fireEvent.input(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.input(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
            expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
        });
    });

    it('redirects to superadmin dashboard on success', async () => {
        (handleLogin as jest.Mock).mockResolvedValue({
            success: true,
            data: {
                user: { role: 'superadmin', name: 'Admin' },
                token: 'token123',
            },
        });

        render(<LoginForm />);
        fireEvent.input(screen.getByLabelText(/email/i), { target: { value: 'admin@example.com' } });
        fireEvent.input(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(mockSetAuth).toHaveBeenCalledWith({ role: 'superadmin', name: 'Admin' }, 'token123');
            expect(toast.success).toHaveBeenCalled();
            expect(mockReplace).toHaveBeenCalledWith('/admin/dashboard');
        });
    });

    it('redirects to seller dashboard on success', async () => {
        (handleLogin as jest.Mock).mockResolvedValue({
            success: true,
            data: {
                user: { role: 'seller', name: 'Seller' },
                token: 'token123',
            },
        });

        render(<LoginForm />);
        fireEvent.input(screen.getByLabelText(/email/i), { target: { value: 'seller@example.com' } });
        fireEvent.input(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(mockReplace).toHaveBeenCalledWith('/seller/dashboard');
        });
    });

    it('redirects to home on success for normal user', async () => {
        (handleLogin as jest.Mock).mockResolvedValue({
            success: true,
            data: {
                user: { role: 'user', name: 'User' },
                token: 'token123',
            },
        });

        render(<LoginForm />);
        fireEvent.input(screen.getByLabelText(/email/i), { target: { value: 'user@example.com' } });
        fireEvent.input(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(mockReplace).toHaveBeenCalledWith('/');
        });
    });
});
