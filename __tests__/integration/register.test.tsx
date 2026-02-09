
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterForm from '@/app/auth/_components/register-form';
import { handleRegister } from '@/lib/actions/auth-action';
import { useAuthStore } from '@/store/auth-store';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    useSearchParams: jest.fn(),
}));

jest.mock('@/lib/actions/auth-action', () => ({
    handleRegister: jest.fn(),
}));

jest.mock('@/store/auth-store', () => ({
    useAuthStore: jest.fn(),
}));

jest.mock('react-hot-toast', () => ({
    success: jest.fn(),
    error: jest.fn(),
}));

describe('RegisterForm Integration', () => {
    const mockReplace = jest.fn();
    const mockSetAuth = jest.fn();
    const mockGet = jest.fn();

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });
        (useSearchParams as jest.Mock).mockReturnValue({ get: mockGet });
        (useAuthStore as unknown as jest.Mock).mockReturnValue({ setAuth: mockSetAuth });
        jest.clearAllMocks();
    });

    it('renders register form correctly', () => {
        render(<RegisterForm />);
        expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
        // Use Use exact match or distinct regex
        const passwordInputs = screen.getAllByLabelText(/password/i);
        expect(passwordInputs.length).toBeGreaterThanOrEqual(2);
    });

    it('validates empty inputs', async () => {
        render(<RegisterForm />);
        fireEvent.click(screen.getByRole('button', { name: /create account/i }));
        await waitFor(() => {
            expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
            expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
        });
    });

    it('toggles seller fields', async () => {
        render(<RegisterForm />);
        const sellerRadio = screen.getByLabelText(/seller/i);
        fireEvent.click(sellerRadio);

        await waitFor(() => {
            expect(screen.getByLabelText(/shop name/i)).toBeInTheDocument();
        });
    });

    it('validates password mismatch', async () => {
        render(<RegisterForm />);
        fireEvent.input(screen.getByLabelText(/^Password$/i), { target: { value: 'password123' } });
        fireEvent.input(screen.getByLabelText(/confirm password/i), { target: { value: 'password456' } });
        fireEvent.click(screen.getByRole('button', { name: /create account/i }));

        await waitFor(() => {
            expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument();
        });
    });

    it('handles successful customer registration', async () => {
        (handleRegister as jest.Mock).mockResolvedValue({
            success: true,
            data: {
                user: { role: 'customer', name: 'John' },
                token: 'token123',
            },
        });

        render(<RegisterForm />);

        // Fill form
        fireEvent.input(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
        fireEvent.input(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
        fireEvent.input(screen.getByLabelText(/phone/i), { target: { value: '9812345678' } });
        fireEvent.input(screen.getByLabelText(/^Password$/i), { target: { value: 'password123' } });
        fireEvent.input(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /create account/i }));

        await waitFor(() => {
            expect(handleRegister).toHaveBeenCalled();
            expect(mockSetAuth).toHaveBeenCalled();
            expect(mockReplace).toHaveBeenCalledWith('/');
        });
    });

    it('handles successful seller registration', async () => {
        (handleRegister as jest.Mock).mockResolvedValue({
            success: true,
            data: {
                user: { role: 'seller', name: 'ShopOwner' },
                token: 'token123',
            },
        });

        render(<RegisterForm />);
        fireEvent.click(screen.getByLabelText(/seller/i));

        fireEvent.input(screen.getByLabelText(/full name/i), { target: { value: 'Shop Owner' } });
        fireEvent.input(screen.getByLabelText(/email/i), { target: { value: 'shop@example.com' } });
        fireEvent.input(screen.getByLabelText(/phone/i), { target: { value: '9812345678' } });
        fireEvent.input(screen.getByLabelText(/^Password$/i), { target: { value: 'password123' } });
        fireEvent.input(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
        fireEvent.input(screen.getByLabelText(/shop name/i), { target: { value: 'My Shop' } });

        fireEvent.click(screen.getByRole('button', { name: /create account/i }));

        await waitFor(() => {
            expect(mockReplace).toHaveBeenCalledWith('/seller/dashboard');
        });
    });

    it('displays error message from API', async () => {
        (handleRegister as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Email already exists',
        });

        render(<RegisterForm />);
        fireEvent.input(screen.getByLabelText(/email/i), { target: { value: 'existing@example.com' } });
        fireEvent.click(screen.getByRole('button', { name: /create account/i }));

        await waitFor(() => {
            // Since validation might fail first if other fields are empty, we should fill required fields
            expect(screen.getAllByText(/must be/i).length).toBeGreaterThan(0);
        });

        // Let's fill all fields to trigger API call
        fireEvent.input(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
        fireEvent.input(screen.getByLabelText(/phone/i), { target: { value: '9812345678' } });
        fireEvent.input(screen.getByLabelText(/^Password$/i), { target: { value: 'password123' } });
        fireEvent.input(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });

        // Clear previous validations
        fireEvent.click(screen.getByRole('button', { name: /create account/i }));

        await waitFor(() => {
            expect(screen.getByText('Email already exists')).toBeInTheDocument();
        });
    });
});
