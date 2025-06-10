import { Alert, type AlertProps, Center, type CenterProps, type TextProps } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { ApiError } from '../api/api-error';

export interface ErrorComponentProps {
  error?: ApiError | string;
  containerProps?: CenterProps;
  alertProps?: AlertProps;
  textProps?: TextProps;
  icon?: React.ReactNode;
  title?: React.ReactNode | ((error?: ApiError | string) => React.ReactNode);
}

export default function ErrorComponent({ error, containerProps, alertProps, icon, title }: ErrorComponentProps) {
  const titleText =
    error instanceof ApiError
      ? error.message
      : typeof error === 'string'
        ? error
        : typeof title === 'function'
          ? title(error)
          : typeof title === 'string'
            ? title
            : 'An error occurred';

  return (
    <Center {...containerProps}>
      <Alert
        px={40}
        py={20}
        icon={icon ?? <IconAlertCircle size={16} />}
        title={titleText}
        color='red'
        {...alertProps}
      />
    </Center>
  );
}
