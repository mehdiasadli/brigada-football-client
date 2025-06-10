import { Center, Loader, type CenterProps, type LoaderProps } from '@mantine/core';

export interface LoadingComponentProps {
  containerProps?: CenterProps;
  loaderProps?: LoaderProps;
}

export default function LoadingComponent({ containerProps, loaderProps }: LoadingComponentProps) {
  return (
    <Center {...containerProps}>
      <Loader size='xs' type='bars' {...loaderProps} />
    </Center>
  );
}
