import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCallback, useState } from 'react';
import {
  HeartHandshakeIcon,
  KeyRoundIcon,
  LoaderCircleIcon,
  LogInIcon,
  MailIcon,
  SatelliteDishIcon,
} from 'lucide-react';
import { getEnumKeyByValue } from '@/lib/types';
import { getLanguageName, languageEmoji } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Trans, useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { NextAuthFlowResponse_Failure_Reason } from '@/generated/pistonpanel/login';
import { LoginServiceClient } from '@/generated/pistonpanel/login.client';
import { createAddressOnlyTransport, setAuthentication } from '@/lib/web-rpc';
import { ExternalLink } from '@/components/external-link';

const LOCAL_STORAGE_FORM_SERVER_TOKEN_KEY = 'form-server-token';
const LOCAL_STORAGE_FORM_SERVER_EMAIL_KEY = 'form-server-email';

export const Route = createFileRoute('/')({
  component: Index,
});

const emailFormSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .max(255, 'Email is too long')
    .email('Email must be a valid'),
});
const tokenFormSchema = z.object({
  token: z
    .string()
    .min(1, 'Token is required')
    .max(255, 'Token is too long')
    .regex(
      /e[yw][A-Za-z0-9-_]+\.(?:e[yw][A-Za-z0-9-_]+)?\.[A-Za-z0-9-_]{2,}(?:(?:\.[A-Za-z0-9-_]{2,}){2})?/,
      'Must be a valid JWT token',
    ),
});
type EmailFormSchemaType = z.infer<typeof emailFormSchema>;
type TokenFormSchemaType = z.infer<typeof tokenFormSchema>;

type LoginType = 'DEDICATED' | 'EMAIL_CODE';

type TargetRedirectFunction = () => Promise<void>;
type LoginFunction = (token: string) => Promise<void>;

type AuthFlowData = {
  email: string;
  flowToken: string;
};

function Index() {
  const { t, i18n } = useTranslation('login');
  const navigate = useNavigate();
  const searchParams: Record<string, string> = Route.useSearch();
  const [authFlowData, setAuthFlowData] = useState<AuthFlowData | null>(null);
  const [loginType, setLoginType] = useState<LoginType>('DEDICATED');

  const targetRedirect: TargetRedirectFunction = useCallback(async () => {
    await navigate({
      to: searchParams.redirect ?? '/user',
      replace: true,
    });
  }, [navigate, searchParams.redirect]);

  const redirectWithCredentials: LoginFunction = useCallback(
    async (token: string) => {
      setAuthentication(token.trim());

      await targetRedirect();
    },
    [targetRedirect],
  );

  return (
    <ScrollArea className="bg-muted h-dvh w-full px-4">
      <main className="flex min-h-dvh w-full flex-col">
        <div className="m-auto flex w-full max-w-[450px] flex-col gap-6">
          <div className="flex flex-row items-center justify-center gap-2 text-center">
            <img
              className="size-8"
              width={32}
              height={32}
              src="/logo.png"
              alt={t('header.image.alt')}
            />
            <p className="font-medium tracking-wide">{t('header.title')}</p>
          </div>
          {loginType === 'DEDICATED' && (
            <DedicatedMenu
              setAuthFlowData={setAuthFlowData}
              setLoginType={setLoginType}
              redirectWithCredentials={redirectWithCredentials}
            />
          )}
          {loginType === 'EMAIL_CODE' && authFlowData !== null && (
            <EmailCodeMenu
              authFlowData={authFlowData}
              setLoginType={setLoginType}
              redirectWithCredentials={redirectWithCredentials}
            />
          )}
          <div>
            <div className="text-muted-foreground text-center text-xs text-balance">
              <p className="mb-1">
                {t('footer.version', {
                  version: APP_VERSION,
                  environment: APP_ENVIRONMENT,
                })}
              </p>
              {APP_ENVIRONMENT === 'production' && (
                <a
                  className="text-blue-500"
                  href="https://preview.pistonpanel.com"
                >
                  {t('footer.preview')}
                </a>
              )}
              {APP_ENVIRONMENT === 'preview' && (
                <a className="text-blue-500" href="https://app.pistonpanel.com">
                  {t('footer.production')}
                </a>
              )}
            </div>
            <div className="flex flex-row justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="text-muted-foreground w-fit text-sm text-balance"
                    variant="ghost"
                  >
                    {languageEmoji(i18n.resolvedLanguage ?? i18n.language)}{' '}
                    {getLanguageName(
                      i18n.resolvedLanguage ?? i18n.language,
                      i18n.resolvedLanguage ?? i18n.language,
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>{t('common:locale')}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={i18n.resolvedLanguage ?? i18n.language}
                    onValueChange={(lang) => void i18n.changeLanguage(lang)}
                    className="grid grid-cols-1 md:grid-cols-2"
                  >
                    {(i18n.options.supportedLngs
                      ? i18n.options.supportedLngs
                      : []
                    )
                      .filter((lang) => lang !== 'cimode')
                      .map((lang) => (
                        <DropdownMenuRadioItem key={lang} value={lang}>
                          {languageEmoji(lang)} {getLanguageName(lang, lang)}
                        </DropdownMenuRadioItem>
                      ))}
                  </DropdownMenuRadioGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <ExternalLink href="https://translate.pistonpanel.com">
                        <HeartHandshakeIcon />
                        {t('footer.helpTranslate')}
                      </ExternalLink>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </main>
    </ScrollArea>
  );
}

function LoginCardTitle() {
  const { t } = useTranslation('login');
  return (
    <CardTitle className="mx-auto flex flex-row items-center gap-2 text-xl">
      <SatelliteDishIcon />
      {t('connect.title')}
    </CardTitle>
  );
}

type DedicatedType = 'email' | 'token';

function DedicatedMenu({
  redirectWithCredentials,
  setLoginType,
  setAuthFlowData,
}: {
  redirectWithCredentials: LoginFunction;
  setLoginType: (type: LoginType) => void;
  setAuthFlowData: (data: AuthFlowData) => void;
}) {
  const { t } = useTranslation('login');
  const [dedicatedType, setDedicatedType] = useState<DedicatedType>('email');

  return (
    <Card>
      <CardHeader className="text-center">
        <LoginCardTitle />
        <CardDescription>{t('dedicated.description')}</CardDescription>
      </CardHeader>
      {dedicatedType === 'email' && (
        <EmailForm
          setDedicatedType={setDedicatedType}
          setLoginType={setLoginType}
          setAuthFlowData={setAuthFlowData}
        />
      )}
      {dedicatedType === 'token' && (
        <TokenForm
          redirectWithCredentials={redirectWithCredentials}
          setDedicatedType={setDedicatedType}
          setLoginType={setLoginType}
        />
      )}
    </Card>
  );
}

function EmailForm({
  setLoginType,
  setAuthFlowData,
  setDedicatedType,
}: {
  setLoginType: (type: LoginType) => void;
  setAuthFlowData: (data: AuthFlowData) => void;
  setDedicatedType: (type: DedicatedType) => void;
}) {
  const { t } = useTranslation('login');
  const form = useForm<EmailFormSchemaType>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: localStorage.getItem(LOCAL_STORAGE_FORM_SERVER_EMAIL_KEY) ?? '',
    },
  });

  function onSubmit(values: EmailFormSchemaType) {
    const email = values.email.trim();
    localStorage.setItem(LOCAL_STORAGE_FORM_SERVER_EMAIL_KEY, email);
    const loginService = new LoginServiceClient(createAddressOnlyTransport());
    toast.promise(
      loginService
        .login({
          email: email,
        })
        .then((response) => {
          setAuthFlowData({
            email: email,
            flowToken: response.response.authFlowToken,
          });
          setLoginType('EMAIL_CODE');
        }),
      {
        loading: t('dedicated.toast.loading'),
        success: t('dedicated.toast.success'),
        error: (e) => {
          console.error(e);
          return t('dedicated.toast.error');
        },
      },
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}>
        <CardContent className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('dedicated.form.email.title')}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t('dedicated.form.email.placeholder')}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {t('dedicated.form.email.description')}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <div className="flex flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setDedicatedType('token');
              }}
              type="button"
            >
              <KeyRoundIcon />
              {t('dedicated.form.useToken')}
            </Button>
            <Button type="submit">
              <LogInIcon />
              {t('dedicated.form.login')}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Form>
  );
}

function TokenForm({
  redirectWithCredentials,
  setLoginType,
  setDedicatedType,
}: {
  redirectWithCredentials: LoginFunction;
  setLoginType: (type: LoginType) => void;
  setDedicatedType: (type: DedicatedType) => void;
}) {
  const { t } = useTranslation('login');
  const form = useForm<TokenFormSchemaType>({
    resolver: zodResolver(tokenFormSchema),
    defaultValues: {
      token: localStorage.getItem(LOCAL_STORAGE_FORM_SERVER_TOKEN_KEY) ?? '',
    },
  });

  function onSubmit(values: TokenFormSchemaType) {
    const token = values.token.trim();
    localStorage.setItem(LOCAL_STORAGE_FORM_SERVER_TOKEN_KEY, token);
    void redirectWithCredentials(token);
  }

  return (
    <Form {...form}>
      <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}>
        <CardContent className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="token"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('dedicated.form.token.title')}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t('dedicated.form.token.placeholder')}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {t('dedicated.form.token.description')}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <div className="flex flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setDedicatedType('email');
              }}
              type="button"
            >
              <MailIcon />
              {t('dedicated.form.useEmail')}
            </Button>
            <Button type="submit">
              <LogInIcon />
              {t('dedicated.form.login')}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Form>
  );
}

function EmailCodeMenu(props: {
  authFlowData: AuthFlowData;
  setLoginType: (type: LoginType) => void;
  redirectWithCredentials: LoginFunction;
}) {
  const { t } = useTranslation('login');
  const [codeValue, setCodeValue] = useState<string>('');
  const [inputDisabled, setInputDisabled] = useState<boolean>(false);

  function setEmailCode(code: string) {
    setCodeValue(code);
    if (code.length !== 6) {
      setInputDisabled(false);
      return;
    }

    setInputDisabled(true);
    toast.promise(
      new LoginServiceClient(createAddressOnlyTransport())
        .emailCode({
          code: code,
          authFlowToken: props.authFlowData.flowToken,
        })
        .then(({ response }) => {
          if (response.next.oneofKind === 'success') {
            void props.redirectWithCredentials(response.next.success.token);
          } else if (response.next.oneofKind === 'failure') {
            setInputDisabled(false);
            setCodeValue('');
            throw new Error(
              getEnumKeyByValue(
                NextAuthFlowResponse_Failure_Reason,
                response.next.failure.reason,
              ),
            );
          } else {
            setInputDisabled(false);
            setCodeValue('');
            throw new Error('Unknown response type');
          }
        }),
      {
        loading: t('emailCode.toast.loading'),
        success: t('emailCode.toast.success'),
        error: (e) => {
          setInputDisabled(false);
          setCodeValue('');
          console.error(e);
          return t('emailCode.toast.error');
        },
      },
    );
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <LoginCardTitle />
        <CardDescription>
          <Trans
            t={t}
            i18nKey={'emailCode.description'}
            values={{
              email: props.authFlowData.email,
            }}
            components={{
              bold: <strong className="font-bold" />,
            }}
          />
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <InputOTP
          disabled={inputDisabled}
          autoFocus={true}
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS}
          value={codeValue}
          onChange={setEmailCode}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => {
            props.setLoginType('DEDICATED');
          }}
        >
          {t('emailCode.back')}
        </Button>
        {inputDisabled && (
          <LoaderCircleIcon className="text-muted-foreground h-10 w-10 animate-spin" />
        )}
      </CardFooter>
    </Card>
  );
}
