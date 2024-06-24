import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { useNavigation } from '../../store';
import { useLogout } from '../../hooks';
import { SettingsScreen } from '../settings.screen';

// Mock de useNavigation y useLogout
jest.mock('../../store', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('../../hooks', () => ({
  useLogout: jest.fn(),
}));

const mockNavigateBack = jest.fn();
const mockNavigateTo = jest.fn();
const mockLogout = jest.fn();

(useNavigation as jest.Mock).mockReturnValue({
  navigateBack: mockNavigateBack,
  navigateTo: mockNavigateTo,
});

(useLogout as jest.Mock).mockReturnValue({
  logout: mockLogout,
});

const customRender = (ui: React.ReactElement) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

describe('SettingsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the component with initial state', () => {
    customRender(<SettingsScreen />);

    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Preferences')).toBeInTheDocument();
    expect(screen.getByText('Active Sessions')).toBeInTheDocument();
    expect(screen.getByText('Open in new tab')).toBeInTheDocument();
    expect(screen.getByText('About WTM')).toBeInTheDocument();
    expect(screen.getByText('Delete account')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('calls navigateBack when back button is clicked', () => {
    customRender(<SettingsScreen />);

    const backButton = screen.getByLabelText('Settings icon');
    fireEvent.click(backButton);

    expect(mockNavigateBack).toHaveBeenCalled();
  });

  test('navigates to correct screens when options are clicked', () => {
    customRender(<SettingsScreen />);

    fireEvent.click(screen.getByText('Preferences'));
    expect(mockNavigateTo).toHaveBeenCalledWith('preferences');

    fireEvent.click(screen.getByText('Active Sessions'));
    expect(mockNavigateTo).toHaveBeenCalledWith('active-sessions');

    fireEvent.click(screen.getByText('About WTM'));
    expect(mockNavigateTo).toHaveBeenCalledWith('about-wtm');

    fireEvent.click(screen.getByText('Delete account'));
    expect(mockNavigateTo).toHaveBeenCalledWith('confirm-delete-account');
  });

  test('opens new tab with current URL when "Open in new tab" is clicked', () => {
    jest.spyOn(global.window, 'open');
    customRender(<SettingsScreen />);

    const openInNewTab = screen.getByText('Open in new tab');
    fireEvent.click(openInNewTab);

    expect(global.window.open).toHaveBeenCalled();
  });

  test('calls logout when logout button is clicked', () => {
    customRender(<SettingsScreen />);

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
  });
});
