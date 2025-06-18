import {
  Box,
  Button,
  Card,
  Group,
  NumberInput,
  Paper,
  rem,
  Select,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconBuildingStadium, IconInfoCircle } from '@tabler/icons-react';
import { createVenueSchema, type CreateVenueSchema } from '../schemas/venues.schema';
import { VenueType } from '../schemas/entities/venue.entity';
import { zodResolver } from 'mantine-form-zod-resolver';
import SetMap from '../components/set-map';
import { useCreateVenue } from '../api/venues/venues.mutations';

export default function AddVenuePage() {
  const form = useForm<CreateVenueSchema>({
    initialValues: {
      name: '',
      address: '',
      addressDescription: '',
      hasParking: false,
      hasShowers: true,
      pricePerHour: 50,
      type: VenueType.enum.OUTDOOR,
      contactName: '',
      contactPhone: '',
      latitude: 40.3774,
      longitude: 49.8542,
    },
    validate: zodResolver(createVenueSchema),
  });

  const mutation = useCreateVenue();

  const onSubmit = form.onSubmit((values) => {
    mutation.mutate(values);
  });

  const getTypeLabel = (type: (typeof VenueType.options)[number]) => {
    switch (type) {
      case VenueType.enum.OUTDOOR:
        return 'Outdoor';
      case VenueType.enum.INDOOR:
        return 'Indoor';
      case VenueType.enum.INDOOR_OUTDOOR:
        return 'Indoor/Outdoor';
      default:
        return 'Unknown';
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <Stack gap='xl'>
        {/* Header Section */}
        <Paper
          shadow='xl'
          radius='xl'
          p='xl'
          style={{
            background: 'linear-gradient(135deg, var(--mantine-color-yellow-6) 0%, var(--mantine-color-teal-3) 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Soccer field pattern */}
          <Box
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '200px',
              height: '100px',
              background:
                "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E\")",
              opacity: 0.3,
            }}
          />

          <Group align='center' gap='lg'>
            <ThemeIcon
              size={80}
              radius='xl'
              color='white'
              variant='white'
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
            >
              <IconBuildingStadium size={40} />
            </ThemeIcon>

            <Box>
              <Title order={1} fw={900} mb='sm'>
                Create New Venue
              </Title>
              <Text size='lg' opacity={0.9}>
                Add a new venue to the database
              </Text>
            </Box>
          </Group>
        </Paper>

        {/* Venue Details Section */}
        <Card shadow='md' radius='xl' p='xl' withBorder>
          <Group align='center' gap='sm' mb='xl'>
            <ThemeIcon size={32} radius='xl' color='blue' variant='light'>
              <IconInfoCircle size={18} />
            </ThemeIcon>
            <Title order={3} fw={700} c='gray.8'>
              Venue Information
            </Title>
          </Group>

          <Stack gap='lg'>
            <TextInput
              label='Name'
              description="The name of the venue. Each name must be unique, so you can't use the same name for multiple venues."
              placeholder='Enter venue name'
              {...form.getInputProps('name')}
            />
            <TextInput
              label='Address'
              description='The address of the venue. This is the physical location of the venue.'
              placeholder='Enter venue address'
              {...form.getInputProps('address')}
            />
            <Textarea
              label='Address Description'
              description='The description of the address. For example, "Next to the main entrance of the university".'
              placeholder='Enter venue address description'
              {...form.getInputProps('addressDescription')}
            />
            <Switch
              label='Has Parking'
              description='Whether the venue has parking facilities.'
              {...form.getInputProps('hasParking', { type: 'checkbox' })}
            />
            <Switch
              label='Has Showers'
              description='Whether the venue has shower facilities.'
              {...form.getInputProps('hasShowers', { type: 'checkbox' })}
            />
            <NumberInput
              label='Price per Hour (AZN)'
              description='The price per hour for the venue. This is the price for the venue per hour.'
              placeholder='Enter price per hour'
              {...form.getInputProps('pricePerHour')}
            />
            <Select
              allowDeselect={false}
              label='Type'
              placeholder='Select venue type'
              description='This is the type of the venue. If venue includes both indoor and outdoor facilities, select "Indoor/Outdoor".'
              {...form.getInputProps('type')}
              data={Object.values(VenueType.options).map((type) => ({ label: getTypeLabel(type), value: type }))}
            />
            <TextInput
              label='Contact Name'
              description='The name of the contact person for the venue. It is optional.'
              placeholder='Enter contact name'
              {...form.getInputProps('contactName')}
            />
            <TextInput
              label='Contact Phone'
              description='The phone number of the contact person for the venue.'
              placeholder='Enter contact phone'
              {...form.getInputProps('contactPhone')}
            />
          </Stack>
        </Card>

        <Card shadow='md' radius='xl' p='xl' withBorder>
          <Stack>
            <Title order={3} fw={700} c='gray.8'>
              Mark location on map
            </Title>
            <Text size='sm' c='gray.6'>
              You can mark the location of the venue on the map. Drag the map by holding the left mouse button, and
              double click to set the location.
            </Text>
            <SetMap form={form} />
          </Stack>
        </Card>

        <Paper
          shadow='lg'
          radius='xl'
          p='lg'
          style={{
            background: 'linear-gradient(135deg, var(--mantine-color-yellow-0) 0%, var(--mantine-color-teal-0) 100%)',
            border: `2px solid var(--mantine-color-yellow-2)`,
          }}
        >
          <Button
            // loading={mutation.isPending}
            type='submit'
            size='xl'
            radius='xl'
            fullWidth
            variant='gradient'
            gradient={{
              from: 'yellow.6',
              to: 'teal.3',
            }}
            leftSection={<IconBuildingStadium size={24} />}
            style={{
              height: rem(60),
              fontSize: rem(18),
              fontWeight: 700,
              boxShadow: `0 8px 16px rgba(59, 130, 246, 0.3)`,
            }}
          >
            Create Venue
          </Button>
        </Paper>
      </Stack>
    </form>
  );
}
