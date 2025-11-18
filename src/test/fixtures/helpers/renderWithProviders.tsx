import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ReactElement } from 'react';

export function renderWithRouter(ui: ReactElement, options?: RenderOptions) {
  return render(<BrowserRouter>{ui}</BrowserRouter>, options);
}

export function renderComponent(ui: ReactElement, options?: RenderOptions) {
  return render(ui, options);
}
