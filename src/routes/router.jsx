import { createBrowserRouter } from "react-router";
import Root from "../pages/Root";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import PrivateRoute from "../context/PrivateRoute";
import VolunteerNeed from "../pages/VolunteerNeed";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/register",
        Component: Register,
      },
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/posts",
        element: (
          <PrivateRoute>
            <VolunteerNeed></VolunteerNeed>
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;
