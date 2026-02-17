import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '@/app/auth/_components/login-form';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { handleLogin } from '@/lib/actions/auth-action';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/store/auth-store', () => ({
  useAuthStore: jest.fn(),
}));

jest.mock('@/lib/actions/auth-action', () => ({
  handleLogin: jest.fn(),
}));

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('LoginForm', () => {
  const mockPush = jest.fn();
  const mockReplace = jest.fn();
  const mockSetAuth = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: mockReplace,
    });
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      setAuth: mockSetAuth,
    });
  });

  it('renders login form with email and password fields', () => {
    render(<LoginForm />);
    
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('displays validation errors for invalid inputs', async () => {
    render(<LoginForm />);
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });
  });

  it('shows forgot password link', () => {
    render(<LoginForm />);
    
    const forgotLink = screen.getByText(/forgot/i);
    expect(forgotLink).toBeInTheDocument();
    expect(forgotLink.closest('a')).toHaveAttribute('href', '/auth/forgot-password');
  });

  it('submits form with valid credentials', async () => {
    const mockLoginResponse = {
      success: true,
      data: {
        user: {
          name: 'Test User',
          email: 'test@example.com',
          role: 'customer',
        },
        token: 'mock-token',
      },
    };

    (handleLogin as jest.Mock).mockResolvedValue(mockLoginResponse);

    render(<LoginForm />);
    
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(handleLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(mockSetAuth).toHaveBeenCalledWith(
        mockLoginResponse.data.user,
        mockLoginResponse.data.token
      );
    });
  });
});
