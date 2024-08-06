import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { useNavigation } from '../../../store';
import AboutWTMScreen from '../../about/page';

// Mock de useNavigation
jest.mock('../../../store', () => ({
  useNavigation: jest.fn(),
  useAuthStore: jest.fn(),
}));

const mockNavigateBack = jest.fn();
(useNavigation as jest.Mock).mockReturnValue({
  navigateBack: mockNavigateBack,
});

const customRender = (ui: React.ReactElement) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

describe('AboutWTMScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the component with initial state', () => {
    customRender(<AboutWTMScreen />);

    expect(screen.getByText('About')).toBeInTheDocument();
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
});
