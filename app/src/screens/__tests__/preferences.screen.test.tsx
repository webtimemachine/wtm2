import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { useNavigation } from '../../store';
import { useGetPreferences, useUpdatePreferences } from '../../hooks';
import { PreferencesScreen } from '../preferences.screen';

// Mock de useNavigation, useGetPreferences y useUpdatePreferences
jest.mock('../../store', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('../../hooks', () => ({
  useGetPreferences: jest.fn(),
  useUpdatePreferences: jest.fn(),
}));

const mockNavigateBack = jest.fn();
const mockNavigateTo = jest.fn();
const mockMutate = jest.fn();

(useNavigation as jest.Mock).mockReturnValue({
  navigateBack: mockNavigateBack,
  navigateTo: mockNavigateTo,
});

(useGetPreferences as jest.Mock).mockReturnValue({
  userPreferencesQuery: {
    data: {
      enableNavigationEntryExpiration: true,
      navigationEntryExpirationInDays: 30,
      enableImageEncoding: true,
      enableExplicitContentFilter: true,
    },
  },
});

(useUpdatePreferences as jest.Mock).mockReturnValue({
  updatePreferencesMutation: {
    mutate: mockMutate,
  },
});

const customRender = (ui: React.ReactElement) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

// Mock de chrome.storage
global.chrome = {
  storage: {
    local: {
      get: jest.fn().mockImplementation(() => {
        return { enabledLiteMode: false };
      }),
      set: jest.fn(),
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

describe('PreferencesScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the component with initial state', async () => {
    customRender(<PreferencesScreen />);

    expect(screen.getByText('Preferences')).toBeInTheDocument();
    expect(screen.getByText('AI Search on Images')).toBeInTheDocument();
    expect(screen.getByText('Explicit Filter')).toBeInTheDocument();
    expect(screen.getByText('Lite Mode')).toBeInTheDocument();
    expect(screen.getByText('History Entries Expiration')).toBeInTheDocument();
  });

  test('calls navigateBack when back button is clicked', () => {
    customRender(<PreferencesScreen />);

    const backButton = screen.getByLabelText('Back icon');
    fireEvent.click(backButton);

    expect(mockNavigateBack).toHaveBeenCalled();
  });

  test('handles enabling and disabling preferences correctly', async () => {
    customRender(<PreferencesScreen />);

    const aiSearchSwitch = screen.getByRole('checkbox', {
      name: 'AI Search on Images',
    });
    fireEvent.click(aiSearchSwitch);
    expect(aiSearchSwitch).not.toBeChecked();

    const explicitFilterSwitch = screen.getByRole('checkbox', {
      name: 'Explicit Filter',
    });
    fireEvent.click(explicitFilterSwitch);
    expect(explicitFilterSwitch).not.toBeChecked();

    const liteModeSwitch = screen.getByRole('checkbox', { name: 'Lite Mode' });
    fireEvent.click(liteModeSwitch);
    await waitFor(() => {
      expect(liteModeSwitch).not.toBeChecked();
    });

    const historySwitch = screen.getByRole('checkbox', {
      name: 'History Entries Expiration',
    });
    fireEvent.click(historySwitch);
    expect(historySwitch).not.toBeChecked();

    await waitFor(() => {
      expect(
        screen.queryByRole('spinbutton', { name: '' }),
      ).not.toBeInTheDocument();
    });
  });

  test('displays input for days when history expiration is enabled', async () => {
    customRender(<PreferencesScreen />);

    const historySwitch = screen.getByRole('checkbox', {
      name: 'History Entries Expiration',
    });
    fireEvent.click(historySwitch);
    fireEvent.click(historySwitch); // Enable it again

    await waitFor(() => {
      expect(screen.getByRole('spinbutton', { name: '' })).toBeInTheDocument();
    });

    const daysInput = screen.getByRole('spinbutton', { name: '' });
    fireEvent.change(daysInput, { target: { value: '20' } });
    expect(daysInput).toHaveValue(20);
  });

  test('calls updatePreferencesMutation and sets lite mode in local storage when save button is clicked', async () => {
    customRender(<PreferencesScreen />);

    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        enableNavigationEntryExpiration: true,
        navigationEntryExpirationInDays: 30,
        enableImageEncoding: true,
        enableExplicitContentFilter: true,
      });
    });

    await waitFor(() => {
      expect(chrome.storage.local.set).toHaveBeenCalledWith({
        enabledLiteMode: false,
      });
    });
  });
});
