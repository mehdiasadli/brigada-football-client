import { Anchor, Box, Card, Container, Group, Paper, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { IconTools, IconArrowRight } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

const links = [
  { to: '/fixture', name: 'Fixture', description: 'View the fixture of the upcoming matches' },
  { to: '/results', name: 'Results', description: 'View the results of the finished matches' },
  { to: '/stats', name: 'Stats', description: 'View the stats of the players, matches, teams etc.' },
  { to: '/profile', name: 'Profile', description: 'View your profile and see your stats' },
];

interface UnderConstructionProps {
  page: string;
  description?: string;
}

export default function UnderConstruction({ page, description }: UnderConstructionProps) {
  return (
    <Container size='md' my='xl'>
      <Paper radius='lg' p='xl' withBorder>
        <Stack align='center' gap='xl'>
          <Box
            style={{
              background: 'linear-gradient(135deg, var(--mantine-color-yellow-1) 0%, white 100%)',
              padding: '2rem',
              borderRadius: '1rem',
              width: '100%',
            }}
          >
            <Group gap='md' align='center' justify='center'>
              <ThemeIcon size={48} radius='xl' color='yellow' variant='light'>
                <IconTools size={24} />
              </ThemeIcon>
              <Title ta='center' order={2} c='yellow.9'>
                {page} Page Under Construction
              </Title>
            </Group>
            {description && (
              <Text ta='center' mt='md' c='gray.7' size='lg'>
                {description}
              </Text>
            )}
          </Box>

          {links && links.length > 0 && (
            <Card withBorder radius='md' padding='lg' style={{ width: '100%' }}>
              <Text size='xl' fw={600} mb='md' c='blue.9'>
                Available Pages
              </Text>
              <Stack gap='md'>
                {links.map((link) => (
                  <Paper
                    key={link.to}
                    p='md'
                    withBorder
                    radius='md'
                    style={{
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      ':hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 'var(--mantine-shadow-md)',
                      },
                    }}
                  >
                    <Group justify='space-between' align='center'>
                      <Box>
                        <Anchor component={Link} to={link.to} fw={600} size='lg' style={{ textDecoration: 'none' }}>
                          {link.name}
                        </Anchor>
                        <Text size='sm' c='gray.6' mt={4}>
                          {link.description}
                        </Text>
                      </Box>
                      <ThemeIcon variant='light' size='lg' radius='xl' color='blue'>
                        <IconArrowRight size={20} />
                      </ThemeIcon>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            </Card>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}
