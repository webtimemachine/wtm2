import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { useLogin } from '../../hooks';
import { useAuthStore, useNavigation } from '../../store';
import { LoginScreen } from '../login.screen';

// Mock de ServerUrlEditable
jest.mock('../../components', () => ({
  ServerUrlEditable: jest.fn(() => <div>ServerUrlEditable Mock</div>),
}));

// Mock del hook useLogin
jest.mock('../../hooks', () => ({
  useLogin: jest.fn(),
}));

// Mock de useAuthStore
jest.mock('../../store', () => ({
  useAuthStore: jest.fn(),
  useNavigation: jest.fn(),
}));

// Mock de clsx
jest.mock('clsx');

global.chrome = {
  action: {
    setIcon: jest.fn(),
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

const mockLoginMutation = {
  mutate: jest.fn(),
  isSuccess: false,
  isPending: false,
  data: null,
};

const mockNavigateTo = jest.fn();
const mockDeviceKey = 'mockDeviceKey';

(useLogin as jest.Mock).mockReturnValue({ loginMutation: mockLoginMutation });
(useAuthStore as jest.Mock).mockReturnValue({ deviceKey: mockDeviceKey });
(useNavigation as jest.Mock).mockReturnValue({ navigateTo: mockNavigateTo });

const customRender = (ui: React.ReactElement) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the component with initial state', () => {
    customRender(<LoginScreen />);

    expect(screen.getByText('WebTM')).toBeInTheDocument();
    expect(screen.getByText('ServerUrlEditable Mock')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument();
    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
  });

  test('validates email input', () => {
    customRender(<LoginScreen />);

    const emailInput = screen.getByPlaceholderText('Email') as HTMLInputElement;
    const passInput = screen.getByPlaceholderText(
      'Enter password',
    ) as HTMLInputElement;
    const signInButton = screen.getByText('Sign In') as HTMLButtonElement;

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passInput, { target: { value: 'pass123456' } });
    fireEvent.click(signInButton);

    expect(
      screen.getByText('Please enter a valid email address'),
    ).toBeInTheDocument();
  });

  test('calls loginMutation with correct data', async () => {
    customRender(<LoginScreen />);

    const emailInput = screen.getByPlaceholderText('Email') as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText(
      'Enter password',
    ) as HTMLInputElement;
    const signInButton = screen.getByText('Sign In') as HTMLButtonElement;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });

    fireEvent.click(signInButton);

    await waitFor(() => expect(mockLoginMutation.mutate).toHaveBeenCalled());

    expect(mockLoginMutation.mutate).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
      deviceKey: { deviceKey: mockDeviceKey },
      userAgent: window.navigator.userAgent,
      userAgentData: JSON.stringify(
        (window as any)?.navigator?.userAgentData || '{}',
      ),
    });
  });

  test('button should be disabled when email is empty', () => {
    customRender(<LoginScreen />);

    const signInButton = screen.getByText('Sign In') as HTMLButtonElement;

    expect(signInButton.disabled).toBeTruthy();
  });

  test('navigates to correct screen on success', async () => {
    mockLoginMutation.isSuccess = true;
    (mockLoginMutation as any).data = {
      accessToken: 'tokenTest123',
      refreshToken: 'refreshTest123',
      user: {
        id: 0,
        email: 'email@test.com',
      },
      userDevice: {
        id: 0,
        userId: 0,
        deviceId: 0,
        isCurrentDevice: true,
        deviceAlias: 'test-string',
        device: {
          id: 0,
          deviceKey: 'test-string',
          userAgent:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
          uaResult: {
            ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            browser: {
              name: 'Chrome',
              version: '121.0.0.0',
              major: '121',
            },
            engine: {
              name: 'Blink',
              version: '121.0.0.0',
            },
            os: {
              name: 'Windows',
              version: '10',
            },
            device: {},
            cpu: {
              architecture: 'amd64',
            },
          },
          userAgentData:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        },
      },
    };

    customRender(<LoginScreen />);

    await waitFor(() =>
      expect(mockNavigateTo).toHaveBeenCalledWith('navigation-entries'),
    );
  });

  test('navigates to validate-email when login response with partialToken', async () => {
    mockLoginMutation.isSuccess = true;
    (mockLoginMutation as any).data = {
      id: 0,
      email: 'email@test.com',
      partialToken: 'partialTest123',
    };
    customRender(<LoginScreen />);

    await waitFor(() =>
      expect(mockNavigateTo).toHaveBeenCalledWith('validate-email'),
    );
  });

  test('toggles password visibility', () => {
    customRender(<LoginScreen />);

    const passwordInput = screen.getByPlaceholderText(
      'Enter password',
    ) as HTMLInputElement;
    const toggleButton = screen.getByText('Show') as HTMLButtonElement;

    fireEvent.click(toggleButton);

    expect(passwordInput.type).toBe('text');

    fireEvent.click(toggleButton);

    expect(passwordInput.type).toBe('password');
  });

  test('navigates to forgot password screen', () => {
    customRender(<LoginScreen />);

    const forgotPasswordLink = screen.getByText(
      'Forgot password?',
    ) as HTMLElement;

    fireEvent.click(forgotPasswordLink);

    expect(mockNavigateTo).toHaveBeenCalledWith('forgot-password');
  });

  test('navigates to sign up screen', () => {
    customRender(<LoginScreen />);

    const signUpLink = screen.getByText('Sign up') as HTMLElement;

    fireEvent.click(signUpLink);

    expect(mockNavigateTo).toHaveBeenCalledWith('sign-up');
  });
});
