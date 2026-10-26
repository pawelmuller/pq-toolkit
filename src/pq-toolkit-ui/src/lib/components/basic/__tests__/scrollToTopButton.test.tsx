import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ScrollToTopButton from '../scrollToTopButton';

describe('ScrollToTopButton', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
  });

  test('should not be visible on initial render', () => {
    render(<ScrollToTopButton />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('should become visible when scrolled down', () => {
    render(<ScrollToTopButton />);

    Object.defineProperty(window, 'scrollY', { value: 400 });
    fireEvent.scroll(window);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('should not be visible when scrolled back up', () => {
    render(<ScrollToTopButton />);

    Object.defineProperty(window, 'scrollY', { value: 400 });
    fireEvent.scroll(window);
    expect(screen.getByRole('button')).toBeInTheDocument();

    Object.defineProperty(window, 'scrollY', { value: 100 });
    fireEvent.scroll(window);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('should scroll to top when button is clicked', () => {
    render(<ScrollToTopButton />);

    Object.defineProperty(window, 'scrollY', { value: 400 });
    fireEvent.scroll(window);
    expect(screen.getByRole('button')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button'));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
