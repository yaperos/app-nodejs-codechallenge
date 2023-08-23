import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PermissionContainer from "./containers/TransactionContainer";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PermissionContainer />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
