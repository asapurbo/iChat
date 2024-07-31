import Chatting from "./components/chat/chatBox/Chatting";
import Login from "./components/pages/Login";
import Registration from "./components/pages/Registration";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./components/root/Root";
import useAuth from "./components/hooks/useAuth";
import _PrivateRoute from "./components/utils/_PrivateRoute";
import PublicRoute from "./components/utils/PublicRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/registration",
    element: (
      <PublicRoute>
        <Registration />
      </PublicRoute>
    ),
  },
  {
    path: "/chat",
    element: (
      <_PrivateRoute>
        <Root />
      </_PrivateRoute>
    ),
    children: [
      {
        path: "/chat/:id",
        element: (
          <_PrivateRoute>
            <Chatting />
          </_PrivateRoute>
        ),
      },
    ],
  },
]);

const App = () => {
  // const auth =
  return useAuth() ? (
    <RouterProvider router={router} />
  ) : (
    <div>Loading....</div>
  );
};

export default App;
