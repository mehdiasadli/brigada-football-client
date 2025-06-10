import { useForm } from '@mantine/form';
import { resetPasswordSchema, type ResetPasswordSchema } from '../schemas/auth.schema';
import { Anchor, Button, Paper, PasswordInput, Stack, Text, Title, ThemeIcon, Box, rem, Group } from '@mantine/core';
import { zodResolver } from 'mantine-form-zod-resolver';
import { Link, useSearchParams } from 'react-router-dom';
import { useResetPassword } from '../api/auth/auth.mutations';
import { IconLock, IconArrowLeft, IconShieldCheck } from '@tabler/icons-react';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();

  const form = useForm<ResetPasswordSchema>({
    initialValues: {
      password: '',
      confirmPassword: '',
      token: searchParams.get('token') ?? '',
    },
    validate: zodResolver(resetPasswordSchema),
  });

  const mutation = useResetPassword();
  const onSubmit = (values: ResetPasswordSchema) => {
    mutation.mutate(values);
  };

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
      }}
    >
      {/* Header Section */}
      <Stack align='center' gap='lg' mb='xl'>
        <Box
          style={{
            position: 'relative',
            background: 'linear-gradient(135deg, var(--mantine-color-violet-6) 0%, var(--mantine-color-indigo-6) 100%)',
            borderRadius: '50%',
            width: rem(60),
            height: rem(60),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)',
          }}
        >
          <IconShieldCheck size={40} color='white' />

          {/* Shield Pulse */}
          <Box
            style={{
              position: 'absolute',
              top: rem(-8),
              left: rem(-8),
              right: rem(-8),
              bottom: rem(-8),
              border: '2px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '50%',
              animation: 'shieldPulse 2.5s ease-in-out infinite',
            }}
          />
        </Box>

        <Stack align='center' gap='xs'>
          <Title order={2} fw={800} c='gray.8'>
            Reset Password
          </Title>
          <Text size='md' c='gray.6' ta='center' maw={300}>
            Create a new secure password for your account
          </Text>
        </Stack>
      </Stack>

      {/* Form */}
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack gap='lg'>
          <PasswordInput
            label='New Password'
            placeholder='Enter new password'
            leftSection={
              <ThemeIcon size={20} radius='xl' color='violet' variant='light'>
                <IconLock size={12} />
              </ThemeIcon>
            }
            styles={{
              input: {
                borderRadius: rem(12),
                border: '2px solid var(--mantine-color-gray-3)',
                paddingLeft: rem(45),
                '&:focus': {
                  borderColor: 'var(--mantine-color-violet-5)',
                  boxShadow: '0 0 0 2px var(--mantine-color-violet-1)',
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

          <PasswordInput
            label='Confirm New Password'
            placeholder='Confirm new password'
            leftSection={
              <ThemeIcon size={20} radius='xl' color='violet' variant='light'>
                <IconLock size={12} />
              </ThemeIcon>
            }
            styles={{
              input: {
                borderRadius: rem(12),
                border: '2px solid var(--mantine-color-gray-3)',
                paddingLeft: rem(45),
                '&:focus': {
                  borderColor: 'var(--mantine-color-violet-5)',
                  boxShadow: '0 0 0 2px var(--mantine-color-violet-1)',
                },
              },
              label: {
                fontWeight: 600,
                color: 'var(--mantine-color-gray-7)',
                marginBottom: rem(6),
              },
            }}
            {...form.getInputProps('confirmPassword')}
          />

          <Button
            type='submit'
            loading={mutation.isPending}
            size='lg'
            radius='xl'
            variant='gradient'
            gradient={{ from: 'violet', to: 'purple' }}
            leftSection={<IconShieldCheck size={18} />}
            style={{
              height: rem(50),
              fontSize: rem(16),
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
            }}
            fullWidth
          >
            Update Password
          </Button>

          {/* Back to Login */}
          <Paper
            p='md'
            radius='lg'
            style={{
              backgroundColor: 'var(--mantine-color-gray-0)',
              border: '1px solid var(--mantine-color-gray-3)',
              textAlign: 'center',
            }}
          >
            <Anchor component={Link} to='/auth' style={{ textDecoration: 'none' }}>
              <Group justify='center' gap='xs'>
                <IconArrowLeft size={16} />
                <Text size='sm' fw={600} c='gray.7'>
                  Back to Sign In
                </Text>
              </Group>
            </Anchor>
          </Paper>
        </Stack>
      </form>

      {/* CSS Animation */}
      <style>
        {`
          @keyframes shieldPulse {
            0%, 100% { opacity: 0.4; transform: scale(1) rotate(0deg); }
            50% { opacity: 0.7; transform: scale(1.05) rotate(5deg); }
          }
        `}
      </style>
    </Paper>
  );
}
