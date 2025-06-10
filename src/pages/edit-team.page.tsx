// import { useParams } from 'react-router-dom';
// import { Container } from '@mantine/core';
// import { useTeam } from '../api/teams/teams.queries';
// import ErrorComponent from '../components/error-component';
// import LoadingComponent from '../components/loading-component';
// import EditTeamForm from '../components/edit-team.form';
import UnderConstruction from '../components/under-construction';

export default function EditTeamPage() {
  return (
    <UnderConstruction
      page='Edit Team'
      description='This page will be used for editing the team data and players information. Right now, you have to be careful when creating a new match, team and players, because the data cannot be edited yet.'
    />
  );

  // const { teamId } = useParams() as { teamId: string };
  // const { data, error } = useTeam(teamId);

  // if (error) {
  //   return (
  //     <Container size='md' py='xl'>
  //       <ErrorComponent error={error} />
  //     </Container>
  //   );
  // }

  // if (!data || !data.data) {
  //   return (
  //     <Container size='md' py='xl'>
  //       <LoadingComponent />
  //     </Container>
  //   );
  // }

  // const team = data.data;

  // return <EditTeamForm team={team} status={team.match.status} />;
}
