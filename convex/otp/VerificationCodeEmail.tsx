import {
  Container,
  Head,
  Heading,
  Html,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

export function VerificationCodeEmail({
  code,
  expires,
}: {
  code: string;
  expires: Date;
}) {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Container className="container px-20 font-sans">
          <Heading className="mb-4 text-xl font-bold">
            Sign in to {process.env.APP_NAME ?? 'PistonPanel'}
          </Heading>
          <Text className="text-sm">
            Please enter the following code on the sign in page.
          </Text>
          <Section className="text-center">
            <Text className="font-semibold">Verification code</Text>
            <Text className="text-4xl font-bold">{code}</Text>
            <Text>
              (This code is valid for{' '}
              {Math.floor((+expires - Date.now()) / (60 * 60 * 1000))} hours)
            </Text>
          </Section>
        </Container>
      </Tailwind>
    </Html>
  );
}
