import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import 'leaflet/dist/leaflet.css';
import HomePage from "./components/HomePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
