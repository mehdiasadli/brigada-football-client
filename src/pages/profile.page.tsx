import { useParams } from 'react-router-dom';
import { useProfile } from '../api/users/users.queries';
import LoadingComponent from '../components/loading-component';
import ErrorComponent from '../components/error-component';
import { Stack, Container, Paper, Text, Group, ThemeIcon, SimpleGrid, Title } from '@mantine/core';
import { IconCalendar, IconUsers, IconMessage } from '@tabler/icons-react';
import dayjs from 'dayjs';
import InfiniteList from '../components/infinite-list';
import { usePostsOfUser } from '../api/posts/posts.queries';
import FeedPostCard from '../components/feed-post-card';
import { useUserStore } from '../stores/user.store';
import ProfileHeader from '../components/profile-header';
import UserPerformanceStats from '../components/user-stats';

export default function ProfilePage() {
  const { username } = useParams();
  const { data: profile, status: profileStatus, error: profileError } = useProfile(username);
  const currentUser = useUserStore((state) => state.user)!;
  const posts = usePostsOfUser(username ?? currentUser.username);

  if (profileStatus === 'pending') {
    return <LoadingComponent />;
  }

  if (!profile || !profile.data) {
    return <ErrorComponent error={profileError?.message} />;
  }

  const user = profile.data;

  return (
    <Container size='lg' py='xl'>
      <Stack gap='xl'>
        {/* Profile Header */}
        <ProfileHeader user={user} />

        {/* Statistics Section */}
        <UserPerformanceStats userId={user.id} />

        {/* Personal Information */}
        <Stack gap='lg'>
          <Group align='center' gap='sm'>
            <ThemeIcon size={32} radius='xl' color='blue' variant='light'>
              <IconUsers size={18} />
            </ThemeIcon>
            <Title order={3} fw={700} c='gray.8'>
              Personal Information
            </Title>
          </Group>

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing='lg'>
            <Paper p='lg' radius='xl' withBorder>
              <Stack gap='md'>
                <Group gap='xs'>
                  <IconCalendar size={16} color='var(--mantine-color-gray-6)' />
                  <Text size='sm' fw={600} c='gray.7'>
                    Age
                  </Text>
                </Group>
                <Text size='lg' fw={600} c='gray.8'>
                  {dayjs().diff(dayjs(user.dateOfBirth), 'year')} years old
                </Text>
              </Stack>
            </Paper>
          </SimpleGrid>
        </Stack>

        <Stack gap='lg'>
          <Group align='center' gap='sm'>
            <ThemeIcon size={32} radius='xl' color='blue' variant='light'>
              <IconMessage size={18} />
            </ThemeIcon>
            <Title order={3} fw={700} c='gray.8'>
              Posts
            </Title>
          </Group>

          <InfiniteList
            result={posts}
            render={(post) => <FeedPostCard post={post} />}
            cols={{
              base: 1,
              xs: 1,
              sm: 2,
              md: 2,
              lg: 2,
              xl: 2,
            }}
          />
        </Stack>
      </Stack>
    </Container>
  );
}
