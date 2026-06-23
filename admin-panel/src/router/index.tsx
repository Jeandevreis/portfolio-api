import { createBrowserRouter, Navigate } from 'react-router-dom';

import Login from '@/pages/Login';

import ProtectedRoute from '@/components/ProtectedRoute';

import Panel from '@/pages/Panel';

import Educations from '@/pages/Educations';
import CreateEducation from '@/pages/Educations/CreateEducation';
import EditEducation from '@/pages/Educations/EditEducation';

import Projects from '@/pages/Projects';
import CreateProject from '@/pages/Projects/CreateProject';
import EditProject from '@/pages/Projects/EditProject';

import NotFound from '@/pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/panel',
        element: <Panel />,
      },
      {
        path: '/projects',
        element: <Projects />,
      },
      {
        path: '/projects/create',
        element: <CreateProject />,
      },
      {
        path: '/projects/edit/:id',
        element: <EditProject />,
      },
      {
        path: '/educations',
        element: <Educations />,
      },
      {
        path: '/educations/create',
        element: <CreateEducation />,
      },
      {
        path: '/educations/edit/:id',
        element: <EditEducation />,
      }
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  }
]);
