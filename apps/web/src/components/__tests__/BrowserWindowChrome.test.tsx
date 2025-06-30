/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';
import { BrowserWindowChrome } from '../BrowserWindowChrome';

describe('BrowserWindowChrome', () => {
  const mockOnMinimize = jest.fn();
  const mockOnMaximize = jest.fn();
  const mockOnClose = jest.fn();
  const mockOnRefresh = jest.fn();
  const mockOnNavigate = jest.fn();

  const defaultProps = {
    title: 'brAInwav - AI Engineering Roadmap',
    currentUrl: 'http://localhost:3000',
    onMinimize: mockOnMinimize,
    onMaximize: mockOnMaximize,
    onClose: mockOnClose,
    onRefresh: mockOnRefresh,
    onNavigate: mockOnNavigate,
    isMaximized: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders window controls correctly', () => {
    render(<BrowserWindowChrome {...defaultProps} />);

    expect(screen.getByLabelText('Close window')).toBeInTheDocument();
    expect(screen.getByLabelText('Minimize window')).toBeInTheDocument();
    expect(screen.getByLabelText('Maximize window')).toBeInTheDocument();
  });

  it('displays the current URL in the address bar', () => {
    render(<BrowserWindowChrome {...defaultProps} />);

    const urlInput = screen.getByDisplayValue('http://localhost:3000');
    expect(urlInput).toBeInTheDocument();
  });

  it('calls onMinimize when minimize button is clicked', () => {
    render(<BrowserWindowChrome {...defaultProps} />);

    fireEvent.click(screen.getByLabelText('Minimize window'));
    expect(mockOnMinimize).toHaveBeenCalledTimes(1);
  });

  it('calls onMaximize when maximize button is clicked', () => {
    render(<BrowserWindowChrome {...defaultProps} />);

    fireEvent.click(screen.getByLabelText('Maximize window'));
    expect(mockOnMaximize).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when close button is clicked', () => {
    render(<BrowserWindowChrome {...defaultProps} />);

    fireEvent.click(screen.getByLabelText('Close window'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onRefresh when refresh button is clicked', () => {
    render(<BrowserWindowChrome {...defaultProps} />);

    fireEvent.click(screen.getByLabelText('Refresh page'));
    expect(mockOnRefresh).toHaveBeenCalledTimes(1);
  });

  it('calls onNavigate when Enter is pressed in URL bar', () => {
    render(<BrowserWindowChrome {...defaultProps} />);

    const urlInput = screen.getByDisplayValue('http://localhost:3000');
    fireEvent.change(urlInput, { target: { value: 'http://localhost:3000/new-path' } });
    fireEvent.keyDown(urlInput, { key: 'Enter', code: 'Enter' });

    expect(mockOnNavigate).toHaveBeenCalledWith('http://localhost:3000/new-path');
  });

  it('shows restore button when window is maximized', () => {
    render(<BrowserWindowChrome {...defaultProps} isMaximized={true} />);

    expect(screen.getByLabelText('Restore window')).toBeInTheDocument();
  });

  it('applies macOS window control styling', () => {
    render(<BrowserWindowChrome {...defaultProps} />);

    const closeButton = screen.getByLabelText('Close window');
    const minimizeButton = screen.getByLabelText('Minimize window');
    const maximizeButton = screen.getByLabelText('Maximize window');

    expect(closeButton).toHaveClass('bg-red-500');
    expect(minimizeButton).toHaveClass('bg-yellow-500');
    expect(maximizeButton).toHaveClass('bg-green-500');
  });

  it('meets accessibility requirements', () => {
    render(<BrowserWindowChrome {...defaultProps} />);

    // Check ARIA labels
    expect(screen.getByLabelText('Browser window controls')).toBeInTheDocument();
    expect(screen.getByLabelText('Address bar')).toBeInTheDocument();

    // Check keyboard navigation
    const urlInput = screen.getByDisplayValue('http://localhost:3000');
    expect(urlInput).not.toHaveAttribute('tabIndex', '-1');
  });

  it('handles device size changes', () => {
    const mockOnDeviceChange = jest.fn();
    render(
      <BrowserWindowChrome
        {...defaultProps}
        onDeviceChange={mockOnDeviceChange}
        activeDevice="desktop"
      />
    );

    const tabletButton = screen.getByLabelText('Switch to Tablet view');
    fireEvent.click(tabletButton);

    expect(mockOnDeviceChange).toHaveBeenCalledWith('tablet');
  });

  it('handles navigation controls', () => {
    const mockOnBack = jest.fn();
    const mockOnForward = jest.fn();
    const mockOnHome = jest.fn();

    render(
      <BrowserWindowChrome
        {...defaultProps}
        onBack={mockOnBack}
        onForward={mockOnForward}
        onHome={mockOnHome}
      />
    );

    fireEvent.click(screen.getByLabelText('Go back'));
    expect(mockOnBack).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByLabelText('Go forward'));
    expect(mockOnForward).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByLabelText('Go home'));
    expect(mockOnHome).toHaveBeenCalledTimes(1);
  });

  it('shows security indicator for secure URLs', () => {
    render(<BrowserWindowChrome {...defaultProps} currentUrl="https://secure-site.com" />);

    expect(screen.getByText('Secure')).toBeInTheDocument();
  });

  it('shows security indicator for non-secure URLs', () => {
    render(<BrowserWindowChrome {...defaultProps} currentUrl="http://insecure-site.com" />);

    expect(screen.getByText('Not secure')).toBeInTheDocument();
  });

  it('handles copy URL functionality', async () => {
    // Mock the clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });

    render(<BrowserWindowChrome {...defaultProps} />);

    const copyButton = screen.getByLabelText('Copy URL');
    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('http://localhost:3000');
  });
});
