import { Group, Card, Text, Badge, ActionIcon, Stack, Box, Menu, Button } from '@mantine/core';
import { IconTrash, IconDots, IconMap, IconPhone, IconUser, IconCurrencyDollar, IconEye } from '@tabler/icons-react';

import { VenueType, type VenueSchema } from '../schemas/entities/venue.entity';
import { modals } from '@mantine/modals';
import { VenueMapModal } from './venue-map-modal';
import { useDeleteVenue } from '../api/venues/venues.mutations';
import { Link } from 'react-router-dom';

interface VenueCardProps {
  venue: VenueSchema;
}

export function VenueCard({ venue }: VenueCardProps) {
  const mutation = useDeleteVenue();

  const getTypeColor = (type: (typeof VenueType.options)[number]) => {
    switch (type) {
      case VenueType.enum.INDOOR:
        return 'blue';
      case VenueType.enum.OUTDOOR:
        return 'orange';
      case VenueType.enum.INDOOR_OUTDOOR:
        return 'violet';
      default:
        return 'gray';
    }
  };

  const getTypeLabel = (type: (typeof VenueType.options)[number]) => {
    switch (type) {
      case VenueType.enum.INDOOR:
        return 'Indoor';
      case VenueType.enum.OUTDOOR:
        return 'Outdoor';
      case VenueType.enum.INDOOR_OUTDOOR:
        return 'Indoor/Outdoor';
      default:
        return 'Unknown';
    }
  };

  const openMapModal = () =>
    modals.open({
      withCloseButton: false,
      size: 'xl',
      children: <VenueMapModal venue={venue} />,
    });

  const openDeleteModal = () =>
    modals.openConfirmModal({
      title: 'Delete Venue',
      children: 'Are you sure you want to delete this venue? This action cannot be undone.',
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: {
        color: 'red',
        loading: mutation.isPending,
        variant: 'filled',
      },
      cancelProps: { variant: 'light' },
      zIndex: 10000,
      onConfirm: () => {
        mutation.mutate(venue.id);
        modals.closeAll();
      },
    });

  return (
    <Card shadow='sm' padding='lg' radius='md' style={{ border: '1px solid var(--mantine-color-gray-2)' }}>
      <Card.Section p='md' pb='xs'>
        <Group justify='space-between' align='flex-start'>
          <Box style={{ flex: 1 }}>
            <Group gap='xs' mb='xs'>
              <Text size='lg' fw={600} lineClamp={1}>
                {venue.name}
              </Text>
            </Group>

            <Group gap='xs' mb='xs'>
              <IconMap size={14} color='var(--mantine-color-gray-6)' />
              <Text size='sm' c='dimmed' lineClamp={1}>
                {venue.address}
              </Text>
            </Group>

            <Group gap='xs'>
              <Badge color={getTypeColor(venue.type)} variant='light' size='xs'>
                {getTypeLabel(venue.type)}
              </Badge>
            </Group>
          </Box>

          <Menu shadow='md' width={200}>
            <Menu.Target>
              <ActionIcon variant='subtle' color='gray'>
                <IconDots size={16} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item component={Link} to={`/venues/${venue.id}`} leftSection={<IconEye size={14} />}>
                View Venue
              </Menu.Item>
              <Menu.Item leftSection={<IconTrash size={14} />} color='red' onClick={openDeleteModal}>
                Delete Venue
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Card.Section>

      <Stack gap='md' mt='md'>
        {/* Capacity & Utilization */}
        <Box>
          <Group justify='space-between' mb='xs'>
            <Group gap='xs'>
              <IconCurrencyDollar size={14} color='var(--mantine-color-gray-6)' />
              <Text size='sm' fw={500}>
                Price per hour
              </Text>
            </Group>
            <Text size='sm' fw={600}>
              {venue.pricePerHour.toLocaleString()} AZN
            </Text>
          </Group>
        </Box>

        {/* Contact Info */}
        <Box>
          <Text size='sm' fw={500} mb='xs'>
            Contact Information
          </Text>
          <Stack gap='xs'>
            <Group gap='xs'>
              <IconPhone size={12} color='var(--mantine-color-gray-6)' />
              <Text size='xs' c='dimmed'>
                {venue.contactPhone || 'N/A'}
              </Text>
            </Group>
            <Group gap='xs'>
              <IconUser size={12} color='var(--mantine-color-gray-6)' />
              <Text size='xs' c='dimmed'>
                {venue.contactName || 'N/A'}
              </Text>
            </Group>
          </Stack>
        </Box>

        {/* Features */}
        <Box mt={'md'}>
          <Text size='sm' fw={500} mb='xs'>
            Features
          </Text>
          <Group gap='xs'>
            {venue.hasParking && (
              <Badge variant='dot' color='blue' size='xs'>
                Parking
              </Badge>
            )}
            {venue.hasShowers && (
              <Badge variant='dot' color='blue' size='xs'>
                Showers
              </Badge>
            )}
            <Button
              onClick={openMapModal}
              size='xs'
              variant='light'
              color='blue'
              leftSection={<IconMap size={14} />}
              ml='auto'
            >
              Show on map
            </Button>
          </Group>
        </Box>
      </Stack>
    </Card>
  );
}
