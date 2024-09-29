import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import ProductUpload from './Pages/ProductUpload';
import UpdateProduct from './Pages/UpdateProduct';
import { NavBar,Sidebar } from './componants/layout';
import Addcategory from './Pages/Addcategory';

function App() {
  const location = useLocation();

  const shouldShowSidebar = location.pathname !== '/';

  return (
    <div className="flex w-[95vw] ml-[-130px] m-0 gap-3  overflow-hidden">
       {shouldShowSidebar &&<NavBar/>}
      {shouldShowSidebar && <Sidebar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Upload_Product" element={<ProductUpload />} />
        <Route path="/update-Product/:id" element={<UpdateProduct />} />
        <Route path="/Category-list" element={<Addcategory />} />
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
