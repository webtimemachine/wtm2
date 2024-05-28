import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { useNavigation } from '../../store';
import { AboutWTMScreen } from '../about-wtm.screen';

// Mock de useNavigation
jest.mock('../../store', () => ({
  useNavigation: jest.fn(),
}));

const mockNavigateBack = jest.fn();
(useNavigation as jest.Mock).mockReturnValue({
  navigateBack: mockNavigateBack,
});

// Mock de chrome.storage y chrome.runtime
global.chrome = {
  storage: {
    local: {
      get: jest.fn().mockImplementation(() => {
        return { serverUrl: 'http://example.com' };
      }),
    },
  },
  runtime: {
    getManifest: jest.fn().mockImplementation(() => {
      return { version: '1.0.0' };
    }),
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

const customRender = (ui: React.ReactElement) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

describe('AboutWTMScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the component with initial state', () => {
    customRender(<AboutWTMScreen />);

    expect(screen.getByText('About WTM')).toBeInTheDocument();
    expect(screen.getByText('Version:')).toBeInTheDocument();
    expect(screen.getByText('Backend URL:')).toBeInTheDocument();
    expect(screen.getByText('Report an Issue')).toBeInTheDocument();
    expect(screen.getByText('Privacy Policies')).toBeInTheDocument();
  });

  test('calls navigateBack when back button is clicked', () => {
    customRender(<AboutWTMScreen />);

    const backButton = screen.getByLabelText('Back icon');
    fireEvent.click(backButton);

    expect(mockNavigateBack).toHaveBeenCalled();
  });

  test('opens the correct URL when "Report an Issue" is clicked', () => {
    customRender(<AboutWTMScreen />);
    jest.spyOn(global.window, 'open');
    const reportIssue = screen.getByText('Report an Issue');
    fireEvent.click(reportIssue);

    expect(global.window.open).toHaveBeenCalledWith(
      'https://github.com/webtimemachine/wtm2/issues',
      '_blank',
    );
  });

  test('opens the correct URL when "Privacy Policies" is clicked', () => {
    customRender(<AboutWTMScreen />);
    jest.spyOn(global.window, 'open');
    const privacyPolicies = screen.getByText('Privacy Policies');
    fireEvent.click(privacyPolicies);

    expect(global.window.open).toHaveBeenCalledWith(
      'https://www.webtm.io/privacy-policies.html',
      '_blank',
    );
  });

  test('fetches backend URL from chrome storage', async () => {
    customRender(<AboutWTMScreen />);

    await waitFor(() => {
      expect(screen.getByText('http://example.com')).toBeInTheDocument();
    });
  });
});
