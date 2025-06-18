import { useState } from 'react';
import { ActionIcon, ThemeIcon } from '@mantine/core';
import { Spotlight, spotlight } from '@mantine/spotlight';
import { useDebouncedValue, useHotkeys } from '@mantine/hooks';
import { IconSearch, IconUser, IconMessageCircle, IconMapPin } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../api/search/search.queries';
import { isSearchPost, isSearchUser, isSearchVenue, type SearchResponse } from '../api/search/search.responses';
import dayjs from 'dayjs';

export default function HeaderSearchBar() {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(query, 300);
  const { data: results, isLoading } = useSearch(debouncedQuery);

  const navigate = useNavigate();

  // Keyboard shortcuts
  useHotkeys([
    ['mod+K', () => spotlight.open()],
    ['mod+/', () => spotlight.open()],
    ['Escape', () => spotlight.close()],
  ]);

  const getResultIcon = (type: SearchResponse['type']) => {
    switch (type) {
      case 'user':
        return <IconUser size={16} />;
      case 'post':
        return <IconMessageCircle size={16} />;
      case 'venue':
        return <IconMapPin size={16} />;
      // case 'match':
      //   return <IconTrophy size={16} />;
      default:
        return <IconSearch size={16} />;
    }
  };

  const getResultColor = (type: SearchResponse['type']) => {
    switch (type) {
      case 'user':
        return 'blue';
      case 'post':
        return 'yellow';
      case 'venue':
        return 'violet';
      // case 'match':
      //   return 'orange';
      default:
        return 'gray';
    }
  };

  const handleResultClick = (result: SearchResponse) => {
    if (isSearchUser(result)) {
      navigate(`/users/${result.item.username}`);
    } else if (isSearchPost(result)) {
      navigate(`/posts/c/${result.item.id}`);
    } else if (isSearchVenue(result)) {
      navigate(`/venues/${result.item.id}`);
    }
  };

  const getLabel = (result: SearchResponse) => {
    if (isSearchUser(result)) {
      return result.item.firstName + ' ' + result.item.lastName;
    } else if (isSearchPost(result)) {
      return result.item.content.slice(0, 50) + '...';
    } else if (isSearchVenue(result)) {
      return result.item.name;
    } else {
      return '';
    }
  };

  const getDescription = (result: SearchResponse) => {
    if (isSearchUser(result)) {
      return `@${result.item.username}`;
    } else if (isSearchPost(result)) {
      return `Posted by ${result.item.author.firstName} ${result.item.author.lastName} on ${dayjs(result.item.createdAt).format('DD.MM.YYYY')}`;
    } else if (isSearchVenue(result)) {
      return `Located at ${result.item.address}`;
    } else {
      return '';
    }
  };

  return (
    <>
      <ActionIcon
        size='lg'
        radius='xl'
        variant='white'
        color='green'
        onClick={() => spotlight.open()}
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
        <IconSearch size={18} />
      </ActionIcon>

      {/* Spotlight Modal for Mobile */}
      <Spotlight
        actions={(results?.data ?? [])?.map((result) => ({
          id: result.item.id,
          label: getLabel(result),
          description: getDescription(result),
          onClick: () => handleResultClick(result),
          leftSection: (
            <ThemeIcon size='md' radius='xl' color={getResultColor(result.type)} variant='light'>
              {getResultIcon(result.type)}
            </ThemeIcon>
          ),
        }))}
        nothingFound={isLoading ? 'Loading...' : 'No results found...'}
        highlightQuery
        onQueryChange={setQuery}
        searchProps={{
          leftSection: <IconSearch size={20} />,
          placeholder: 'Search users, posts or venues...',
          value: query,
          onChange: (event) => setQuery(event.currentTarget.value),
        }}
      />

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </>
  );
}
