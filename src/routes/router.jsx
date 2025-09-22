import { createBrowserRouter } from "react-router";
import Root from "../pages/Root";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import PrivateRoute from "../context/PrivateRoute";
import VolunteerNeed from "../pages/VolunteerNeed";
import PostDetails from "../pages/PostDetails";
import VolunteerRequest from "../pages/VolunteerRequest";
import AllPosts from "../pages/Allposts";
import MyPosts from "../pages/MyPosts";
import UpdatePost from "../pages/UpdatePost";

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
        )
      }
    ],
  },
]);

export default router;
