import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Overview from '@/pages/Overview';
import Channels from '@/pages/Channels';
import Funnel from '@/pages/Funnel';
import Attendees from '@/pages/Attendees';
import Reports from '@/pages/Reports';
import SharedReport from '@/pages/SharedReport';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/share/:link" element={<SharedReport />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/overview" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="channels" element={<Channels />} />
          <Route path="funnel" element={<Funnel />} />
          <Route path="attendees" element={<Attendees />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </Router>
  );
}