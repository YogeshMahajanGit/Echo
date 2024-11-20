import { lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectRoute from "./components/auth/ProtectRoute";

// dynamic import(loads on demand)
const Home = lazy(() => import("./pages/HomePage"));
const Login = lazy(() => import("./pages/LoginPage"));
const Chat = lazy(() => import("./pages/ChatPage"));
const Group = lazy(() => import("./pages/GroupPage"));
const NotFound = lazy(() => import("./pages/NotFoundPage"));

let user = true;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectRoute user={user} />}>
          <Route path="/" element={<Home />} />
          <Route path="/chat:chatId" element={<Chat />} />
          <Route path="/group" element={<Group />} />
        </Route>

        <Route
          path="/login"
          element={
            <ProtectRoute user={!user} redirect="/">
              <Login />
            </ProtectRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
