import { createBrowserRouter } from "react-router";
import Root from "../pages/Root";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import PrivateRoute from "../context/PrivateRoute";
import VolunteerNeed from "../pages/VolunteerNeed";
import PostDetails from "../pages/PostDetails";
import AllPosts from "../pages/Allposts";
import MyPosts from "../pages/MyPosts";
import UpdatePost from "../pages/UpdatePost";
import Request from "../pages/Request";
import Profile from "../pages/Profile";
import Error from "../pages/Error";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    errorElement: <Error/>,
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
        path: "/add-post",
        element: (
          <PrivateRoute>
            <VolunteerNeed></VolunteerNeed>
          </PrivateRoute>
        ),
      },
      {
        path: "/posts/:id",
        element: (
          <PrivateRoute>
            <PostDetails></PostDetails>
          </PrivateRoute>
        ),
      },
      {
        path: "/posts",
        Component: AllPosts,
      },
      {
        path: "/manage-posts",
        element: (
          <PrivateRoute>
            <MyPosts></MyPosts>
          </PrivateRoute>
        ),
      },
      {
        path: "/posts/:id/edit",
        element: (
          <PrivateRoute>
            <UpdatePost></UpdatePost>
          </PrivateRoute>
        ),
      },
      {
        path: "/my-requests",
        element: (
          <PrivateRoute>
            <Request></Request>
          </PrivateRoute>
        ),
      },
      {
        path: "/profile",
        element: (
            <PrivateRoute>
                <Profile></Profile>
            </PrivateRoute>
        )
      }
    ],
  },
]);

export default router;
