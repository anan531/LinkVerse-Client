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
import ProtectedRoute from "./components/ProtectedRoute";
import EditOpportunity from "./pages/EditOpportunity";
import EditCollaboration from "./pages/EditCollaboration";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* PUBLIC PAGES */}

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* PROTECTED STUDENT PAGES */}

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <Dashboard />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <Profile />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/profile/:studentId"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <StudentProfile />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/discover-students"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <DiscoverStudents />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/connections"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <Connections />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/opportunities"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <Opportunities />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

<Route
    path="/edit-opportunity/:opportunityId"
    element={
        <ProtectedRoute adminOnly={true}>
            <EditOpportunity />
        </ProtectedRoute>
    }
/>

                <Route
                    path="/create-opportunity"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <CreateOpportunity />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/collaborations"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <CollaborationHub />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
    path="/edit-collaboration/:collaborationId"
    element={
        <ProtectedRoute>
            <Layout>
                <EditCollaboration />
            </Layout>
        </ProtectedRoute>
    }
/>

                <Route
                    path="/chat"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <Chat />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/feed"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <StudentFeed />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/recommendations"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <Recommendations />
                            </Layout>
                        </ProtectedRoute>
                    }
                />


                {/* ADMIN PAGE */}

<Route
    path="/admin-dashboard"
    element={
        <ProtectedRoute adminOnly={true}>
            <AdminDashboard />
        </ProtectedRoute>
    }
/>

            </Routes>
        </BrowserRouter>
    );
}

export default App;