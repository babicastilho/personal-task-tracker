import { render, screen, fireEvent } from '@testing-library/react';
import RootLayout from '@/app/layout';

interface HeaderProps {
  toggleTheme: () => void;
  theme: string;
}

// Mock the Header component
jest.mock('@/components/Header', () => {
  const Header = ({ toggleTheme, theme }: HeaderProps) => (
    <div>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <div>Header Component - Current Theme: {theme}</div>
    </div>
  );
  return Header;
});

jest.mock('@/components/Footer', () => {
  const Footer = () => <div>Footer Component</div>;
  return Footer;
});

describe('RootLayout', () => {
  it('renders children components', () => {
    render(
      <RootLayout>
        <div>Test Child Component</div>
      </RootLayout>
    );
    expect(screen.getByText('Test Child Component')).toBeInTheDocument();
    expect(screen.getByText('Footer Component')).toBeInTheDocument();
  });

  it('toggles theme between light and dark', () => {
    render(
      <RootLayout>
        <div>Test Child Component</div>
      </RootLayout>
    );
    const toggleButton = screen.getByText('Toggle Theme');
    fireEvent.click(toggleButton);
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    fireEvent.click(toggleButton);
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
  });
});
