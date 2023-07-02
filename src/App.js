import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Forgotpassword from "./pages/Forgotpassword";
import Home from "./pages/Home";
import Login from "./pages/login";
import Registration from "./pages/registration";
import Loggedinuser from "./Privaterouter/Loggedinuser";
import Loggedoutuser from "./Privaterouter/Loggedoutuser";
import Rootlayout from "./Rootlayout";
import Messages from "./pages/Messages";
import Notification from "./pages/Notification";
import Settings from "./pages/Settings";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route element={<Loggedinuser />}>
          <Route element={<Rootlayout />}>
            <Route path="/" element={<Home />}></Route>
            <Route path="/messages" element={<Messages />}></Route>
            <Route path="/notification" element={<Notification />}></Route>
            <Route path="/settings" element={<Settings />}></Route>
          </Route>
        </Route>
        <Route element={<Loggedoutuser />}>
          <Route path="/registration" element={<Registration />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/forgotpassword" element={<Forgotpassword />}></Route>
        </Route>
      </Route>
    )
  );
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
