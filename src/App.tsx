import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Scheduling from './pages/Scheduling';
import Tasks from './pages/Tasks';
import Inventory from './pages/Inventory';
import Requests from './pages/Requests';
import Statistics from './pages/Statistics';
import Exceptions from './pages/Exceptions';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/scheduling" element={<Scheduling />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/exceptions" element={<Exceptions />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
