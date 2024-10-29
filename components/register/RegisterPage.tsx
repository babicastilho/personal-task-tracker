/**
 * RegisterPage.tsx
 * 
 * Page component that renders the registration form for new users.
 * 
 * This page contains only the `RegisterForm` component, responsible for handling 
 * user input, validations, and submission for creating a new account.
 * 
 * @component
 * 
 * @returns The `RegisterForm` component wrapped in the `RegisterPage` layout.
 */

import RegisterForm from '@/components/register/RegisterForm';

const RegisterPage = () => {
  return <RegisterForm />
};

export default RegisterPage;
