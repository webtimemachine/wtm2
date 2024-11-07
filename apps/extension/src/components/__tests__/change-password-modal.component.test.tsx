import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import ChangePasswordModal from '../change-password-modal.component';

const mockChangeUserPasswordMutation = jest.fn();

jest.mock('../../hooks', () => ({
  useChangeUserPassword: jest.fn(() => ({
    changeUserPasswordMutation: { mutate: mockChangeUserPasswordMutation },
  })),
  useHandleSessionExpired: jest.fn(() => ({
    handleSessionExpired: jest.fn(),
  })),
}));

jest.mock('@tanstack/react-query', () => ({
  useQueryClient: jest.fn(() => ({
    queryClient: { invalidateQueries: jest.fn() },
  })),
  useMutation: jest.fn(),
}));

const renderWithChakra = (ui: JSX.Element) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

jest.mock('@wtm/api', () => {
  const mockApiClientInstance = {
    setHandleSessionExpired: jest.fn(),
    changeUserPassword: jest.fn(),
  };

  return {
    ApiClient: jest.fn().mockImplementation(() => mockApiClientInstance),
  };
});

describe('ChangePasswordModal', () => {
  beforeEach(() => {
    mockChangeUserPasswordMutation.mockClear();
  });

  it('renders change password button and opens modal on click', () => {
    renderWithChakra(<ChangePasswordModal />);
    const openButton = screen.getByText(/change password/i);
    expect(openButton).toBeInTheDocument();

    fireEvent.click(openButton);
    expect(screen.getByText(/change the password/i)).toBeInTheDocument();
  });

  it('shows error when new passwords do not match', async () => {
    renderWithChakra(<ChangePasswordModal />);
    fireEvent.click(screen.getByText(/change password/i));

    const oldPasswordInput = screen.getByTestId('old-password-field');
    const newPasswordInput = screen.getByTestId('new-password-field');
    const reNewPasswordInput = screen.getByTestId('confirm-password-field');

    fireEvent.change(oldPasswordInput, {
      target: { value: 'OldPassword123!' },
    });
    fireEvent.change(newPasswordInput, { target: { value: 'Password123!' } });
    fireEvent.change(reNewPasswordInput, { target: { value: 'Password456!' } });

    await waitFor(() =>
      expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument(),
    );
  });

  it('enables submit button when passwords match and fields are valid', () => {
    renderWithChakra(<ChangePasswordModal />);
    fireEvent.click(screen.getByText(/change password/i));

    fireEvent.change(screen.getByLabelText(/old password/i), {
      target: { value: 'oldPassword123' },
    });
    fireEvent.change(screen.getByLabelText(/new password/i), {
      target: { value: 'newPassword123' },
    });
    fireEvent.change(screen.getByLabelText(/re-enter new password/i), {
      target: { value: 'newPassword123' },
    });

    const submitButton = screen.getByRole('button', { name: /change/i });
    expect(submitButton).not.toBeDisabled();
  });

  // it('calls changeUserPasswordMutation on submit when form is valid', async () => {
  //   renderWithChakra(<ChangePasswordModal />);
  //   fireEvent.click(screen.getByText(/change password/i));

  //   const oldPasswordInput = screen.getByTestId('old-password-field');
  //   const newPasswordInput = screen.getByTestId('new-password-field');
  //   const reNewPasswordInput = screen.getByTestId('confirm-password-field');

  //   fireEvent.change(oldPasswordInput, {
  //     target: { value: 'OldPassword123!' },
  //   });
  //   fireEvent.change(newPasswordInput, { target: { value: 'Pass123!' } });
  //   fireEvent.change(reNewPasswordInput, { target: { value: 'Pass123!' } });

  //   fireEvent.click(screen.getByTestId('change-button'));

  //   await waitFor(() =>
  //     expect(mockChangeUserPasswordMutation).toHaveBeenCalledWith({
  //       oldPassword: 'OldPassword123!',
  //       newPassword: 'Pass123!',
  //     }),
  //   );
  // });

  it('closes modal when close button is clicked', () => {
    renderWithChakra(<ChangePasswordModal />);
    fireEvent.click(screen.getByText(/change password/i));

    const closeButton = screen.getByTestId('close-modal-button');
    fireEvent.click(closeButton);

    expect(screen.queryByText(/change the password/i)).not.toBeVisible();
  });
});
