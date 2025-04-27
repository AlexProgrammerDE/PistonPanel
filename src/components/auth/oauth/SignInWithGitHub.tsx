import { useAuthActions } from '@convex-dev/auth/react';
import { Button } from '@/components/ui/button';
import { SiGithub } from '@icons-pack/react-simple-icons';

export function SignInWithGitHub() {
  const { signIn } = useAuthActions();
  return (
    <Button
      className="flex-1"
      variant="outline"
      type="button"
      onClick={() => void signIn('github')}
    >
      <SiGithub /> GitHub
    </Button>
  );
}
