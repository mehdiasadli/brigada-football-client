import { Title, Button, Group, Text, Stack, SimpleGrid, Box, rem, ThemeIcon, Paper } from '@mantine/core';
import { IconPlus, IconMapPin } from '@tabler/icons-react';
import InfiniteList from '../components/infinite-list';
import { Link } from 'react-router-dom';
import { usePosts } from '../api/posts/posts.queries';
import { useDashboardStats } from '../api/dashboard/dashboard.queries';
import PostCard from '../components/post-card';

export default function DashboardPostsPage() {
  const result = usePosts(
    {
      limit: 6,
    },
    {
      orderBy: 'createdAt',
      orderDir: 'desc',
    }
  );

  const { data: stats } = useDashboardStats();

  return (
    <Stack gap='xl'>
      {/* Header */}
      <Group justify='space-between' align='center'>
        <Box>
          <Title
            order={1}
            size='h2'
            style={{
              background: 'linear-gradient(135deg, var(--mantine-color-green-6), var(--mantine-color-teal-6))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Posts Management
          </Title>
          <Text c='dimmed' size='md' mt={rem(4)}>
            Manage posts, comments, and likes
          </Text>
        </Box>

        <Button leftSection={<IconPlus size={16} />} color='green' component={Link} to='/posts/create'>
          Add New Post
        </Button>
      </Group>

      {/* Summary Stats */}
      <SimpleGrid cols={{ base: 2, md: 4 }} spacing='md'>
        <Paper p='md' radius='md' style={{ border: '1px solid var(--mantine-color-gray-2)' }}>
          <Group gap='xs'>
            <ThemeIcon color='blue' variant='light' size='sm'>
              <IconMapPin size={14} />
            </ThemeIcon>
            <Box>
              <Text size='xl' fw={700} c='blue'>
                {stats?.data.postsStats.totalPosts ?? 0}
              </Text>
              <Text size='xs' c='dimmed'>
                Total Posts
              </Text>
            </Box>
          </Group>
        </Paper>
      </SimpleGrid>

      {/* Venues Grid */}
      <InfiniteList
        result={result}
        render={(post) => <PostCard post={post} />}
        cols={{ base: 1, xs: 1, sm: 2, md: 2, lg: 3, xl: 3 }}
      />
    </Stack>
  );
}
