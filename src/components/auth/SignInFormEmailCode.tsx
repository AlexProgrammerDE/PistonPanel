import { CodeInput } from '@/components/auth/CodeInput';
import { SignInMethodDivider } from '@/components/auth/SignInMethodDivider';
import { SignInWithEmailCode } from '@/components/auth/SignInWithEmailCode';
import { SignInWithOAuth } from '@/components/auth/SignInWithOAuth';
import { Button } from '@/components/ui/button';
import { useAuthActions } from '@convex-dev/auth/react';
import { useState } from 'react';
import { toast } from 'sonner';

export function SignInFormEmailCode() {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<'signIn' | { email: string }>('signIn');
  const [submitting, setSubmitting] = useState(false);
  return (
    <div className="mx-auto flex max-w-[384px] flex-col gap-4">
      {step === 'signIn' ? (
        <>
          <h2 className="text-2xl font-semibold tracking-tight">
            Sign in or create an account
          </h2>
          <SignInWithOAuth />
          <SignInMethodDivider />
          <SignInWithEmailCode handleCodeSent={(email) => setStep({ email })} />
        </>
      ) : (
        <>
          <h2 className="text-2xl font-semibold tracking-tight">
            Check your email
          </h2>
          <p className="text-muted-foreground text-sm">
            Enter the 8-digit code we sent to your email address.
          </p>
          <form
            className="flex flex-col"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitting(true);
              const formData = new FormData(event.currentTarget);
              signIn('resend-otp', formData).catch(() => {
                toast.error('Code could not be verified, try again');
                setSubmitting(false);
              });
            }}
          >
            <label htmlFor="code">Code</label>
            <CodeInput />
            <input name="email" value={step.email} type="hidden" />
            <Button type="submit" disabled={submitting}>
              Continue
            </Button>
            <Button
              type="button"
              variant="link"
              onClick={() => setStep('signIn')}
            >
              Cancel
            </Button>
          </form>
        </>
      )}
    </div>
  );
}
