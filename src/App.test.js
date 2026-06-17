import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the chess board heading', () => {
  render(<App />);
  expect(screen.getByText(/CHESS/i)).toBeInTheDocument();
});
