import { render, screen, fireEvent } from '@testing-library/react';
import {
  useChangeUserDisplayName,
  useGetBasicUserInformation,
} from '../../hooks';
import ChangeDisplayNameModal from '../change-display-name-modal.component';

jest.mock('../../hooks', () => ({
  useChangeUserDisplayName: jest.fn(),
  useGetBasicUserInformation: jest.fn(),
}));

describe('ChangeDisplayNameModal', () => {
  const mockBasicUserInformationQuery = {
    data: { displayname: 'ActualDisplayName' },
    isLoading: false,
    isError: false,
  };
  const mockChangeUserDisplayNameMutation = {
    mutate: jest.fn(),
  };

  (useGetBasicUserInformation as jest.Mock).mockReturnValue({
    basicUserInformationQuery: mockBasicUserInformationQuery,
  });
  (useChangeUserDisplayName as jest.Mock).mockReturnValue({
    changeUserDisplayNameMutation: mockChangeUserDisplayNameMutation,
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('open the modal on button click', () => {
    render(<ChangeDisplayNameModal />);
    fireEvent.click(screen.getByText(/Change display name/i));
    expect(screen.getByText(/Change the displayname/i)).toBeInTheDocument();
  });

  test('shows an error message when the new name is the same as the current one', () => {
    render(<ChangeDisplayNameModal />);
    fireEvent.click(screen.getByText(/Change display name/i));

    const input = screen.getByLabelText(/New Displayname/i);
    fireEvent.change(input, { target: { value: 'ActualDisplayName' } });

    expect(
      screen.getByText(/Displayname must be different to actual displayname/i),
    ).toBeInTheDocument();
  });

  test('enables the toggle button when a name other than the current one is entered', () => {
    render(<ChangeDisplayNameModal />);
    fireEvent.click(screen.getByText(/Change display name/i));

    const input = screen.getByLabelText(/New Displayname/i);
    fireEvent.change(input, { target: { value: 'NewDisplayName' } });

    expect(screen.getByRole('button', { name: /Change/i })).toBeEnabled();
  });
});
