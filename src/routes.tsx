import { Route, Routes as ReactRoutes, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/auth.layout';
import { EnhancedHomeLayout } from './layouts/home.layout';
import HomePage from './pages/home.page';
import ProfilePage from './pages/profile.page';
import LoginPage from './pages/login.page';
import RegisterPage from './pages/register.page';
import ResetPasswordPage from './pages/reset-password.page';
import VerifyEmailPage from './pages/verify-email.page';
import { useTokenStore } from './stores/token.store';
import FixturePage from './pages/fixture.page';
import EditMatchPage from './pages/edit-match.page';
import EditTeamPage from './pages/edit-team.page';
import ResultsPage from './pages/results.page';
import StatsPage from './pages/stats.page';
import CreateFixturePage from './pages/create-fixture.page';
import CreateResultPage from './pages/create-result.page';
import MatchPage from './pages/match.page';
import ForgotPasswordPage from './pages/forgot-password.page';
import ResendVerificationPage from './pages/resend-verification.page';
import CompleteMatchPage from './pages/complete-match.page';
import { useUserStore } from './stores/user.store';
import { UserRole } from './schemas/entities/user.entity';
import { DashboardLayout } from './layouts/dashboard.layout';
import { DashboardPage } from './pages/dashboard.page';
import { DashboardVenuesPage } from './pages/dashboard-venues.page';
import AddVenuePage from './pages/add-venue.page';

export default function Routes() {
  const { token } = useTokenStore();
  const { user } = useUserStore();

  return (
    <ReactRoutes>
      <Route path='/' element={token ? <EnhancedHomeLayout /> : <Navigate to='/auth' replace />}>
        <Route index element={<HomePage />} />
        <Route path='fixture' element={<FixturePage />} />
        <Route path='results' element={<ResultsPage />} />
        <Route path='stats' element={<StatsPage />} />
        <Route path='matches/:matchId' element={<MatchPage />} />
        <Route path='matches/create/fixture' element={<CreateFixturePage />} />
        <Route path='matches/create/result' element={<CreateResultPage />} />
        <Route path='matches/edit/:matchId' element={<EditMatchPage />} />
        <Route path='matches/complete/:matchId' element={<CompleteMatchPage />} />
        <Route path='teams/edit/:teamId' element={<EditTeamPage />} />
        <Route path='users/:username?' element={<ProfilePage />} />
        <Route
          path='dashboard'
          element={
            !user || (user.role !== UserRole.enum.ADMIN && user.role !== UserRole.enum.SUPER_ADMIN) ? (
              <Navigate to='/' replace />
            ) : (
              <DashboardLayout />
            )
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path='venues' element={<DashboardVenuesPage />} />
          <Route path='venues/add' element={<AddVenuePage />} />
        </Route>
      </Route>
      <Route path='/auth' element={!token ? <AuthLayout /> : <Navigate to='/' replace />}>
        <Route index element={<LoginPage />} />
        <Route path='register' element={<RegisterPage />} />
        <Route path='reset-password' element={<ResetPasswordPage />} />
        <Route path='verify-email' element={<VerifyEmailPage />} />
        <Route path='forgot-password' element={<ForgotPasswordPage />} />
        <Route path='resend-verification' element={<ResendVerificationPage />} />
      </Route>
    </ReactRoutes>
  );
}
