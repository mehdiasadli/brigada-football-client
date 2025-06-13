import { Box, Group, ThemeIcon } from '@mantine/core';
import type { FeedMatchResponse } from '../api/feed/feed.responses';
import { IconCalendar, IconClock } from '@tabler/icons-react';
import { Text } from '@mantine/core';
import dayjs from 'dayjs';
import MatchHeader from './match-header';
import { getWeatherCondition } from '../resources/weather-map';
import FeedCardWrapper from './feed-card-wrapper';
import { Link } from 'react-router-dom';
import type { FindOneMatchResponse } from '../api/matches/matches.responses';

interface FeedMatchCard {
  match: FeedMatchResponse;
}

export default function FeedMatchCard({ match }: FeedMatchCard) {
  const weatherCondition = getWeatherCondition(match.weatherCondition);

  return (
    <FeedCardWrapper author={match.creator} createdAt={match.createdAt}>
      <Box component={Link} to={`/matches/${match.id}`} style={{ textDecoration: 'none' }}>
        <MatchHeader match={match as unknown as FindOneMatchResponse} asPost />
      </Box>

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
    </FeedCardWrapper>
  );
}
