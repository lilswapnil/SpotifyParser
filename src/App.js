import {
  createBrowserRouter,
  RouterProvider,
}  from 'react-router-dom'

import './App.css';
import Home from "./pages/Home";
import Albums from './pages/Albums';
import Artists from './pages/Artists';
import Playlists from './pages/Playlists';
import Layout from "./Layout";

const routes = [{
  path: '/',
  element: <Layout />,
  children: [{
    path: '/',
    element:<Home />
  },
  {
    path: '/albums',
    element:<Albums />
  },
  {
    path: '/artists',
    element:<Artists />
  },
  {
    path: '/playlists',
    element:<Playlists />
  },
  ]
}]

const router = createBrowserRouter(routes);
function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;