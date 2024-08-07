import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { useNavigation } from '../../store';
import { useDeleteNavigationEntry, useNavigationEntries } from '../../hooks';
import { CompleteNavigationEntryDto } from 'wtm-lib/interfaces';
import { NavigationEntriesScreen } from '../navigation-entries.screen';

// Mock de useNavigation, useDeleteNavigationEntry y useNavigationEntries
jest.mock('../../store', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('../../hooks', () => ({
  useDeleteNavigationEntry: jest.fn(),
  useNavigationEntries: jest.fn(),
}));

const mockNavigateTo = jest.fn();
const mockMutate = jest.fn();
const mockRefetch = jest.fn();

(useNavigation as jest.Mock).mockReturnValue({
  navigateTo: mockNavigateTo,
});

(useDeleteNavigationEntry as jest.Mock).mockReturnValue({
  deleteNavigationEntryMutation: {
    mutate: mockMutate,
    isSuccess: false,
  },
});

global.chrome = {
  action: {
    setIcon: jest.fn(),
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

const mockNavigationEntries: CompleteNavigationEntryDto[] = [
  {
    id: 1,
    title: 'Test Entry 1',
    url: 'http://example.com/1',
    navigationDate: new Date(),
    liteMode: 'false',
    relevantSegment: 'Relevant Segment 1',
    userId: 1,
    userDeviceId: 1,
    userDevice: {
      id: 1,
      userId: 1,
      deviceId: 1,
      isCurrentDevice: true,
      deviceAlias: 'DeviceTest',
      device: {
        id: 1,
        deviceKey: 'firefox',
      },
    },
  },
  {
    id: 2,
    title: 'Test Entry 2',
    url: 'http://example.com/2',
    navigationDate: new Date(),
    liteMode: 'true',
    relevantSegment: 'Relevant Segment 2',
    userId: 1,
    userDeviceId: 1,
    userDevice: {
      id: 1,
      userId: 1,
      deviceId: 1,
      isCurrentDevice: true,
      deviceAlias: 'DeviceTest',
      device: {
        id: 1,
        deviceKey: 'firefox',
      },
    },
  },
];

(useNavigationEntries as jest.Mock).mockReturnValue({
  navigationEntriesQuery: {
    data: {
      items: mockNavigationEntries,
      count: 2,
    },
    refetch: mockRefetch,
    isLoading: false,
  },
});

const customRender = (ui: React.ReactElement) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

describe('NavigationEntriesScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the component with initial state', () => {
    customRender(<NavigationEntriesScreen />);

    expect(screen.getByText('WebTM')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    expect(screen.getByText('AI Search')).toBeInTheDocument();
    expect(screen.getAllByText(/Test Entry/i)).toHaveLength(2);
  });

  test('calls navigateTo settings when settings icon is clicked', () => {
    customRender(<NavigationEntriesScreen />);

    const settingsButton = screen.getByLabelText('Back icon');
    fireEvent.click(settingsButton);

    expect(mockNavigateTo).toHaveBeenCalledWith('settings');
  });

  test('search functionality updates the query and refetches data', async () => {
    customRender(<NavigationEntriesScreen />);

    const searchInput = screen.getByPlaceholderText('Search');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    await waitFor(() => {
      expect(searchInput).toHaveValue('test');
    });

    fireEvent.keyUp(searchInput, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  test('enables and disables semantic search', () => {
    customRender(<NavigationEntriesScreen />);
    const onClickListener = screen.getByTestId('ia-search-container');
    const semanticSwitch = screen.getByRole('checkbox', { name: 'AI Search' });
    fireEvent.click(onClickListener);

    expect(semanticSwitch).not.toBeChecked();

    fireEvent.click(onClickListener);

    expect(semanticSwitch).toBeChecked();
  });

  test('deletes a navigation entry', async () => {
    customRender(<NavigationEntriesScreen />);

    const deleteButtons = screen.getAllByLabelText('delete navigation entry');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({ id: 1 });
    });
  });

  test('pagination works correctly', async () => {
    customRender(<NavigationEntriesScreen />);

    const nextButton = screen.getByLabelText('right');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(mockRefetch).toHaveBeenCalled();
    });

    const prevButton = screen.getByLabelText('left');
    fireEvent.click(prevButton);

    await waitFor(() => {
      expect(mockRefetch).toHaveBeenCalled();
    });
  });
});
