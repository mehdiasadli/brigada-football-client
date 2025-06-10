import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { loginSchema, type LoginSchema } from '../schemas/auth.schema';
import { useLogin } from '../api/auth/auth.mutations';
import {
  Anchor,
  Button,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
  Title,
  Text,
  Group,
  ThemeIcon,
  Box,
  rem,
} from '@mantine/core';
import { IconBallFootball, IconMail, IconLock, IconLogin } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  const form = useForm<LoginSchema>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: zodResolver(loginSchema),
  });

  const mutation = useLogin();

  const onSubmit = form.onSubmit(
    (values) => {
      mutation.mutate(values);
    },
    (error) => {
      console.error(error);
    }
  );

  return (
    <Paper
      shadow='2xl'
      radius='xl'
      p='xl'
      style={{
        width: 'min(90vw, 450px)',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Header Section */}
      <Stack align='center' gap='lg' mb='xl'>
        <Box
          style={{
            position: 'relative',
            background: 'linear-gradient(135deg, var(--mantine-color-green-6) 0%, var(--mantine-color-teal-6) 100%)',
            borderRadius: '50%',
            width: rem(60),
            height: rem(60),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(34, 197, 94, 0.3)',
          }}
        >
          <IconBallFootball size={40} color='white' />

          {/* Rotating Ring */}
          <Box
            style={{
              position: 'absolute',
              top: rem(-8),
              left: rem(-8),
              right: rem(-8),
              bottom: rem(-8),
              border: '2px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '50%',
              borderTopColor: 'var(--mantine-color-green-4)',
              animation: 'spin 3s linear infinite',
            }}
          />
        </Box>

        <Stack align='center' gap='xs'>
          <Title order={2} fw={800} c='gray.8'>
            Welcome Back
          </Title>
          <Text size='md' c='gray.6' ta='center'>
            Sign in to your soccer management account
          </Text>
        </Stack>
      </Stack>

      {/* Login Form */}
      <form onSubmit={onSubmit}>
        <Stack gap='lg'>
          <TextInput
            label='Email Address'
            placeholder='Enter your email'
            leftSection={
              <ThemeIcon size={20} radius='xl' color='blue' variant='light'>
                <IconMail size={12} />
              </ThemeIcon>
            }
            styles={{
              input: {
                borderRadius: rem(12),
                border: '2px solid var(--mantine-color-gray-3)',
                paddingLeft: rem(45),
                '&:focus': {
                  borderColor: 'var(--mantine-color-green-5)',
                  boxShadow: '0 0 0 2px var(--mantine-color-green-1)',
                },
              },
              label: {
                fontWeight: 600,
                color: 'var(--mantine-color-gray-7)',
                marginBottom: rem(6),
              },
            }}
            {...form.getInputProps('email')}
          />

          <Stack gap='xs'>
            <PasswordInput
              label='Password'
              placeholder='Enter your password'
              leftSection={
                <ThemeIcon size={20} radius='xl' color='orange' variant='light'>
                  <IconLock size={12} />
                </ThemeIcon>
              }
              styles={{
                input: {
                  borderRadius: rem(12),
                  border: '2px solid var(--mantine-color-gray-3)',
                  paddingLeft: rem(45),
                  '&:focus': {
                    borderColor: 'var(--mantine-color-green-5)',
                    boxShadow: '0 0 0 2px var(--mantine-color-green-1)',
                  },
                },
                label: {
                  fontWeight: 600,
                  color: 'var(--mantine-color-gray-7)',
                  marginBottom: rem(6),
                },
              }}
              {...form.getInputProps('password')}
            />

            <Group justify='flex-end'>
              <Anchor
                component={Link}
                to='/auth/forgot-password'
                size='sm'
                c='green.6'
                fw={500}
                style={{ textDecoration: 'none' }}
              >
                Forgot password?
              </Anchor>
            </Group>
          </Stack>

          <Button
            type='submit'
            loading={mutation.isPending}
            size='lg'
            radius='xl'
            variant='gradient'
            gradient={{ from: 'green', to: 'teal' }}
            leftSection={<IconLogin size={18} />}
            style={{
              height: rem(50),
              fontSize: rem(16),
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
            }}
            fullWidth
          >
            Sign In
          </Button>

          {/* Register Link */}
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
              New to the platform?{' '}
              <Anchor component={Link} to='/auth/register' c='green.6' fw={600} style={{ textDecoration: 'none' }}>
                Create Account
              </Anchor>
            </Text>
          </Paper>
        </Stack>
      </form>

      {/* CSS Animation */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </Paper>
  );
}
