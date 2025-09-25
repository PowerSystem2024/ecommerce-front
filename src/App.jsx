import { AppProviders } from './providers/AppProviders';
import AppRoutes from './routes/AppRoutes';
import './App.css';

function App() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
}

export default App
