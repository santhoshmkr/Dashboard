import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Login from './componants/Login';
import Dashboard from './componants/Dashboard';
import Sidebar from './componants/Sidebar';
import ProductUpload from './componants/ProductUpload';
import UpdateProduct from './componants/UpdateProduct';

function App() {
  const location = useLocation();

  // Determine if the sidebar should be shown based on the current path
  const shouldShowSidebar = location.pathname !== '/';

  return (
    <div className="flex w-[95vw] ml-[-130px] m-0 gap-3 border overflow-hidden">
      {shouldShowSidebar && <Sidebar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Upload_Product" element={<ProductUpload />} />
        <Route path="/update-Product/:id" element={<UpdateProduct />} />
      </Routes>
    </div>
  );
}

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default AppWrapper;
