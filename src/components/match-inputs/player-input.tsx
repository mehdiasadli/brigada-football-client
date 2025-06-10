/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Combobox,
  TextInput,
  useCombobox,
  type ComboboxDropdownProps,
  type ComboboxProps,
  type TextInputProps,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useRef } from 'react';
import type { UseFormReturnType } from '@mantine/form';
import { useSearchForMatch } from '../../api/users/users.queries';

interface PlayerInputProps {
  form: UseFormReturnType<any>;
  field: string; // e.g., "team1.players.0", "players.1", etc.
  label?: string;
  placeholder?: string;
  required?: boolean;
  targetProps?: TextInputProps;
  dropdownProps?: ComboboxDropdownProps;
  comboboxProps?: ComboboxProps;
  playerIds?: string[];
}

export default function PlayerInput({
  form,
  field,
  label = 'Player',
  placeholder = 'Enter player name or select from users',
  required = false,
  targetProps,
  dropdownProps,
  comboboxProps,
  playerIds = [],
}: PlayerInputProps) {
  const justSelectedFromDropdown = useRef(false);

  // Get the current player name for debounced search
  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const currentPlayer = getNestedValue(form.getValues(), field);
  const currentPlayerName = currentPlayer?.name || '';
  const [debouncedQuery] = useDebouncedValue(currentPlayerName, 300);

  // TODO: exclude already seleced players for the match
  const { data, isLoading } = useSearchForMatch(debouncedQuery, playerIds);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const users = data?.data ?? [];

  const options = users.map((user) => (
    <Combobox.Option key={user.id} value={user.id}>
      {user.firstName} {user.lastName}
      {user.username && (
        <span style={{ color: 'var(--mantine-color-dimmed)', fontSize: '0.875rem' }}> (@{user.username})</span>
      )}
    </Combobox.Option>
  ));

  const handleOptionSubmit = (userId: string) => {
    const selectedUser = users.find((user) => user.id === userId);

    if (selectedUser) {
      // Set flag to prevent clearing userId in onChange
      justSelectedFromDropdown.current = true;

      const fullName = `${selectedUser.firstName} ${selectedUser.lastName}`;

      // Method 1: Try setting both values in sequence
      form.setFieldValue(`${field}.name`, fullName);

      form.setFieldValue(`${field}.userId`, userId);

      // Method 2: Also try batch update as backup
      form.setValues((current) => {
        const updated = { ...current };
        const pathParts = field.split('.');

        // Navigate to the target object
        let target = updated;
        for (let i = 0; i < pathParts.length - 1; i++) {
          if (!target[pathParts[i]]) {
            target[pathParts[i]] = {};
          }
          target = target[pathParts[i]];
        }

        // Set the final property
        const finalKey = pathParts[pathParts.length - 1];
        if (!target[finalKey]) {
          target[finalKey] = {};
        }

        target[finalKey] = {
          ...target[finalKey],
          name: fullName,
          userId: userId,
        };

        return updated;
      });
    }
    combobox.closeDropdown();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value;

    // Update the name
    form.setFieldValue(`${field}.name`, newValue);

    // Only clear userId if NOT just selected from dropdown
    if (!justSelectedFromDropdown.current) {
      form.setFieldValue(`${field}.userId`, null);
    }
  };

  const handleInputBlur = () => {
    combobox.closeDropdown();
  };

  const handleInputFocus = () => {
    combobox.openDropdown();
  };

  return (
    <Combobox store={combobox} onOptionSubmit={handleOptionSubmit} {...comboboxProps}>
      <Combobox.Target>
        <TextInput
          label={label}
          placeholder={placeholder}
          required={required}
          {...form.getInputProps(`${field}.name`)}
          onClick={() => combobox.openDropdown()}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onChange={handleInputChange}
          rightSection={isLoading ? <span>...</span> : null}
          {...targetProps}
        />
      </Combobox.Target>

      <Combobox.Dropdown {...dropdownProps}>
        <Combobox.Options>
          {isLoading ? (
            <Combobox.Empty>Searching...</Combobox.Empty>
          ) : options.length > 0 ? (
            options
          ) : debouncedQuery.length > 0 ? (
            <Combobox.Empty>No users found</Combobox.Empty>
          ) : (
            <Combobox.Empty>Start typing to search users</Combobox.Empty>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
