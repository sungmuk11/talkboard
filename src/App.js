import { BrowserRouter, Routes, Route } from "react-router-dom";

import Homepage from "./routes/Homepage.js";
import Notes from "./routes/Notes.js";
import Join from "./routes/Join.js";
import Login from "./routes/Login.js";
import Create from "./routes/Create.js";
import Edit from "./routes/Edit.js";
import Profile from "./routes/Profile.js";
import Header from "./components/Header.js";

import { AuthProvider } from "./contexts/AuthContext.js";
import { IsLoggedIn, IsNotLoggedIn } from "./components/ProtectedRoute.js";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/notes/watch/:id" element={<Notes />} />
          <Route
            path="/notes/create"
            element={
              <IsLoggedIn>
                <Create />
              </IsLoggedIn>
            }
          />
          <Route path="/notes/edit/:id" element={<Edit />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route
            path="/join"
            element={
              <IsNotLoggedIn>
                <Join />
              </IsNotLoggedIn>
            }
          />
          <Route
            path="/login"
            element={
              <IsNotLoggedIn>
                <Login />
              </IsNotLoggedIn>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
