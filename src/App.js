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
