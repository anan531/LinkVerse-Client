import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import DiscoverStudents from "./pages/DiscoverStudents";
import Connections from "./pages/Connections";
import Opportunities from "./pages/Opportunities";
import CreateOpportunity from "./pages/CreateOpportunity";
import CollaborationHub from "./pages/CollaborationHub";
import Chat from "./pages/Chat";
import StudentFeed from "./pages/StudentFeed";

import AdminDashboard from "./pages/AdminDashboard";
import Recommendations from "./pages/Recommendations";
import StudentProfile from "./pages/StudentProfile";

import Layout from "./components/Layout";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* =========================
            PUBLIC PAGES
        ========================= */}

        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* =========================
            STUDENT PAGES
            Shared Sidebar/Layout
        ========================= */}

        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        <Route
          path="/profile"
          element={
            <Layout>
              <Profile />
            </Layout>
          }
        />

        <Route
  path="/profile/:studentId"
  element={
    <Layout>
      <StudentProfile />
    </Layout>
  }
/>

        <Route
          path="/discover-students"
          element={
            <Layout>
              <DiscoverStudents />
            </Layout>
          }
        />

        <Route
          path="/connections"
          element={
            <Layout>
              <Connections />
            </Layout>
          }
        />

        <Route
          path="/collaborations"
          element={
            <Layout>
              <CollaborationHub />
            </Layout>
          }
        />

        <Route
          path="/chat"
          element={
            <Layout>
              <Chat />
            </Layout>
          }
        />

        <Route
          path="/opportunities"
          element={
            <Layout>
              <Opportunities />
            </Layout>
          }
        />

        <Route
          path="/create-opportunity"
          element={
            <Layout>
              <CreateOpportunity />
            </Layout>
          }
        />

        <Route
          path="/feed"
          element={
            <Layout>
              <StudentFeed />
            </Layout>
          }
        />

        <Route
  path="/recommendations"
  element={
    <Layout>
      <Recommendations />
    </Layout>
  }
/>





        {/* =========================
            ADMIN
        ========================= */}

        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />

      </Routes>

      

    </BrowserRouter>
  );
}

export default App;