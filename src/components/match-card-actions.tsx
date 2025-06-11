import { Group, ActionIcon, Tooltip } from '@mantine/core';
import { IconEdit, IconTrash, IconTrophy } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { modals } from '@mantine/modals';
import type { FindAllMatchesResponse } from '../api/matches/matches.responses';
import { useDeleteMatch } from '../api/matches/matches.mutations';
import { useUserStore } from '../stores/user.store';
import { MatchStatus } from '../schemas/entities/match.entity';

interface MatchCardActionsProps {
  match: FindAllMatchesResponse;
}

export default function MatchCardActions({ match }: MatchCardActionsProps) {
  const user = useUserStore((state) => state.user);
  const isCreator = match.creatorId === user?.id;

  const mutation = useDeleteMatch();

  const openDeleteModal = () => {
    modals.openConfirmModal({
      title: 'Delete Match',
      children: 'Are you sure you want to delete this match? This action cannot be undone.',
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: {
        color: 'red',
        loading: mutation.isPending,
        variant: 'filled',
      },
      cancelProps: { variant: 'light' },
      zIndex: 10000,
      onConfirm: () => {
        mutation.mutate(match.id);
        modals.closeAll();
      },
    });
  };

  return isCreator ? (
    <Group gap='xs'>
      {match.status === MatchStatus.enum.PENDING && (
        <Tooltip label='Complete Match'>
          <ActionIcon
            component={Link}
            to={`/matches/complete/${match.id}`}
            variant='light'
            color='green'
            size='lg'
            radius='xl'
            style={{
              transition: 'all 0.2s ease',
              '&:hover': { transform: 'scale(1.1)' },
            }}
          >
            <IconTrophy size={16} />
          </ActionIcon>
        </Tooltip>
      )}

      <Tooltip label='Edit Match'>
        <ActionIcon
          component={Link}
          to={`/matches/edit/${match.id}`}
          variant='light'
          color='blue'
          size='lg'
          radius='xl'
          style={{
            transition: 'all 0.2s ease',
            '&:hover': { transform: 'scale(1.1)' },
          }}
        >
          <IconEdit size={16} />
        </ActionIcon>
      </Tooltip>

      <Tooltip label='Delete Match'>
        <ActionIcon
          onClick={openDeleteModal}
          variant='light'
          color='red'
          size='lg'
          radius='xl'
          style={{
            transition: 'all 0.2s ease',
            '&:hover': { transform: 'scale(1.1)' },
          }}
        >
          <IconTrash size={16} />
        </ActionIcon>
      </Tooltip>
    </Group>
  ) : null;
}
