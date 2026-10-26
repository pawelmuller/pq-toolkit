import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeSwitch from '../themeSwitch';
import { ThemeProvider, useTheme } from 'next-themes';
import { type RenderResult } from '@testing-library/react';

jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  )
}));

describe('ThemeSwitch', () => {
  const mockSetTheme = jest.fn();
  const mockUseTheme = useTheme as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTheme.mockReturnValue({
      setTheme: mockSetTheme,
      resolvedTheme: 'light'
    });
  });

  const renderWithThemeProvider = (ui: React.ReactElement): RenderResult => {
    return render(<ThemeProvider attribute="class">{ui}</ThemeProvider>);
  };

  test('should render cog icon initially', () => {
    renderWithThemeProvider(<ThemeSwitch />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(screen.getByLabelText('cog-icon')).toBeInTheDocument();
  });

  test('should render sun and moon icons on hover', () => {
    renderWithThemeProvider(<ThemeSwitch />);

    const button = screen.getByRole('button');
    fireEvent.mouseEnter(button);

    expect(screen.getByLabelText('sun-icon')).toBeInTheDocument();
    expect(screen.getByLabelText('moon-icon')).toBeInTheDocument();
  });

  test('should call setTheme with dark when light theme is active', () => {
    renderWithThemeProvider(<ThemeSwitch />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  test('should call setTheme with light when dark theme is active', () => {
    mockUseTheme.mockReturnValue({
      setTheme: mockSetTheme,
      resolvedTheme: 'dark'
    });

    renderWithThemeProvider(<ThemeSwitch />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });
});
