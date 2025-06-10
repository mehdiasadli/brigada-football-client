import { Anchor, Stack, Text, Button, Paper, Title, ThemeIcon, Box, rem, Group, Progress } from '@mantine/core';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useCountdown } from '../hooks/use-countdown';
import { useResendVerificationEmail } from '../api/auth/auth.mutations';
import LoadingComponent from '../components/loading-component';
import { useEffect } from 'react';
import { notifications } from '@mantine/notifications';
import { useVerifyEmail } from '../api/auth/auth.queries';
import { IconMail, IconMailCheck, IconArrowLeft, IconRefresh } from '@tabler/icons-react';

export default function VerifyEmailPage() {
  const { formattedTime, isFinished, resetAndStart, secondsLeft } = useCountdown({
    autoStart: true,
    startTimeMs: 60 * 1000, // 60 seconds
  });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get('email');
  const token = searchParams.get('token');

  const mutation = useResendVerificationEmail();
  const verifyEmail = useVerifyEmail(token!, decodeURIComponent(email!));

  useEffect(() => {
    if (verifyEmail.data && verifyEmail.isSuccess) {
      navigate('/auth', { replace: true });
      notifications.show({
        title: 'Email verified successfully',
        message: 'You can now login to your account',
        color: 'green',
      });
    }
  }, [verifyEmail, navigate]);

  const handleResend = () => {
    if (!email) return;

    mutation.mutate(
      {
        email: decodeURIComponent(email),
      },
      {
        onSuccess() {
          resetAndStart();
        },
      }
    );
  };

  if (!email) {
    return <Navigate to='/auth' replace />;
  }

  if (token) {
    return <LoadingComponent />;
  }

  const progressValue = isFinished ? 100 : ((60 - secondsLeft) / 60) * 100;

  return (
    <Paper
      shadow='2xl'
      radius='xl'
      p='xl'
      style={{
        width: 'min(90vw, 500px)',
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
            background: 'linear-gradient(135deg, var(--mantine-color-cyan-6) 0%, var(--mantine-color-blue-6) 100%)',
            borderRadius: '50%',
            width: rem(60),
            height: rem(60),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(6, 182, 212, 0.3)',
          }}
        >
          <IconMailCheck size={40} color='white' />

          {/* Mail Float Animation */}
          <Box
            style={{
              position: 'absolute',
              top: rem(-8),
              left: rem(-8),
              right: rem(-8),
              bottom: rem(-8),
              border: '2px solid rgba(6, 182, 212, 0.3)',
              borderRadius: '50%',
              animation: 'mailFloat 3s ease-in-out infinite',
            }}
          />
        </Box>

        <Stack align='center' gap='xs'>
          <Title order={2} fw={800} c='gray.8'>
            Check Your Email
          </Title>
          <Text size='md' c='gray.6' ta='center' maw={400}>
            We've sent a verification link to
          </Text>
          <Text size='md' fw={600} c='cyan.7' ta='center'>
            {decodeURIComponent(email)}
          </Text>
        </Stack>
      </Stack>

      {/* Instructions */}
      <Paper
        p='lg'
        radius='lg'
        mb='lg'
        style={{
          backgroundColor: 'var(--mantine-color-cyan-0)',
          border: '1px solid var(--mantine-color-cyan-2)',
        }}
      >
        <Group gap='sm' mb='sm'>
          <ThemeIcon size={20} radius='xl' color='cyan' variant='filled'>
            <IconMail size={12} />
          </ThemeIcon>
          <Text size='sm' fw={600} c='cyan.8'>
            Next Steps
          </Text>
        </Group>

        <Stack gap='xs'>
          <Text size='sm' c='gray.7'>
            • Check your inbox for our verification email
          </Text>
          <Text size='sm' c='gray.7'>
            • Click the verification link in the email
          </Text>
          <Text size='sm' c='gray.7'>
            • If you don't see it, check your spam folder
          </Text>
        </Stack>
      </Paper>

      {/* Resend Section */}
      <Stack gap='lg'>
        {!isFinished && (
          <Box>
            <Group justify='space-between' mb='xs'>
              <Text size='sm' c='gray.6'>
                Resend available in
              </Text>
              <Text size='sm' fw={600} c='cyan.7'>
                {formattedTime}
              </Text>
            </Group>
            <Progress
              value={progressValue}
              size='sm'
              radius='xl'
              color='cyan'
              style={{
                backgroundColor: 'var(--mantine-color-gray-2)',
              }}
            />
          </Box>
        )}

        {isFinished ? (
          <Button
            onClick={handleResend}
            loading={mutation.isPending}
            size='lg'
            radius='xl'
            variant='gradient'
            gradient={{ from: 'cyan', to: 'blue' }}
            leftSection={<IconRefresh size={18} />}
            style={{
              height: rem(50),
              fontSize: rem(16),
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)',
            }}
            fullWidth
          >
            Resend Verification Email
          </Button>
        ) : (
          <Button
            variant='light'
            color='gray'
            size='lg'
            radius='xl'
            disabled
            style={{
              height: rem(50),
              fontSize: rem(16),
            }}
            fullWidth
          >
            Resend
          </Button>
        )}

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

      {/* CSS Animation */}
      <style>
        {`
          @keyframes mailFloat {
            0%, 100% { opacity: 0.3; transform: scale(1) translateY(0px); }
            50% { opacity: 0.6; transform: scale(1.05) translateY(-2px); }
          }
        `}
      </style>
    </Paper>
  );
}
