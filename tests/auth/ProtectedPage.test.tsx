// __tests__/auth/ProtectedPage.test.tsx
import { render, screen } from '@testing-library/react';
import { useAuth } from '@clerk/nextjs';
import ProtectedPage from '../../app/protected/page'; // Ajuste o caminho conforme necessário

jest.mock('@clerk/nextjs', () => ({
  useAuth: jest.fn(),
}));

describe('ProtectedPage', () => {
  it('should render protected content if user is signed in', () => {
    // Mock the useAuth hook to return that the user is signed in
    (useAuth as jest.Mock).mockReturnValue({ isSignedIn: true });

    render(<ProtectedPage />);

    // Expect that the protected content is rendered
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should not render protected content if user is not signed in', () => {
    // Mock the useAuth hook to return that the user is not signed in
    (useAuth as jest.Mock).mockReturnValue({ isSignedIn: false });

    render(<ProtectedPage />);

    // Expect that the protected content is not rendered
    expect(screen.queryByText('Protected Content')).toBeNull();
  });
});
