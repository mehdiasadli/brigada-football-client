import { TextInput, type TextInputProps } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';

interface PlayerNameInputProps {
  form: UseFormReturnType<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  field: string;
  textInputProps?: TextInputProps;
}

export default function PlayerNameInput({ form, textInputProps, field }: PlayerNameInputProps) {
  return (
    <TextInput label='Player name' placeholder='Enter player name' {...form.getInputProps(field)} {...textInputProps} />
  );
}
