import { render, screen, fireEvent } from '@testing-library/react';
import {
  useChangeUserDisplayName,
  useGetBasicUserInformation,
} from '../../hooks';
import ChangeDisplayNameModal from '../change-display-name-modal.component';

// Mock de los hooks
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

  test('abre el modal al hacer clic en el botón', () => {
    render(<ChangeDisplayNameModal />);
    fireEvent.click(screen.getByText(/Change display name/i));
    expect(screen.getByText(/Change the displayname/i)).toBeInTheDocument();
  });

  test('muestra un mensaje de error cuando el nuevo nombre es igual al actual', () => {
    render(<ChangeDisplayNameModal />);
    fireEvent.click(screen.getByText(/Change display name/i));

    const input = screen.getByLabelText(/New Displayname/i);
    fireEvent.change(input, { target: { value: 'ActualDisplayName' } });

    expect(
      screen.getByText(/Displayname must be different to actual displayname/i),
    ).toBeInTheDocument();
  });

  test('habilita el botón de cambio cuando se ingresa un nombre diferente al actual', () => {
    render(<ChangeDisplayNameModal />);
    fireEvent.click(screen.getByText(/Change display name/i));

    const input = screen.getByLabelText(/New Displayname/i);
    fireEvent.change(input, { target: { value: 'NewDisplayName' } });

    expect(screen.getByRole('button', { name: /Change/i })).toBeEnabled();
  });
});
