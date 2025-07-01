import { render, screen, waitFor } from '@testing-library/react';

import { OllamaStatusCard } from '../ollama-status-card';

describe('OllamaStatusCard integration', () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ status: 'synced', activeModel: 'mistral:latest', progress: {} }),
      }),
    );
  });

  it('fetches sync status on mount', async () => {
    render(<OllamaStatusCard />);
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/ollama/sync', {
      method: 'POST',
    });
    await waitFor(() => expect(screen.getByText('Synced')).toBeInTheDocument());
    expect(screen.getByText('mistral:latest')).toBeInTheDocument();
  });
});
