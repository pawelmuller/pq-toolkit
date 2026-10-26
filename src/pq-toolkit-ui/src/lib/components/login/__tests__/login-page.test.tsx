import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../login-page';
import { loginFetch } from '@/lib/utils/fetchers';

// Mock the loginFetch function
jest.mock('@/lib/utils/fetchers', () => ({
  loginFetch: jest.fn()
}));

const mockRefreshAdminPage = jest.fn();

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders LoginPage and checks elements', () => {
    render(<LoginPage refreshAdminPage={mockRefreshAdminPage} />);

    expect(screen.getByText('Perceptual Qualities Toolkit')).toBeInTheDocument();
    expect(screen.getByText('Admin login page')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('shows error message on failed login attempt', async () => {
    ;(
      loginFetch as jest.MockedFunction<typeof loginFetch>
    ).mockImplementationOnce(async () => {
      throw new Error('Invalid password');
    });

    render(<LoginPage refreshAdminPage={mockRefreshAdminPage} />);

    const input = screen.getByLabelText('Password');
    const loginButton = screen.getByText('Login');

    fireEvent.change(input, { target: { value: 'wrongpassword' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Wrong password')).toBeInTheDocument();
    });
    expect(localStorage.getItem('token')).toBeNull();
  });

  test('successfully logs in and stores token', async () => {
    const mockToken = 'mockToken'
    ;(
      loginFetch as jest.MockedFunction<typeof loginFetch>
    ).mockImplementationOnce(async () => ({
      access_token: mockToken
    }));

    render(<LoginPage refreshAdminPage={mockRefreshAdminPage} />);

    const input = screen.getByLabelText('Password');
    const loginButton = screen.getByText('Login');

    fireEvent.change(input, { target: { value: 'correctpassword' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.queryByText('Wrong password')).not.toBeInTheDocument();
    });
    expect(localStorage.getItem('token')).toBe(mockToken);
    expect(mockRefreshAdminPage).toHaveBeenCalledTimes(1);
  });

  test('handles Enter key press for login attempt', async () => {
    const mockToken = 'mockToken'
    ;(
      loginFetch as jest.MockedFunction<typeof loginFetch>
    ).mockImplementationOnce(async () => ({
      access_token: mockToken
    }));

    render(<LoginPage refreshAdminPage={mockRefreshAdminPage} />);

    const input = screen.getByLabelText('Password');

    fireEvent.change(input, { target: { valuexzc: 'correctpassword' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(screen.queryByText('Wrong password')).not.toBeInTheDocument();
    });
    expect(localStorage.getItem('token')).toBe(mockToken);
    expect(mockRefreshAdminPage).toHaveBeenCalledTimes(1);
  });
});
