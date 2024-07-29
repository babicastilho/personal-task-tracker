// app/protected/page.tsx
import { useAuth, SignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

function ProtectedPage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  // Redirect to SignIn if not authenticated
  if (!isSignedIn) {
    router.push('/sign-in');
    return null;
  }

  return <div>Protected Content</div>;
}

export default ProtectedPage;
