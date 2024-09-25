import { AiOutlineSearch } from "react-icons/ai"; 
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom'


const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [value, setValue] = useState('');
    const [sortValue,setSortValue]=useState('')
    const [currentPage, setCurrentPage] = useState(1); // New state to track current page
  const [productsPerPage] = useState(5); 
    const sortOptions=["vegetables","chocolate","Staples","Packages Food","Fruits & Nuts","Dairy & creams"]

    useEffect(() => {
        

        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:6060/products'); 
            setProducts(response.data);
        } catch (err) {
            setError('Failed to fetch products.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const handleSearch = async (e) => {
        e.preventDefault();
    
        try {
          const res = await axios.get(`http://localhost:6060/search?q=${value}`);
          setProducts(res.data);
          setValue("");
    
          if (res.data.length === 0) {
            console.log("No products found");
            alert("No products found");
          } else {
            console.log(res.data);
          }
    
        } catch (err) {
          console.error("Error fetching products:", err);
        }
      };

      const handleReset = () => {
        fetchProducts();
        setValue('');
    }


    const handleSort = async (e) => {
        let value = e.target.value; 
        setSortValue(value);
    
        try {
          const res = await axios.get(`http://localhost:6060/sort?q=${value}`);
          setProducts(res.data);
    
          if (res.data.length === 0) {
            console.log("No products found");
          } else {
            console.log(res.data);
          }
    
        } catch (err) {
          console.error("Error fetching products:", err);
        }
      };


      const handleDelete = async (id) => {
        try {
          await axios.delete(`http://localhost:6060/delete-product/${id}`);
          setProducts(products.filter((product) => product._id !== id));
        } catch (error) {
          console.error(error);
        }
      }
    // pagination
    const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
    return (
        <div className="m-2 ">
            <div className="flex p-4 justify-around items-center">
            <form className="flex justify-start" onSubmit={handleSearch}>
            <div className="border p-2 border-gray-300 bg-gray-300 rounded-l-md flex items-center ">
                    <AiOutlineSearch />
                    <input type="text" placeholder="Search..." className="border-none outline-none ml-2 bg-gray-300" onChange={(e) => setValue(e.target.value)} value={value}/>
                </div>
                  <button type="submit" className="border p-2 border-gray-300 bg-black text-white rounded-r-md ">Search</button>
                </form>
                <div className="">
                <select
                  className="border rounded-md p-2 bg-gray-300 border-gray-300 focus:outline-none"
                  onChange={handleSort}
                  value={sortValue}
                >
                  {sortOptions.map((item, index) => (
                    <option value={item} key={index}>
                      {item}
                    </option>
                  ))}
                </select>
                </div>
                
            <h2 className="text-xl font-bold mb-4">Product List</h2>
                  <button className="p-2 text-white bg-yellow-500 rounded-md" onClick={handleReset}>Reset</button>
                  <Link to={'/Upload_Product'} className="p-2 text-white bg-blue-500 rounded-md ml-2">ADD product +</Link >
            
            </div>
            <table className="w-[80vw] bg-white border border-gray-300 rounded-md">
                <thead>
                    <tr>
                        <th className="py-2 border-b">Name</th>
                        <th className="py-2 border-b">Description</th>
                        <th className="py-2 border-b">Category</th>
                        <th className='py-2 border-b'>Product Image</th>
                        <th className="py-2 border-b">Price</th>
                        <th className="py-2 border-b">Stock</th>
                        <th className="py-2 border-b">Status</th>
                        <th className="py-2 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentProducts.map((product) => (
                        <tr key={product._id}>
                            <td className="py-2 border-b">{product.name}</td>
                            <td className="py-2 border-b">{product.description}</td>
                            <td className="py-2 border-b">{product.category}</td>
                            <td className="py-2 border-b flex justify-center  ">
  {product.image ? <img src={(`../images/${product.image}`)} alt="Image" className="w-30 h-30"/> : 'N/A'}
</td>

                            <td className="py-2 border-b">
                                {product.variants.length > 0 ? product.variants[0].price : 'N/A'}
                            </td>
                            <td className="py-2 border-b">{product.inventory.stock}</td>
                            <td className="py-2 border-b">{product.status}</td>
                            <td className="py-2 border-b">
                                <Link to={`/update-product/${product._id}`} className="text-blue-500 hover:underline">Edit</Link>
                                <button className="text-red-500 hover:underline ml-2" onClick={() => handleDelete(product._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-center mt-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:bg-gray-400"
        >
          Previous
        </button>
        <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:bg-gray-400"
        >
          Next
        </button>
      </div>
        </div>
    );
};

export default Dashboard;
