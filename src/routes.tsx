import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import ClassificationLayout from './pages/ClassificationLayout';
import GradePage from './pages/GradePage';
import Home from './pages/Home';
import LearnPage from './pages/LearnPage';
import LevelPage from './pages/LevelPage';
import NotFound from './pages/NotFound';
import SubjectPage from './pages/SubjectPage';

/** /:level/:grade/:subject/:classification/{concepts/:concept | practice | worksheets} */
export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: ':level', element: <LevelPage /> },
      { path: ':level/:grade', element: <GradePage /> },
      { path: ':level/:grade/:subject', element: <SubjectPage /> },
      {
        path: ':level/:grade/:subject/:classification',
        element: <ClassificationLayout />,
        children: [
          { index: true, element: <LearnPage /> },
          // Leaf pages are code-split so the browse pages load fast.
          { path: 'concepts/:concept', lazy: () => import('./pages/ConceptPage').then((m) => ({ Component: m.default })) },
          { path: 'practice', lazy: () => import('./pages/PracticePage').then((m) => ({ Component: m.default })) },
          { path: 'worksheets', lazy: () => import('./pages/WorksheetsPage').then((m) => ({ Component: m.default })) },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
