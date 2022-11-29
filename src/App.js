import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Routes from './routes';

function App() {
  return (
    <Router className="body">
      <Routes />
    </Router>
  );
}

export default App;
