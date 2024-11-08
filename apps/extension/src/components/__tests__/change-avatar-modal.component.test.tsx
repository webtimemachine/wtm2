import { render, screen, fireEvent } from '@testing-library/react';
import ChangeAvatarModal from '../change-avatar-modal.component';
import { useChangeUserAvatar } from '../../hooks/use-change-user-profile-avatar.hook';

jest.mock('../../hooks/use-change-user-profile-avatar.hook', () => ({
  useChangeUserAvatar: jest.fn(),
}));

jest.mock('react-images-selector', () => ({
  ReactImageSelector: () => <div></div>,
}));

describe('ChangeAvatarModal', () => {
  const mockChangeUserAvatarMutation = {
    mutate: jest.fn(),
  };

  beforeEach(() => {
    (useChangeUserAvatar as jest.Mock).mockReturnValue({
      changeUserAvatarMutation: mockChangeUserAvatarMutation,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('open the modal on button click', () => {
    render(<ChangeAvatarModal />);
    fireEvent.click(screen.getByText(/Change Avatar/i));
    expect(screen.getByText(/Change your Avatar/i)).toBeInTheDocument();
  });

  test('shows a help message if an avatar is not selected', () => {
    render(<ChangeAvatarModal />);
    fireEvent.click(screen.getByText(/Change Avatar/i));
    expect(screen.getByText(/Please, select one avatar./i)).toBeInTheDocument();
  });
});
