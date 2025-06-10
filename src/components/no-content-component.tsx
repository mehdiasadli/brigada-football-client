import { Text, Center, type CenterProps, type TextProps } from '@mantine/core';

export interface NoContentComponentProps {
  containerProps?: CenterProps;
  textProps?: TextProps;
  text?: string;
}

export default function NoContentComponent({ containerProps, textProps, text }: NoContentComponentProps) {
  return (
    <Center {...containerProps}>
      <Text c='dimmed' fz='sm' {...textProps}>
        {text ?? 'No content'}
      </Text>
    </Center>
  );
}
