import { Button, Combobox, Loader, rem, Text, TextInput, useCombobox, type ComboboxProps } from '@mantine/core';
import { Box, Group, ThemeIcon } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import { IconBuildingStadium, IconMapPin, IconSearch } from '@tabler/icons-react';
import { useSearchVenues } from '../api/venues/venues.queries';
import { useDebouncedValue } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { SelectVenuesModal } from './select-venues-modal';

interface VenueInputProps {
  form: UseFormReturnType<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  field?: string;
  nameField?: string;
  comboboxProps?: ComboboxProps;
}

export function VenueInput({ form, field = 'venueId', nameField = 'venueName', comboboxProps }: VenueInputProps) {
  const currentVenueName = form.getValues()[nameField];

  const [debouncedQuery] = useDebouncedValue(currentVenueName, 300);

  const { data, isLoading } = useSearchVenues(debouncedQuery);
  const venues = data?.data ?? [];

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const options = venues.map((venue) => (
    <Combobox.Option key={venue.id} value={venue.id}>
      {venue.name}
    </Combobox.Option>
  ));

  const handleOptionSubmit = (venueId: string) => {
    const selectedVenue = venues.find((venue) => venue.id === venueId);

    if (selectedVenue) {
      form.setFieldValue(field, selectedVenue.id);
      form.setFieldValue(nameField, selectedVenue.name);

      combobox.closeDropdown();
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value;

    form.setFieldValue(nameField, newValue);
  };

  const handleInputBlur = () => {
    combobox.closeDropdown();
  };

  const handleInputFocus = () => {
    combobox.openDropdown();
  };

  const handleSelectOnMap = (venue: { id: string; name: string }) => {
    form.setFieldValue(field, venue.id);
    form.setFieldValue(nameField, venue.name);
    modals.closeAll();
  };

  const openSelectOnMapModal = () =>
    modals.open({
      withCloseButton: false,
      size: 'xl',
      children: <SelectVenuesModal onSelect={handleSelectOnMap} />,
    });

  return (
    <Box>
      <Group align='center' gap='sm' mb='sm'>
        <ThemeIcon size={20} radius='xl' color='cyan' variant='light'>
          <IconBuildingStadium size={12} />
        </ThemeIcon>
        <Text size='sm' fw={700} c='gray.7' tt='uppercase'>
          Venue
        </Text>
      </Group>

      <Group>
        <Combobox store={combobox} onOptionSubmit={handleOptionSubmit} {...comboboxProps}>
          <Combobox.Target>
            <TextInput
              flex={1}
              placeholder='Search for venues'
              {...form.getInputProps(nameField)}
              onClick={() => combobox.openDropdown()}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onChange={handleInputChange}
              rightSection={isLoading ? <Loader type='dots' size='xs' /> : null}
              leftSection={<IconSearch size={16} />}
              styles={{
                input: {
                  borderRadius: rem(12),
                  border: '2px solid var(--mantine-color-green-7)',
                  backgroundColor: 'white',
                  fontSize: rem(14),
                  fontWeight: 500,
                  paddingLeft: rem(45),
                  paddingRight: rem(35),
                  '&:focus': {
                    borderColor: 'var(--mantine-color-green-9)',
                    boxShadow: '0 0 0 2px var(--mantine-color-green-2)',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.2s ease',
                },
                description: {
                  fontSize: rem(12),
                  color: 'var(--mantine-color-gray-6)',
                  marginTop: rem(4),
                },
                controls: {
                  borderColor: 'transparent',
                },
                control: {
                  backgroundColor: 'var(--mantine-color-orange-1)',
                  borderColor: 'transparent',
                  color: 'var(--mantine-color-orange-7)',
                  '&:hover': {
                    backgroundColor: 'var(--mantine-color-orange-2)',
                  },
                },
              }}
            />
          </Combobox.Target>

          <Combobox.Dropdown>
            <Combobox.Options>
              {isLoading ? (
                <Combobox.Empty>Searching...</Combobox.Empty>
              ) : options.length > 0 ? (
                options
              ) : debouncedQuery.length > 0 ? (
                <Combobox.Empty>No venues found</Combobox.Empty>
              ) : (
                <Combobox.Empty>Start typing to search venues</Combobox.Empty>
              )}
            </Combobox.Options>
          </Combobox.Dropdown>
        </Combobox>
        {/* Select from map */}
        <Button variant='outline' size='sm' onClick={openSelectOnMapModal} leftSection={<IconMapPin size={16} />}>
          Map
        </Button>
      </Group>
    </Box>
  );
}
