import './App.css';

import Hikes from './Hikes/Hikes';

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<div>Default page</div>} />
        <Route path="/hikes/*" element={<Hikes />} />
        <Route path="*" element={<div>No match</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
