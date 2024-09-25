import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  // Manage the dropdown open/close state
  const [isProductListOpen, setIsProductListOpen] = useState(false);

  return (
    <div className="m-0 w-96 bg-gray-100 p-4 border border-gray-300 min-h-screen">
      <ul>
        {/* Ecommerce Dropdown */}
        <li className="py-2">
          <div
            className="cursor-pointer text-gray-600 hover:text-gray-900 flex justify-start gap-6 items-center"
            onClick={() => setIsProductListOpen(!isProductListOpen)}
          >
            Ecommerce
            <span>{isProductListOpen ? '▲' : '▼'}</span>
          </div>
          {isProductListOpen && (
            <ul className="pl-4 text-start">
              <li className="py-2">
                <NavLink
                  to="/Dashboard"
                  className={({ isActive }) =>
                    isActive ? 'text-blue-500 font-bold' : 'text-gray-600 hover:text-gray-900'
                  }
                >
                  Product List
                </NavLink>
              </li>
              <li className="py-2">
                <NavLink
                  to="/Upload_Product"
                  className={({ isActive }) =>
                    isActive ? 'text-blue-500 font-bold' : 'text-gray-600 hover:text-gray-900'
                  }
                >
                  Add Product
                </NavLink>
              </li>
              <li className="py-2">
                <NavLink
                  to="/update-Product/:id"
                  className={({ isActive }) =>
                    isActive ? 'text-blue-500 font-bold' : 'text-gray-600 hover:text-gray-900'
                  }
                >
                  Edit Products
                </NavLink>
              </li>
              {/* <li className="py-2">
                <NavLink
                  to="/orders"
                  className={({ isActive }) =>
                    isActive ? 'text-blue-500 font-bold' : 'text-gray-600 hover:text-gray-900'
                  }
                >
                  Orders
                </NavLink>
              </li> */}
            </ul>
          )}
        </li>
        
      </ul>
    </div>
  );
};

export default Sidebar;
