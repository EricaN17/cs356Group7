import React from 'react';
import ExperimentManagerUI from "./ExperimentManagerUI";
import {setMockToken} from "./backend_modules/mockData/mockUsers";

function App() {
    setMockToken('admin');
  return (
      <div>
        <ExperimentManagerUI />
      </div>
  );
}

export default App;
