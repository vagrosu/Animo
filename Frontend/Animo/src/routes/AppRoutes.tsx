import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import LoginPage from "../pages/login/LoginPage.tsx";
import RegisterPage from "../pages/register/RegisterPage.tsx";
import ProtectedRoute from "../components/ProtectedRoute.tsx";
import UserContextProvider from "../context/UserContext.tsx";
import LandingPage from "../pages/landing/LandingPage.tsx";
import ChatsPage from "../pages/chats/ChatsPage.tsx";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <UserContextProvider>
        <Routes>
          {/* Non-protected routes */}
          <Route path={"/landing"} element={<LandingPage/>}/>
          <Route path={"/auth/login"} element={<LoginPage/>}/>
          <Route path={"/auth/register"} element={<RegisterPage/>}/>

          {/* Protected routes */}
          <Route element={<ProtectedRoute/>}>
            <Route path={"/chats"} element={<ChatsPage/>}/>
          </Route>

          <Route path="*" element={<Navigate to="/landing" replace/>}/>
        </Routes>
      </UserContextProvider>
    </BrowserRouter>
  )
}