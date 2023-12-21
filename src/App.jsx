import { useState } from "react";
import Login from "./Pages/Login";
import SignIn from "./Pages/SignIn";
import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import ContextProvider from "./Context/Context";
import GetProfileInfo from "./Pages/GetProfileInfo";
import Home from "./Pages/Home";
import Notification from "./Components/Notification";
import GroupChat from "./Components/GroupChat";
import Chat from "./Components/Chat";

const route = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Login />} />
      <Route path="register" element={<SignIn />} />
      <Route path="profile" element={<GetProfileInfo />} />
      <Route path="" element={<Home />}>
        <Route  path="home" element={<Chat />} exact/>
        <Route path="notifications" element={<Notification />} />
        <Route path="group-chat" element={<GroupChat />} />
      </Route>
    </>
  )
);

function App() {
  return (
    <ContextProvider>
      <RouterProvider router={route}></RouterProvider>
    </ContextProvider>
  );
}

export default App;
