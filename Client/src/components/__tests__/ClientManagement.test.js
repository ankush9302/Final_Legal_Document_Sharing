import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import ClientManagement from '../ClientManagement';

// Mock API server
const server = setupServer(
  rest.get('http://localhost:5000/api/document-links', (req, res, ctx) => {
    return res(
      ctx.json([
        {
          'CUSTOMER NAME': 'John Doe',
          'MOBILE NUMBER': '1234567890',
          'EMAIL ID': 'john@example.com',
          'CUSTOMER ID': 'CUST001'
        }
      ])
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('ClientManagement Component', () => {
  it('renders client data correctly', async () => {
    render(<ClientManagement />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    expect(screen.getByText('1234567890')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('handles search functionality', async () => {
    render(<ClientManagement />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Get search input
    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'John' } });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
  });
});