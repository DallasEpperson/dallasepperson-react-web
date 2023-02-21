import './App.css';

import Hikes from './Hikes/Hikes';
import Home from './Home';

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/hikes/*" element={<Hikes />} />
        <Route path="*" element={<div>No match</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
