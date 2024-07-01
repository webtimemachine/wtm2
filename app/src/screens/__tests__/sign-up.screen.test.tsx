import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { useNavigation } from '../../store';
import { useSignUp } from '../../hooks';
import { SignUpScreen } from '../sign-up.screen';

// Mock de ServerUrlEditable
jest.mock('../../components', () => ({
  ServerUrlEditable: jest.fn(() => <div>ServerUrlEditable Mock</div>),
}));

// Mock de useNavigation y useSignUp
jest.mock('../../store', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('../../hooks', () => ({
  useSignUp: jest.fn(),
}));

const mockNavigateBack = jest.fn();
const mockMutate = jest.fn();
const mockIsPending = jest.fn();

(useNavigation as jest.Mock).mockReturnValue({
  navigateBack: mockNavigateBack,
});

(useSignUp as jest.Mock).mockReturnValue({
  signUpMutation: {
    mutate: mockMutate,
    isPending: mockIsPending,
  },
});

const customRender = (ui: React.ReactElement) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

describe('SignUpScreen', () => {
  test('renders the component with initial state', () => {
    customRender(<SignUpScreen />);

    expect(screen.getAllByText('Sign Up').length).toBe(2);
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm password')).toBeInTheDocument();
  });

  test('calls navigateBack when back icon is clicked', () => {
    customRender(<SignUpScreen />);

    const backButton = screen.getByLabelText('Back icon');
    fireEvent.click(backButton);

    expect(mockNavigateBack).toHaveBeenCalled();
  });

  test('shows error message for invalid email', async () => {
    customRender(<SignUpScreen />);

    (useSignUp as jest.Mock).mockReturnValue({
      signUpMutation: {
        mutate: mockMutate,
        isPending: false,
      },
    });

    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    const passInput = screen.getByPlaceholderText(
      'Enter password',
    ) as HTMLInputElement;
    fireEvent.change(passInput, { target: { value: 'pass123456' } });

    const confirmPassInput = screen.getByPlaceholderText(
      'Confirm password',
    ) as HTMLInputElement;
    fireEvent.change(confirmPassInput, { target: { value: 'pass123456' } });

    const signUpElements = screen.getAllByText('Sign Up');
    const signUpButton = signUpElements[1];
    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(
        screen.getByText('Please enter a valid email address'),
      ).toBeInTheDocument();
    });
  });

  test('shows error message for invalid password', async () => {
    (useSignUp as jest.Mock).mockReturnValue({
      signUpMutation: {
        mutate: mockMutate,
        isPending: false,
      },
    });

    customRender(<SignUpScreen />);

    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const passwordInput = screen.getByPlaceholderText('Enter password');
    fireEvent.change(passwordInput, { target: { value: 'invalid' } });

    const confirmPasswordInput =
      screen.getByPlaceholderText('Confirm password');
    fireEvent.change(confirmPasswordInput, { target: { value: 'Invalid123' } });

    const signUpButton = screen.getAllByText('Sign Up');
    fireEvent.click(signUpButton[1]);

    await waitFor(() => {
      expect(
        screen.getByText('Please enter a valid password'),
      ).toBeInTheDocument();
    });
  });

  test('shows error message for non-matching passwords', async () => {
    (useSignUp as jest.Mock).mockReturnValue({
      signUpMutation: {
        mutate: mockMutate,
        isPending: false,
      },
    });

    customRender(<SignUpScreen />);

    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const passwordInput = screen.getByPlaceholderText('Enter password');
    fireEvent.change(passwordInput, { target: { value: 'Valid123' } });

    const confirmPasswordInput =
      screen.getByPlaceholderText('Confirm password');
    fireEvent.change(confirmPasswordInput, { target: { value: 'Invalid123' } });

    const signUpButton = screen.getAllByText('Sign Up');
    fireEvent.click(signUpButton[1]);

    await waitFor(() => {
      expect(
        screen.getByText('Confirmation password must be equal to Password'),
      ).toBeInTheDocument();
    });
  });

  test('calls signUpMutation when inputs are valid', async () => {
    (useSignUp as jest.Mock).mockReturnValue({
      signUpMutation: {
        mutate: mockMutate,
        isPending: false,
      },
    });

    customRender(<SignUpScreen />);

    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const passwordInput = screen.getByPlaceholderText('Enter password');
    fireEvent.change(passwordInput, { target: { value: 'Valid123' } });

    const confirmPasswordInput =
      screen.getByPlaceholderText('Confirm password');
    fireEvent.change(confirmPasswordInput, { target: { value: 'Valid123' } });

    const signUpButton = screen.getAllByText('Sign Up');
    fireEvent.click(signUpButton[1]);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Valid123',
      });
    });
  });

  test('password tooltip works correctly', async () => {
    (useSignUp as jest.Mock).mockReturnValue({
      signUpMutation: {
        mutate: mockMutate,
        isPending: false,
      },
    });

    customRender(<SignUpScreen />);
    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const passwordInput = screen.getByPlaceholderText('Enter password');
    fireEvent.change(passwordInput, { target: { value: 'invalid' } });

    const confirmPasswordInput =
      screen.getByPlaceholderText('Confirm password');
    fireEvent.change(confirmPasswordInput, { target: { value: 'invalid' } });

    const signUpButton = screen.getAllByText('Sign Up');
    fireEvent.click(signUpButton[1]);

    await waitFor(() => {
      expect(
        screen.getByText(/Please enter a valid password/),
      ).toBeInTheDocument();
    });
  });

  test('shows and hides password on button click', () => {
    customRender(<SignUpScreen />);

    const passwordInput = screen.getByPlaceholderText('Enter password');
    const toggleButton = screen.getAllByText('Show');

    fireEvent.click(toggleButton[0]);
    expect(passwordInput).toHaveAttribute('type', 'text');

    fireEvent.click(toggleButton[0]);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('shows and hides confirm password on button click', () => {
    customRender(<SignUpScreen />);

    const confirmPasswordInput =
      screen.getByPlaceholderText('Confirm password');
    const toggleButton = screen.getAllByText('Show', { selector: 'button' });

    fireEvent.click(toggleButton[1]);
    expect(confirmPasswordInput).toHaveAttribute('type', 'text');

    fireEvent.click(toggleButton[1]);
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
  });
});
