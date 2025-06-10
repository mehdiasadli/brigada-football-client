import {
  Anchor,
  Button,
  Paper,
  InputBase,
  PasswordInput,
  Select,
  Stack,
  TextInput,
  Title,
  Text,
  ThemeIcon,
  Box,
  rem,
  SimpleGrid,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { registerSchema, type RegisterSchema } from '../schemas/auth.schema';
import { zodResolver } from 'mantine-form-zod-resolver';
import { useRegister } from '../api/auth/auth.mutations';
import { Link } from 'react-router-dom';
import { Gender } from '../schemas/entities/user.entity';
import { IMaskInput } from 'react-imask';
import {
  IconUserPlus,
  IconMail,
  IconUser,
  IconLock,
  IconPhone,
  IconMapPin,
  IconGenderBigender,
  IconCalendar,
} from '@tabler/icons-react';
import { DateInput } from '@mantine/dates';

export default function RegisterPage() {
  const form = useForm<RegisterSchema>({
    initialValues: {
      email: '',
      firstName: '',
      lastName: '',
      username: '',
      placeOfBirth: '',
      gender: 'MALE',
      password: '',
      confirmPassword: '',
      mobileNumber: '',
      dateOfBirth: new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
    },
    validate: zodResolver(registerSchema),
    transformValues(values) {
      const dateOfBirth = new Date(values.dateOfBirth);
      dateOfBirth.setHours(0, 0, 0, 0);

      return {
        ...values,
        dateOfBirth,
      };
    },
  });

  const mutation = useRegister();
  const onSubmit = form.onSubmit(
    (values) => {
      mutation.mutate(values);
    },
    (err) => {
      console.log(err);
    }
  );

  const inputStyles = {
    input: {
      borderRadius: rem(12),
      border: '2px solid var(--mantine-color-gray-3)',
      paddingLeft: rem(45),
      '&:focus': {
        borderColor: 'var(--mantine-color-blue-5)',
        boxShadow: '0 0 0 2px var(--mantine-color-blue-1)',
      },
    },
    label: {
      fontWeight: 600,
      color: 'var(--mantine-color-gray-7)',
      marginBottom: rem(6),
    },
  };

  return (
    <Paper
      shadow='2xl'
      radius='xl'
      p='xl'
      style={{
        width: 'min(95vw, 600px)',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        position: 'relative',
      }}
    >
      {/* Header Section */}
      <Stack align='center' gap='lg' mb='xl'>
        <Box
          style={{
            position: 'relative',
            background: 'linear-gradient(135deg, var(--mantine-color-blue-6) 0%, var(--mantine-color-indigo-6) 100%)',
            borderRadius: '50%',
            width: rem(60),
            height: rem(60),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)',
          }}
        >
          <IconUserPlus size={40} color='white' />

          {/* Pulsing Ring */}
          <Box
            style={{
              position: 'absolute',
              top: rem(-8),
              left: rem(-8),
              right: rem(-8),
              bottom: rem(-8),
              border: '2px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '50%',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          />
        </Box>

        <Stack align='center' gap='xs'>
          <Title order={2} fw={800} c='gray.8'>
            Join the Team
          </Title>
          <Text size='md' c='gray.6' ta='center'>
            Create your soccer management account
          </Text>
        </Stack>
      </Stack>

      {/* Registration Form */}
      <form onSubmit={onSubmit}>
        <Stack gap='lg'>
          {/* Email */}
          <TextInput
            label='Email Address'
            placeholder='Enter your email'
            leftSection={
              <ThemeIcon size={20} radius='xl' color='red' variant='light'>
                <IconMail size={12} />
              </ThemeIcon>
            }
            styles={inputStyles}
            {...form.getInputProps('email')}
          />

          {/* Name Fields */}
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing='md'>
            <TextInput
              label='First Name'
              placeholder='Your first name'
              leftSection={
                <ThemeIcon size={20} radius='xl' color='green' variant='light'>
                  <IconUser size={12} />
                </ThemeIcon>
              }
              styles={inputStyles}
              {...form.getInputProps('firstName')}
            />

            <TextInput
              label='Last Name'
              placeholder='Your last name'
              leftSection={
                <ThemeIcon size={20} radius='xl' color='green' variant='light'>
                  <IconUser size={12} />
                </ThemeIcon>
              }
              styles={inputStyles}
              {...form.getInputProps('lastName')}
            />
          </SimpleGrid>

          {/* Username */}
          <TextInput
            label='Username'
            placeholder='Choose a username'
            leftSection={
              <ThemeIcon size={20} radius='xl' color='blue' variant='light'>
                <IconUser size={12} />
              </ThemeIcon>
            }
            styles={inputStyles}
            {...form.getInputProps('username')}
          />

          {/* Contact & Personal Info */}
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing='md'>
            <InputBase
              label='Mobile Number'
              placeholder='994551234567'
              description='Format: 994xxxxxxxxx'
              leftSection={
                <ThemeIcon size={20} radius='xl' color='orange' variant='light'>
                  <IconPhone size={12} />
                </ThemeIcon>
              }
              component={IMaskInput}
              mask={'994000000000'}
              styles={inputStyles}
              {...form.getInputProps('mobileNumber')}
            />

            <TextInput
              label='Place of Birth'
              description='Format: City/District, Country'
              placeholder='Your birthplace'
              leftSection={
                <ThemeIcon size={20} radius='xl' color='teal' variant='light'>
                  <IconMapPin size={12} />
                </ThemeIcon>
              }
              styles={inputStyles}
              {...form.getInputProps('placeOfBirth')}
            />
          </SimpleGrid>

          {/* Date of Birth */}
          <DateInput
            label='Date of Birth'
            placeholder='Select your date of birth'
            leftSection={
              <ThemeIcon size={20} radius='xl' color='teal' variant='light'>
                <IconCalendar size={12} />
              </ThemeIcon>
            }
            minDate={new Date(new Date().setFullYear(new Date().getFullYear() - 100))}
            maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 18))}
            styles={inputStyles}
            {...form.getInputProps('dateOfBirth')}
          />

          {/* Gender */}
          <Select
            label='Gender'
            placeholder='Select your gender'
            leftSection={
              <ThemeIcon size={20} radius='xl' color='pink' variant='light'>
                <IconGenderBigender size={12} />
              </ThemeIcon>
            }
            data={Gender.options.map((option) => ({
              label: option[0].toUpperCase() + option.slice(1).toLowerCase(),
              value: option,
            }))}
            styles={inputStyles}
            {...form.getInputProps('gender')}
          />

          {/* Password Fields */}
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing='md'>
            <PasswordInput
              label='Password'
              placeholder='Create password'
              leftSection={
                <ThemeIcon size={20} radius='xl' color='violet' variant='light'>
                  <IconLock size={12} />
                </ThemeIcon>
              }
              styles={inputStyles}
              {...form.getInputProps('password')}
            />

            <PasswordInput
              label='Confirm Password'
              placeholder='Confirm password'
              leftSection={
                <ThemeIcon size={20} radius='xl' color='violet' variant='light'>
                  <IconLock size={12} />
                </ThemeIcon>
              }
              styles={inputStyles}
              {...form.getInputProps('confirmPassword')}
            />
          </SimpleGrid>

          {/* Submit Button */}
          <Button
            type='submit'
            loading={mutation.isPending}
            size='lg'
            radius='xl'
            variant='gradient'
            gradient={{ from: 'blue', to: 'indigo' }}
            leftSection={<IconUserPlus size={18} />}
            style={{
              height: rem(50),
              fontSize: rem(16),
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
            }}
            fullWidth
          >
            Create Account
          </Button>

          {/* Login Link */}
          <Paper
            p='md'
            radius='lg'
            style={{
              backgroundColor: 'var(--mantine-color-gray-0)',
              border: '1px solid var(--mantine-color-gray-3)',
              textAlign: 'center',
            }}
          >
            <Text size='sm' c='gray.6'>
              Already have an account?{' '}
              <Anchor component={Link} to='/auth' c='blue.6' fw={600} style={{ textDecoration: 'none' }}>
                Sign In
              </Anchor>
            </Text>
          </Paper>
        </Stack>
      </form>

      {/* CSS Animation */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.05); }
          }
        `}
      </style>
    </Paper>
  );
}
