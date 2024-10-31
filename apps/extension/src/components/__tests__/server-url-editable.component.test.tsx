import React from 'react';
import {
  render,
  screen,
  RenderOptions,
  fireEvent,
} from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { ServerUrlEditable } from '../server-url-editable.component';

const mockSetServerUrl = jest.fn();
jest.mock('clsx');

jest.mock('../../hooks', () => ({
  useServerUrl: jest.fn(() => ({
    serverUrl: 'http://example.com',
    setServerUrl: mockSetServerUrl,
  })),
}));

const customRender = (
  ui: React.ReactNode,
  { ...renderOptions }: RenderOptions,
) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>, renderOptions);
};

describe('ServerUrlEditable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the component with the default value', () => {
    customRender(<ServerUrlEditable />, {});

    expect(screen.getByText('http://example.com')).toBeInTheDocument();
  });

  test('allows editing and saving a valid URL', () => {
    customRender(<ServerUrlEditable />, {});

    fireEvent.click(screen.getByLabelText('Edit'));

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'http://newexample.com' } });

    fireEvent.click(screen.getByLabelText('Save'));

    expect(mockSetServerUrl).toHaveBeenCalledWith('http://newexample.com');
    expect(screen.getByText('http://newexample.com')).toBeInTheDocument();
  });

  test('shows an error toast when submitting an invalid URL', () => {
    customRender(<ServerUrlEditable />, {});

    fireEvent.click(screen.getByLabelText('Edit'));

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'invalid-url' } });

    fireEvent.click(screen.getByLabelText('Save'));

    expect(mockSetServerUrl).not.toHaveBeenCalled();
    expect(screen.getByText('http://example.com')).toBeInTheDocument();
  });

  test('allows canceling the edit', () => {
    customRender(<ServerUrlEditable />, {});

    fireEvent.click(screen.getByLabelText('Edit'));

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'http://newexample.com' } });

    fireEvent.click(screen.getByLabelText('Cancel'));

    expect(mockSetServerUrl).not.toHaveBeenCalled();
    expect(screen.getByText('http://example.com')).toBeInTheDocument();
  });
});
