import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PageLoader } from './PageLoader';

describe('PageLoader', () => {
  it('announces and displays the default loading label', () => {
    render(<PageLoader />);

    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(status).toHaveClass('page-loader-overlay');
    expect(screen.getByRole('img', { name: 'Loading application...' })).toHaveAttribute('width', '40');
    expect(screen.getByText('Loading application...')).toHaveClass('page-loader-text');
  });

  it('forwards a custom label and class without replacing the existing theme classes', () => {
    render(<PageLoader label="Loading invoices" className="invoice-loader" />);

    expect(screen.getByRole('status')).toHaveClass('page-loader-overlay', 'invoice-loader');
    expect(screen.getByRole('img', { name: 'Loading invoices' })).toBeInTheDocument();
    expect(screen.getByText('Loading invoices')).toHaveClass('page-loader-text');
  });

  it('keeps the spinner label when visible text is hidden', () => {
    render(<PageLoader label="Checking payment" showText={false} />);

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByRole('img', { name: 'Checking payment' })).toBeInTheDocument();
    expect(screen.queryByText('Checking payment')).not.toBeInTheDocument();
  });

  it('updates the label, visible text, and class when props change', () => {
    const { rerender } = render(<PageLoader label="First step" showText={false} className="first" />);

    rerender(<PageLoader label="Second step" showText className="second" />);

    expect(screen.getByRole('status')).toHaveClass('page-loader-overlay', 'second');
    expect(screen.getByRole('status')).not.toHaveClass('first');
    expect(screen.getByRole('img', { name: 'Second step' })).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: 'First step' })).not.toBeInTheDocument();
    expect(screen.getByText('Second step')).toBeInTheDocument();

    rerender(<PageLoader label="Final step" showText={false} />);

    expect(screen.getByRole('status')).not.toHaveClass('second');
    expect(screen.getByRole('img', { name: 'Final step' })).toBeInTheDocument();
    expect(screen.queryByText('Second step')).not.toBeInTheDocument();
    expect(screen.queryByText('Final step')).not.toBeInTheDocument();
  });

  it('renders an empty label without inventing visible text', () => {
    render(<PageLoader label="" />);

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', '');
    expect(screen.queryByText('Loading application...')).not.toBeInTheDocument();
  });

  it('renders an untrusted label as text rather than HTML', () => {
    const label = '<img src=x onerror=alert(1)>';
    const { container } = render(<PageLoader label={label} />);

    expect(screen.getByText(label)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: label })).toBeInTheDocument();
    expect(container.querySelector('img')).toBeNull();
  });
});
