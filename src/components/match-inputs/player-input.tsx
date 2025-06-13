/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ActionIcon,
  Combobox,
  TextInput,
  useCombobox,
  type ComboboxDropdownProps,
  type ComboboxProps,
  type TextInputProps,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useRef, useEffect } from 'react';
import type { UseFormReturnType } from '@mantine/form';
import { useSearchForMatch } from '../../api/users/users.queries';
import { IconTrash } from '@tabler/icons-react';

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
  const lastUserSelection = useRef<string | null>(null);

  // Get the current player name for debounced search
  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const currentPlayer = getNestedValue(form.getValues(), field);
  const currentPlayerName = currentPlayer?.name || '';

  const [debouncedQuery] = useDebouncedValue(currentPlayerName, 300);

  const { data, isLoading } = useSearchForMatch(debouncedQuery, playerIds);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const users = data?.data ?? [];

  // Reset the flag after a short delay to prevent issues with rapid interactions
  useEffect(() => {
    if (justSelectedFromDropdown.current) {
      const timer = setTimeout(() => {
        justSelectedFromDropdown.current = false;
      }, 100);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [justSelectedFromDropdown.current]);

  const options = users.map((user) => (
    <Combobox.Option key={user.id} value={user.id}>
      {user.firstName} {user.lastName}
      {user.username && (
        <span style={{ color: 'var(--mantine-color-dimmed)', fontSize: '0.875rem' }}> (@{user.username})</span>
      )}
    </Combobox.Option>
  ));

  const handleOptionSubmit = (userId?: string | null) => {
    if (!userId) {
      // Clear both name and userId
      form.setFieldValue(`${field}.name`, '');
      form.setFieldValue(`${field}.userId`, null);
      lastUserSelection.current = null;
      return;
    }

    const selectedUser = users.find((user) => user.id === userId);

    if (selectedUser) {
      // Set flag to prevent clearing userId in onChange
      justSelectedFromDropdown.current = true;
      lastUserSelection.current = userId;

      const fullName = `${selectedUser.firstName} ${selectedUser.lastName}`;

      // Use single batch update to avoid race conditions
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

        // Update both fields atomically
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

    // Check if user manually edited the name after selecting a user
    const wasUserSelected = lastUserSelection.current !== null;
    const isManualEdit = !justSelectedFromDropdown.current;

    if (isManualEdit && wasUserSelected) {
      // User is manually editing after selecting a user - clear the userId
      form.setValues((current) => {
        const updated = { ...current };
        const pathParts = field.split('.');

        let target = updated;
        for (let i = 0; i < pathParts.length - 1; i++) {
          if (!target[pathParts[i]]) {
            target[pathParts[i]] = {};
          }
          target = target[pathParts[i]];
        }

        const finalKey = pathParts[pathParts.length - 1];
        if (!target[finalKey]) {
          target[finalKey] = {};
        }

        target[finalKey] = {
          ...target[finalKey],
          name: newValue,
          userId: null, // Clear userId when manually editing
        };

        return updated;
      });

      lastUserSelection.current = null;
    } else if (isManualEdit) {
      // Regular manual input - just update name
      form.setFieldValue(`${field}.name`, newValue);
    }

    // Reset the dropdown selection flag after processing
    if (justSelectedFromDropdown.current) {
      setTimeout(() => {
        justSelectedFromDropdown.current = false;
      }, 50);
    }
  };

  const handleInputBlur = () => {
    combobox.closeDropdown();

    // Final cleanup of flags
    setTimeout(() => {
      justSelectedFromDropdown.current = false;
    }, 100);
  };

  const handleInputFocus = () => {
    combobox.openDropdown();
  };

  const handleRemoveUser = () => {
    form.setFieldValue(`${field}.name`, '');
    form.setFieldValue(`${field}.userId`, null);
    lastUserSelection.current = null;
  };

  return (
    <Combobox store={combobox} onOptionSubmit={handleOptionSubmit} {...comboboxProps}>
      <Combobox.Target>
        <TextInput
          label={label}
          placeholder={placeholder}
          required={required}
          value={currentPlayerName}
          onClick={() => combobox.openDropdown()}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onChange={handleInputChange}
          rightSection={
            isLoading ? (
              <span>...</span>
            ) : currentPlayer?.userId ? (
              <ActionIcon onClick={handleRemoveUser} variant='subtle' color='red'>
                <IconTrash size={15} />
              </ActionIcon>
            ) : null
          }
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
