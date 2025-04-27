import { CodeInput } from '@/components/auth/CodeInput';
import { SignInMethodDivider } from '@/components/auth/SignInMethodDivider';
import { SignInWithEmailCode } from '@/components/auth/SignInWithEmailCode';
import { SignInWithOAuth } from '@/components/auth/SignInWithOAuth';
import { Button } from '@/components/ui/button';
import { useAuthActions } from '@convex-dev/auth/react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function SignInFormEmailCode() {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<'signIn' | { email: string }>('signIn');
  const [submitting, setSubmitting] = useState(false);
  return (
    <Card className="mx-auto max-w-[384px]">
      {step === 'signIn' ? (
        <>
          <CardHeader>
            <CardTitle>Sign in to your account</CardTitle>
            <CardDescription>
              Choose a sign-in method to continue.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <SignInWithOAuth />
            <SignInMethodDivider />
            <SignInWithEmailCode
              handleCodeSent={(email) => setStep({ email })}
            />
          </CardContent>
        </>
      ) : (
        <>
          <CardHeader>
            <CardTitle>Check your email</CardTitle>
            <CardDescription>
              Enter the 8-digit code we sent to your email address.
            </CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </>
      )}
    </Card>
  );
}
