import { ActionIcon, Button, Card, Flex, Indicator, Stack, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconUserPlus, IconUsers, IconUserX } from '@tabler/icons-react';
import { useFriendshipRequests } from '../api/friendships/friendships.queries';
import { notifications } from '@mantine/notifications';
import type { FriendshipRequest } from '../api/friendships/friendships.responses';
import UserPanel from './user-panel';

export default function HeaderFriends() {
  const { data: requests, error: requestsError, isLoading: requestsLoading } = useFriendshipRequests();
  const count = requests?.data?.length ?? 0;

  const openFriendsModal = () => {
    if (requestsError) {
      notifications.show({
        title: 'Error',
        color: 'red',
        message: requestsError.message,
      });
    } else if (!requests || !requests.data) {
      return;
    } else {
      modals.open({
        title: 'Requests',
        children: <FriendsModal requests={requests.data} />,
        size: 'lg',
        radius: 'lg',
        padding: 'lg',
      });
    }
  };

  return (
    <Indicator size={10} color='red' offset={5} disabled={count === 0}>
      <ActionIcon
        loading={requestsLoading}
        size='lg'
        radius='xl'
        variant='white'
        color='green'
        onClick={openFriendsModal}
        style={{
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
          },
        }}
      >
        <IconUsers size={18} />
      </ActionIcon>
    </Indicator>
  );
}

function FriendsModal({ requests }: { requests: FriendshipRequest[] }) {
  if (requests.length === 0)
    return (
      <Text c='dimmed' fz='xs'>
        No requests
      </Text>
    );

  return (
    <Stack>
      {requests.map((request) => (
        <Card key={request.id}>
          <Flex align='center' justify='space-between'>
            <UserPanel user={request.requester} />
            <Stack gap='xs'>
              <Button color='green' radius='xl' leftSection={<IconUserPlus size={20} />}>
                Accept Request
              </Button>
              <Button color='red' variant='outline' size='xs' radius='xl' leftSection={<IconUserX size={20} />}>
                Reject
              </Button>
            </Stack>
          </Flex>
        </Card>
      ))}
    </Stack>
  );
}
