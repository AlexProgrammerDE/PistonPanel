import { ReactNode, useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ClipboardIcon, InfoIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export function TextInfoButton(props: { value: ReactNode }) {
  return (
    <GenericInfoButton
      value={() => <p className="whitespace-pre-line">{props.value}</p>}
    />
  );
}

export function CopyInfoButton(props: { value: string }) {
  const { t } = useTranslation('common');
  return (
    <GenericInfoButton
      value={(close) => (
        <div className="flex flex-row items-center gap-2">
          <p className="whitespace-pre-line">{props.value}</p>
          <Button
            size="icon"
            variant="secondary"
            className="shrink-0"
            onClick={() => {
              void navigator.clipboard.writeText(props.value);
              close();
              toast.success(t('copiedToClipboard'));
            }}
          >
            <ClipboardIcon className="h-4 w-4" />
          </Button>
        </div>
      )}
    />
  );
}

function GenericInfoButton(props: {
  value: (closer: () => void) => ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <InfoIcon
          className="h-4 w-4 shrink-0 cursor-pointer opacity-50"
          onClick={() => {
            setOpen(!open);
          }}
        />
      </PopoverTrigger>
      <PopoverContent>{props.value(() => setOpen(false))}</PopoverContent>
    </Popover>
  );
}
