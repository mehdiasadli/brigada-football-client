import { Card, Group, Stack, ThemeIcon } from '@mantine/core';
import type { FeedMatchResponse } from '../api/feed/feed.responses';
import { IconCalendar, IconClock } from '@tabler/icons-react';
import { Text } from '@mantine/core';
import dayjs from 'dayjs';
import UserPanel from './user-panel';
import MatchHeader from './match-header';
import { getWeatherCondition } from '../resources/weather-map';

interface FeedMatchCard {
  match: FeedMatchResponse;
}

export default function FeedMatchCard({ match }: FeedMatchCard) {
  const weatherCondition = getWeatherCondition(match.weatherCondition);

  return (
    <Card
      shadow='lg'
      radius='xl'
      p='xl'
      withBorder
      style={{
        background: 'linear-gradient(135deg, white 0%, var(--mantine-color-gray-0) 100%)',
        border: '2px solid var(--mantine-color-gray-2)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      <Stack gap='lg'>
        {/* Creator section */}
        <Group>
          <UserPanel user={match.creator} />
        </Group>

        <MatchHeader match={match} asPost />

        <Group justify='space-between' align='center'>
          <Group gap='xs'>
            <ThemeIcon size={24} radius='xl' color='green' variant='light'>
              <IconCalendar size={14} />
            </ThemeIcon>
            <Text size='sm' fw={600} c='gray.7'>
              {dayjs(match.startTime).format('D MMM YYYY')}
            </Text>
          </Group>

          <Group gap='xs'>
            <ThemeIcon size={24} radius='xl' color='blue' variant='light'>
              <IconClock size={14} />
            </ThemeIcon>
            <Text size='sm' fw={600} c='gray.7'>
              {dayjs(match.startTime).format('h:mm A')}
            </Text>
          </Group>

          <Group gap='xs'>
            <Text size='sm' fw={600} c='gray.7'>
              {match.duration} minutes
            </Text>
            <ThemeIcon size={24} radius='xl' color='blue' variant='light'>
              <IconClock size={14} />
            </ThemeIcon>
          </Group>

          {match.weatherCondition && (
            <Group gap='xs'>
              <Text size='sm' fw={600} c='gray.7'>
                {weatherCondition.label}
              </Text>
              <ThemeIcon size={24} radius='xl' color={weatherCondition.color} variant='light'>
                <weatherCondition.icon size={14} />
              </ThemeIcon>
            </Group>
          )}
        </Group>
      </Stack>
    </Card>
  );
}
