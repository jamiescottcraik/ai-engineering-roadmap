import { render, screen } from '@testing-library/react';

import { EveningOllamaAssistant } from '../evening-ollama-assistant';
import { OllamaStatusCard } from '../ollama-status-card';

jest.mock('../ollama-status-card', () => ({
  OllamaStatusCard: () => <div>status</div>,
}));

jest.mock('../evening-ollama-assistant', () => ({
  EveningOllamaAssistant: () => <div>assistant</div>,
}));

describe('Ollama components', () => {
  it('renders status card', () => {
    render(<OllamaStatusCard />);
    expect(screen.getByText('status')).toBeInTheDocument();
  });

  it('renders evening assistant', () => {
    render(<EveningOllamaAssistant />);
    expect(screen.getByText('assistant')).toBeInTheDocument();
  });
});
