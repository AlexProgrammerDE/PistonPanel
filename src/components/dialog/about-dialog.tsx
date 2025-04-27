import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from '../ui/credenza';
import { Button } from '@/components/ui/button';
import { createContext, ReactNode, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { useTranslation } from 'react-i18next';

export const AboutContext = createContext<{
  openAbout: () => void;
}>(null as never);

export function AboutProvider(props: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AboutContext
        value={{
          openAbout: () => {
            setOpen(true);
          },
        }}
      >
        {props.children}
      </AboutContext>
      <AboutDialog open={open} setOpen={setOpen} />
    </>
  );
}

function AboutDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { t } = useTranslation('common');

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>{t('dialog.about.title')}</CredenzaTitle>
          <CredenzaDescription>
            {t('dialog.about.description', {
              version: import.meta.env.APP_VERSION,
            })}
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('dialog.about.type')}</TableHead>
                <TableHead>{t('dialog.about.value')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{t('dialog.about.fields.browser')}</TableCell>
                <TableCell>{navigator.userAgent}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>{t('dialog.about.fields.locale')}</TableCell>
                <TableCell>{navigator.language}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>{t('dialog.about.fields.environment')}</TableCell>
                <TableCell>{import.meta.env.APP_ENVIRONMENT}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button>{t('dialog.about.close')}</Button>
          </CredenzaClose>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
