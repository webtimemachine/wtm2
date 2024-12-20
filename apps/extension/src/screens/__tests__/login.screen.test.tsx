import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { useLogin, useExtensionNavigation } from '../../hooks';
import { useAuthStore } from '../../store';
import { LoginScreen } from '../login.screen';
import { isLoginRes } from '@wtm/api';
import { ExtensionRoutes } from '../../hooks/use-extension-navigation';

// Mock de ServerUrlEditable
jest.mock('../../components', () => ({
  ServerUrlEditable: jest.fn(() => <div>ServerUrlEditable Mock</div>),
}));

// Mock del hook useLogin
jest.mock('../../hooks', () => ({
  useLogin: jest.fn(),
  useExtensionNavigation: jest.fn(),
}));

const mockNavigateTo = jest.fn();
(useExtensionNavigation as jest.Mock).mockReturnValue({
  navigateTo: mockNavigateTo,
});

// Mock de useAuthStore
jest.mock('../../store', () => ({
  useAuthStore: jest.fn(),
  useNavigation: jest.fn(),
}));

// Mock de clsx
jest.mock('clsx');

jest.mock('@wtm/api', () => ({
  isLoginRes: jest.fn(),
}));

jest.mock('../../utils/updateIcon', () => ({
  updateIcon: jest.fn(),
}));

jest.mock('wouter', () => ({
  useLocation: jest.fn(),
}));

const mockDeviceKey = 'mockDeviceKey';

global.chrome = {
  action: {
    setIcon: jest.fn(),
  },
  storage: {
    local: {
      get: jest.fn().mockReturnValue('http://example.com'),
    },
  },
  runtime: {
    sendNativeMessage: jest.fn(),
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

const mockLoginMutation = {
  mutate: jest.fn(),
  isSuccess: true,
  isPending: false,
  data: {
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
  },
};

(useLogin as jest.Mock).mockReturnValue({ loginMutation: mockLoginMutation });
(useAuthStore as jest.Mock).mockReturnValue({ deviceKey: mockDeviceKey });

const customRender = (ui: React.ReactElement) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

describe('LoginScreen', () => {
  beforeAll(() => {
    Object.defineProperty(window.navigator, 'userAgentData', {
      value: {
        platform: 'Test',
      },
      writable: true,
    });
  });
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window.navigator as any)?.userAgentData || '{}',
      ),
    });
  });

  test('button should be disabled when email is empty', () => {
    customRender(<LoginScreen />);

    const signInButton = screen.getByText('Sign In') as HTMLButtonElement;

    expect(signInButton.disabled).toBeTruthy();
  });

  test('navigates to correct screen on success', async () => {
    (isLoginRes as jest.MockedFunction<typeof isLoginRes>).mockReturnValue(
      true,
    );

    customRender(<LoginScreen />);

    await waitFor(() =>
      expect(mockNavigateTo).toHaveBeenCalledWith(
        ExtensionRoutes.NAVIGATION_ENTRIES,
      ),
    );
  });

  test('navega a validate-email cuando la respuesta de login tiene partialToken', async () => {
    (isLoginRes as jest.MockedFunction<typeof isLoginRes>).mockReturnValue(
      false,
    );

    customRender(<LoginScreen />);

    await waitFor(() =>
      expect(mockNavigateTo).toHaveBeenCalledWith(
        ExtensionRoutes.VALIDATE_EMAIL,
      ),
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

    expect(mockNavigateTo).toHaveBeenCalledWith(
      ExtensionRoutes.FORGOT_PASSWORD,
    );
  });

  test('navigates to sign up screen', () => {
    customRender(<LoginScreen />);

    const signUpLink = screen.getByText('Sign up') as HTMLElement;

    fireEvent.click(signUpLink);

    expect(mockNavigateTo).toHaveBeenCalledWith(ExtensionRoutes.SIGN_UP);
  });
});
