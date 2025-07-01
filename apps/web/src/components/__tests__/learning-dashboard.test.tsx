import { render, screen } from '@testing-library/react';
import React, { act } from 'react';

import { LearningDashboard } from '../learning-dashboard';

// Mock child components to isolate the dashboard
jest.mock('@/components/enhanced/GlassComponents', () => ({
  GlassCard: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="glass-card">{children}</div>
  ),
  GlassNavigation: ({ children }: { children: React.ReactNode }) => <nav>{children}</nav>,
}));

jest.mock('@/lib/theme', () => ({
  useCognitiveTheme: () => ({
    getLearningStateColor: jest.fn().mockReturnValue('bg-gray-200'),
  }),
}));

jest.mock('../layout', () => ({
  Footer: () => <footer>Footer</footer>,
  HeaderNav: () => <header>Header</header>,
  PageContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('../learning/LearningKanban', () => ({
  LearningKanban: () => <div data-testid="kanban-board">Kanban Board</div>,
}));

describe('LearningDashboard', () => {
  it('renders the main dashboard overview by default', () => {
    render(<LearningDashboard />);

    // Check for key static elements
    expect(screen.getByText('Overall Progress')).toBeInTheDocument();

    // Check for quick actions
    expect(screen.getByText('Continue Learning')).toBeInTheDocument();
    expect(screen.getByText('Practice Coding')).toBeInTheDocument();
    expect(screen.getByText('Review Concepts')).toBeInTheDocument();

    // Check for stats display (numbers may be split, so use a function matcher)
    expect(
      screen.getByText((content, node) => node?.textContent?.replace(/\s/g, '') === '12/47'),
    ).toBeInTheDocument();
  });

  it('switches to the kanban view when the corresponding action is clicked', async () => {
    render(<LearningDashboard />);
    await act(async () => {
      screen.getByText('Continue Learning').click();
    });
    expect(await screen.findByTestId('kanban-board')).toBeInTheDocument();
  });
});
