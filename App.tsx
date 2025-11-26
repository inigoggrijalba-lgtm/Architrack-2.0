import React, { useState } from 'react';
import { ViewState } from './types';
import { DataProvider } from './context/DataContext';
import { Layout } from './components/Layout';
import { RegisterActivity } from './pages/RegisterActivity';
import { Projects } from './pages/Projects';
import { Reports } from './pages/Reports';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('register');

  const renderView = () => {
    switch (currentView) {
      case 'register':
        return <RegisterActivity />;
      case 'projects':
        return <Projects />;
      case 'reports':
        return <Reports />;
      default:
        return <RegisterActivity />;
    }
  };

  return (
    <DataProvider>
        <Layout currentView={currentView} setView={setCurrentView}>
            {renderView()}
        </Layout>
    </DataProvider>
  );
};

export default App;
