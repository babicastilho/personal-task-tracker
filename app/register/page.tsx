/**
 * RegisterPage.tsx
 * 
 * Page component for user registration.
 * 
 * Renders the registration form within a centered layout, allowing new users to create an account.
 * 
 * @returns A centered registration form for user sign-up.
 * 
 * Dependencies:
 * - `RegisterForm`: Component that handles user input and form submission for registration.
 */

import RegisterForm from '@/components/register/RegisterForm';

const RegisterPage = () => {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center'>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
