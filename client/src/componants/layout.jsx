import { AiOutlineSearch } from "react-icons/ai"; 
import { NavLink } from "react-router-dom";

export const NavBar= ()=>{
    return(
        <>
        <div className="flex  px-4 fixed top-0 left-0 right-0 items-center justify-between border border-b-2">
            <div>
              <NavLink to={'/dashboard'}>
                <img src={"https://emilus.themenate.net/img/logo.png"}/>
              </NavLink>
            </div>
            <div className="border p-2 border-gray-300 bg-gray-300 rounded-md flex items-center">
            <AiOutlineSearch /> 
            <input
          type="text"
          placeholder="Search..."
          className="border-none outline-none ml-2 bg-gray-300"
          
        />
          </div>
        </div>
        </>
    )
}

export const Sidebar = () => {
  return (
    <div className="fixed left-0 top-[70px] h-screen w-52 bg-gray-900 text-white p-4">
      <div className="flex items-center justify-center mb-4">
        <h1 className="text-3xl font-bold">Sidebar</h1>
      </div>
      <ul className="list-none mb-4 text-start">
        <li className="mb-2">
          <NavLink to="/Dashboard" className="text-white hover:text-blue-600">
            Product List
          </NavLink>
        </li>
        <li className="mb-2">
          <NavLink to={"/Upload_Product"} className="text-white hover:text-blue-600">
            Add Product
          </NavLink>
        </li>
        <li className="mb-2">
          <NavLink to={"/Category-list"} className="text-white hover:text-blue-600">
            Add Category
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

