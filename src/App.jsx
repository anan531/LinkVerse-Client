import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import DiscoverStudents from "./pages/DiscoverStudents";
import Connections from "./pages/Connections";
import Opportunities from "./pages/Opportunities";
import CreateOpportunity from "./pages/CreateOpportunity";
import CollaborationHub from "./pages/CollaborationHub";
import Chat from "./pages/Chat";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/discover-students" element={<DiscoverStudents />} />
        <Route path="/connections" element={<Connections />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/create-opportunity" element={<CreateOpportunity />} />
        <Route path="/collaborations" element={<CollaborationHub />}/>
        <Route path="/chat" element={<Chat />}/>
        

      </Routes>
    </BrowserRouter>
  );
}

export default App;