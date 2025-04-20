import './App.css';
import './index.css';
import Home from './pages/Home';
import Notepad from './pages/Notepad';
import Private from './pages/Private';
import About from './pages/About';
import Content from './pages/Content'
import PrivateNote from './pages/PrivateNote';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/private" element={<Private />} />
        <Route path="/about" element={<About />} />
        <Route path="/content" element={<Content />} />
        <Route path="/:code" element={<Notepad />} />
        <Route path="/private/:code" element={<PrivateNote />} />
      </Routes>
    </Router>
  );
}

export default App;