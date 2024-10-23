import React, { ReactNode } from 'react';
import { render } from '@testing-library/react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface TestLayoutProps {
  children: ReactNode;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const TestLayout: React.FC<TestLayoutProps> = ({ children, theme, toggleTheme }) => (
  <>
    <Header toggleTheme={toggleTheme} theme={theme} />
    <main>{children}</main>
    <Footer />
  </>
);

describe('RootLayout', () => {
  it('renders children components', () => {
    const toggleTheme = jest.fn();
    const { getByText } = render(
      <TestLayout theme="light" toggleTheme={toggleTheme}>
        <div>Test Child Component</div>
      </TestLayout>
    );
    expect(getByText('Test Child Component')).toBeInTheDocument();
  });
});
