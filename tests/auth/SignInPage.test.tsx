// __tests__/auth/SignInPage.test.tsx
import { render, screen } from '@testing-library/react';
import SignInPage from '../../app/sign-in/page'; // Ajuste o caminho conforme necessário
import { SignIn } from '@clerk/nextjs';

jest.mock('@clerk/nextjs', () => ({
  SignIn: jest.fn(() => <div>Sign In Component</div>),
}));

describe('SignInPage', () => {
  it('should render the SignIn component', () => {
    render(<SignInPage />);
    
    // Expect that the SignIn component is rendered
    expect(screen.getByText('Sign In Component')).toBeInTheDocument();
  });
});
