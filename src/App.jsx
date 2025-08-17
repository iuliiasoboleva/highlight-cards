import React from 'react';
import { useSelector } from 'react-redux';
import {
  Navigate,
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
  useParams,
} from 'react-router-dom';

import MainLayout from './MainLayout';
import PlanGate from './PlanGate';
import AuthForm from './components/AuthForm';
import NotFound from './components/NotFound';
import ScrollToTop from './components/ScrollToTop';
import { ToastProvider } from './components/Toast';
import AuthLayout from './layouts/AuthLayout';
import AuthRedirectGuard from './pages/AuthRedirectGuard';
import CardDetails from './pages/CardDetails';
import CardStats from './pages/CardStats';
import Cards from './pages/Cards';
import ClientDetails from './pages/ClientDetails';
import Clients from './pages/Clients';
import ClientsLayout from './pages/ClientsLayout';
import CustomerPage from './pages/CustomerPage';
import DefaultCardInfo from './pages/DefaultCardInfo';
import EditDesign from './pages/EditDesign';
import EditInfo from './pages/EditInfo';
import EditSettings from './pages/EditSettings';
import EditType from './pages/EditType';
import GetPassPage from './pages/GetPassPage';
import Home from './pages/Home';
import Locations from './pages/Locations';
import LoginVerify from './pages/LoginVerify';
import MailingDetails from './pages/MailingDetails';
import Mailings from './pages/Mailings';
import MailingsAutoPush from './pages/MailingsAutoPush';
import MailingsInfo from './pages/MailingsInfo';
import MailingsPush from './pages/MailingsPush';
import MailingsSettings from './pages/MailingsSettings';
import MailingsUserPush from './pages/MailingsUserPush';
import Managers from './pages/Managers';
import PersonalClientInfo from './pages/PersonalClientInfo';
import ResetPin from './pages/ResetPin';
import ScanPage from './pages/ScanPage';
import SetPin from './pages/SetPin';
import Settings from './pages/Settings';
import SettingsArchive from './pages/SettingsArchive';
import SettingsLayout from './pages/SettingsLayout';
import SettingsPersonal from './pages/SettingsPersonal';
import SettingsRFMSegment from './pages/SettingsRFMSegment';
import SmsLogin from './pages/SmsLogin';
import Workplace from './pages/Workplace';
import { GlobalStyle } from './styles/GlobalStyle';

const App = () => {
  const user = useSelector((state) => state.user);

  return (
    <ToastProvider>
      <Router>
        <ScrollToTop />
        <GlobalStyle />
        <AuthRedirectGuard>
          <Routes>
            <Route
              path="/auth"
              element={
                <AuthLayout>
                  <AuthForm />
                </AuthLayout>
              }
            />
            <Route path="/login" element={<LoginVerify />} />
            <Route path="/reset-pin" element={<ResetPin />} />
            <Route path="/sms-code" element={<SmsLogin />} />
            <Route path="/set-pin" element={<SetPin />} />

            <Route element={<PlanGate />}>
              <Route element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="/cards" element={<Cards />} />
                <Route path="/scan" element={<ScanPage />} />
                <Route path="/workplace" element={<Workplace />} />

                <Route path="/cards/create" element={<EditType />} />
                <Route path="/cards/template" element={<Cards />} />
                <Route path="/mailings" element={<Mailings />}>
                  <Route path="info" element={<MailingsInfo />} />
                  <Route path="push" element={<MailingsPush />} />
                  <Route path="auto-push" element={<MailingsAutoPush />} />
                  <Route path="user-push" element={<MailingsUserPush />} />
                  <Route path="settings" element={<MailingsSettings />} />
                  <Route path="archive" element={<NotFound />} />
                  <Route path=":mailingId" element={<MailingDetails />} />
                </Route>

                <Route path="/cards/:id/edit" element={<CardEditGuard />}>
                  <Route path="type" element={<EditType />} />
                  <Route path="settings" element={<EditSettings />} />
                  <Route path="design" element={<EditDesign />} />
                  <Route path="info" element={<EditInfo />} />
                </Route>

                <Route path="/settings" element={<SettingsLayout />}>
                  <Route index element={<Settings />} />
                  <Route path="archive" element={<SettingsArchive />} />
                </Route>

                <Route path="/cards/:id" element={<CardDetails />}>
                  <Route path="info" element={<DefaultCardInfo />} />
                  <Route path="clients" element={<Clients />} />
                  <Route path="push" element={<MailingsPush />} />
                  <Route path="stats" element={<CardStats />} />
                </Route>

                <Route
                  path="/managers"
                  element={user.role === 'employee' ? <Workplace /> : <Managers />}
                />
                <Route path="/locations" element={<Locations />} />
                <Route path="/profile" element={<SettingsPersonal />} />
                <Route path="/clients" element={<ClientsLayout />}>
                  <Route path="rfm-segment" element={<SettingsRFMSegment />} />
                  <Route index element={<Clients />} />
                  <Route path="reviews" element={<NotFound />} />
                  <Route path=":id" element={<ClientDetails />} />
                  <Route path=":id/push" element={<MailingsPush />} />
                  <Route path=":id/edit" element={<PersonalClientInfo />} />
                  <Route path=":id/reviews" element={<NotFound />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Route>
            </Route>

            <Route path="/customer/card/:cardNumber" element={<CustomerPage />} />
            <Route path="/getpass/:cardId" element={<GetPassPage />} />
          </Routes>
        </AuthRedirectGuard>
      </Router>
    </ToastProvider>
  );
};

export default App;

const CardEditGuard = () => {
  const params = useParams();
  const currentId = useSelector((state) => state.cards.currentCard?.id);

  if (!params.id) {
    return <Navigate to="/cards" replace />;
  }

  if (!currentId || String(currentId) !== params.id) {
    return <Navigate to="/cards" replace />;
  }

  return <Outlet />;
};
