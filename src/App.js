import './App.css';

import Hikes from './Hikes';

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
        <Route path="/hikes" element={<Hikes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
