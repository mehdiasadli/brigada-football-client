import { useForm } from '@mantine/form';
import { forgotPasswordSchema, type ForgotPasswordSchema } from '../schemas/auth.schema';
import { Anchor, Button, Paper, Stack, Text, TextInput, Title, ThemeIcon, Box, rem, Group } from '@mantine/core';
import { zodResolver } from 'mantine-form-zod-resolver';
import { Link } from 'react-router-dom';
import { useForgotPassword } from '../api/auth/auth.mutations';
import { IconMail, IconArrowLeft, IconLockOpen } from '@tabler/icons-react';

export default function ForgotPasswordPage() {
  const form = useForm<ForgotPasswordSchema>({
    initialValues: {
      email: '',
    },
    validate: zodResolver(forgotPasswordSchema),
  });

  const mutation = useForgotPassword();
  const onSubmit = (values: ForgotPasswordSchema) => {
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
            background: 'linear-gradient(135deg, var(--mantine-color-orange-6) 0%, var(--mantine-color-red-6) 100%)',
            borderRadius: '50%',
            width: rem(60),
            height: rem(60),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(249, 115, 22, 0.3)',
          }}
        >
          <IconLockOpen size={40} color='white' />

          {/* Breathing Effect */}
          <Box
            style={{
              position: 'absolute',
              top: rem(-8),
              left: rem(-8),
              right: rem(-8),
              bottom: rem(-8),
              border: '2px solid rgba(249, 115, 22, 0.3)',
              borderRadius: '50%',
              animation: 'breathe 3s ease-in-out infinite',
            }}
          />
        </Box>

        <Stack align='center' gap='xs'>
          <Title order={2} fw={800} c='gray.8'>
            Forgot Password?
          </Title>
          <Text size='md' c='gray.6' ta='center' maw={320}>
            No worries! Enter your email address and we'll send you a link to reset your password.
          </Text>
        </Stack>
      </Stack>

      {/* Form */}
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack gap='lg'>
          <TextInput
            label='Email Address'
            placeholder='Enter your email address'
            leftSection={
              <ThemeIcon size={20} radius='xl' color='orange' variant='light'>
                <IconMail size={12} />
              </ThemeIcon>
            }
            styles={{
              input: {
                borderRadius: rem(12),
                border: '2px solid var(--mantine-color-gray-3)',
                paddingLeft: rem(45),
                '&:focus': {
                  borderColor: 'var(--mantine-color-orange-5)',
                  boxShadow: '0 0 0 2px var(--mantine-color-orange-1)',
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

          <Button
            type='submit'
            loading={mutation.isPending}
            size='lg'
            radius='xl'
            variant='gradient'
            gradient={{ from: 'orange', to: 'red' }}
            leftSection={<IconMail size={18} />}
            style={{
              height: rem(50),
              fontSize: rem(16),
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)',
            }}
            fullWidth
          >
            Send Reset Link
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
          @keyframes breathe {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.1); }
          }
        `}
      </style>
    </Paper>
  );
}
