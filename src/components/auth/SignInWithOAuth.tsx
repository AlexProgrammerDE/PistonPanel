import { SignInWithApple } from '@/components/auth/oauth/SignInWithApple';
import { SignInWithGitHub } from '@/components/auth/oauth/SignInWithGitHub';
import { SignInWithGoogle } from '@/components/auth/oauth/SignInWithGoogle';

export function SignInWithOAuth() {
  return (
    <div className="flex w-full flex-col items-stretch gap-2 min-[460px]:flex-row">
      <SignInWithGitHub />
      <SignInWithGoogle />
      <SignInWithApple />
    </div>
  );
}
