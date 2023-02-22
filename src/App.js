import "./App.css";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import Home from "./pages/Home";
import RootLayout from "./components/RootLayout";
import Message from "./pages/Message";

let router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Registration />} />
      <Route path="/login" element={<Login />} />
      <Route path="pechal" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="message" element={<Message />} />
      </Route>
    </>
  )
);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
//next task from(class-37,part-2)
export default App;

//Deu Work================================//
//1. Member Request Accept,
//2.Member Request Delete,
//3.Show Group Members on Info Modal,
//4.Friend Request Cancel,
//5.Unfriend,
//6.Remove Group Members and Block Group Members,
//7.Search.
