import { useAuthActions } from '@convex-dev/auth/react';
import { Button } from '@/components/ui/button';
import { SiGoogle } from '@icons-pack/react-simple-icons';

export function SignInWithGoogle() {
  const { signIn } = useAuthActions();
  return (
    <Button
      className="flex-1"
      variant="outline"
      type="button"
      onClick={() => void signIn('google')}
    >
      <SiGoogle className="mr-2 h-4 w-4" /> Google
    </Button>
  );
}
