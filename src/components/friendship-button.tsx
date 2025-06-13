import { Button, Stack } from '@mantine/core';
import { FriendshipStatus } from '../schemas/entities/friendship.entity';
import { IconUserPlus, IconUserX } from '@tabler/icons-react';
import {
  useAcceptFriendshipRequest,
  useCancelFriendshipRequest,
  useRejectFriendshipRequest,
  useSendFriendshipRequest,
} from '../api/friendships/friendships.mutations';
import type { FriendshipData } from '../api/users/users.responses';
import { useUserStore } from '../stores/user.store';

export default function FriendshipButton({
  friendship,
  username,
  userId,
}: {
  friendship: FriendshipData;
  username: string;
  userId: string;
}) {
  const currentUser = useUserStore((state) => state.user)!;
  const sendMutation = useSendFriendshipRequest(username);
  const cancelMutation = useCancelFriendshipRequest(username);
  const acceptMutation = useAcceptFriendshipRequest(username);
  const rejectMutation = useRejectFriendshipRequest(username);

  const handleSend = () => {
    sendMutation.mutate(userId);
  };

  const handleCancel = (id: string) => {
    cancelMutation.mutate(id);
  };

  const handleAccept = (id: string) => {
    acceptMutation.mutate(id);
  };

  const handleReject = (id: string) => {
    rejectMutation.mutate(id);
  };

  if (!friendship) {
    return (
      <Button onClick={handleSend} variant='white' size='xl' radius='xl' leftSection={<IconUserPlus size={20} />}>
        Add Friend
      </Button>
    );
  }

  const { status, side, id: friendshipId } = friendship;

  if (status === FriendshipStatus.enum.PENDING) {
    return side === 'requester' ? (
      <Button
        onClick={() => handleCancel(friendshipId)}
        color='orange'
        variant='white'
        size='xl'
        radius='xl'
        leftSection={<IconUserX size={20} />}
      >
        Cancel Request
      </Button>
    ) : (
      <Stack>
        <Button
          onClick={() => handleAccept(friendshipId)}
          color='green'
          variant='white'
          size='xl'
          radius='xl'
          leftSection={<IconUserPlus size={20} />}
        >
          Accept Request
        </Button>
        <Button
          onClick={() => handleReject(friendshipId)}
          color='white'
          variant='transparent'
          size='xs'
          radius='xl'
          leftSection={<IconUserX size={20} />}
        >
          Reject
        </Button>
      </Stack>
    );
  }

  if (status === FriendshipStatus.enum.CANCELED || status === FriendshipStatus.enum.REJECTED) {
    return (
      <Button onClick={handleSend} variant='white' size='xl' radius='xl' leftSection={<IconUserPlus size={20} />}>
        Add Friend
      </Button>
    );
  }

  if (status === FriendshipStatus.enum.ACCEPTED) {
    return (
      <Button
        onClick={() => handleReject(friendshipId)}
        color='red'
        variant='white'
        size='xl'
        radius='xl'
        leftSection={<IconUserX size={20} />}
      >
        Unfriend
      </Button>
    );
  }

  return null;
}

/*

status: "CANCELED", side: "requester" // Add Friend
status: "CANCELED", side: "receiver" // Add Friend
status: "REJECTED", side: "requester" // Add Friend
status: "REJECTED", side: "receiver" // Add Friend

status: "PENDING", side: "requester" // Cancel Request

status: "PENDING", side: "receiver" // Accept Request or Reject Request

status: "ACCEPTED", side: "requester" // Unfriend
status: "ACCEPTED", side: "receiver" // Unfriend

*/
