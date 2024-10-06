import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import debounce from 'lodash.debounce';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [value, setValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(4);
 

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


  const handleReset = () => {
    fetchProducts();
    setValue('');
  };


  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this item?');
    if (!confirmDelete) return;
  
    try {
      await axios.delete(`http://localhost:6060/delete-product/${id}`);
      setProducts((prevProducts) => prevProducts.filter((product) => product._id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };
  

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

  // search
  const handleSearch = async (searchValue) => {
    try {
      const res = await axios.get(`http://localhost:6060/search?q=${searchValue}`);
      setProducts(res.data);

      if (res.data.length === 0) {
        console.log('No products found');
        alert('No products found');
      } else {
        console.log(res.data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  
  const debouncedSearch = debounce((searchValue) => {
    handleSearch(searchValue);
  }, 500);

  const handleChange = (e) => {
    const inputValue = e.target.value;
    setValue(inputValue);
    debouncedSearch(inputValue); 
  };


  return (
    <div className="mt-12 ml-56">
         <h2 className="text-xl font-bold mb-4">Product List</h2>
      <div className="flex py-2 justify-between items-center">
        <div className="flex justify-start" >
          <div className="border p-2 border-gray-300 bg-gray-300 rounded-md flex items-center">
            <AiOutlineSearch />
            <input
          type="text"
          placeholder="Search..."
          className="border-none outline-none ml-2 bg-gray-300"
          onChange={handleChange}
          value={value}
        />
          </div>
        </div>
     
        <div className="flex gap-2">
        <button
          className="p-2 text-white bg-yellow-500 rounded-md"
          onClick={handleReset}
        >
          Reset
        </button>
        <Link
          to={'/Upload_Product'}
          className="p-2 text-white bg-blue-500 rounded-md ml-2"
        >
          ADD product +
        </Link>
        </div>
      </div>
      <table className="w-[70vw] bg-white border border-gray-300 ">
        <thead>
          <tr>
            <th className="py-2 border-b ">Name</th>
            <th className="py-2 border-b ">Description</th>
            <th className="py-2 border-b ">Category</th>
            <th className="py-2 border-b ">Product Image</th>
            <th className="py-2 border-b ">Price</th>
            <th className="py-2 border-b ">Return Policy</th>
            <th className="py-2 border-b ">Status</th>
            <th className="py-2 border-b ">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((product) => (
            <tr key={product._id} className=''>
              <td className="py-2 border-b">{product.name}</td>
              <td className="py-2 border-b">{product.description}</td>
              <td className="py-2 border-b">{product.category}</td>
              <td className="py-2 border-b flex justify-center">
                {product.image ? (
                  <img
                    src={`${product.image}`}
                    alt="Image"
                    className="w-24 h-24"
                  />
                ) : (
                  'N/A'
                )}
              </td>
              <td className="py-2 border-b">
                {product.variants.length > 0 ? product.variants[0].price : 'N/A'}
              </td>
              <td className="py-2 border-b">{product.returnPolicy}</td>
              
              <td className="py-2 border-b">
              {product.status === 'true' && <span className="StatusActive">Active</span>}
              {product.status === 'false' && <span className="StatusInactive">InActive</span>}
            </td>
            <td className="py-2 border-b  ">
  <Link
    to={`/update-product/${product._id}`}
    className="text-blue-500 hover:underline border border-gray-300 p-2 rounded-md hover:bg-blue-500 hover:text-white mr-2"
  >
    Edit
  </Link>
  
  <button
    className="text-red-500 hover:underline mt-2 border border-gray-300 p-2 rounded-md hover:bg-red-500 hover:text-white mb-2"
    onClick={() => handleDelete(product._id)}
  >
    Delete
  </button>
</td>

            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4 absolute bottom-2 ">
        <div className="flex items-center">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:bg-gray-400"
          >
            prev
          </button>
          <div className="flex items-center">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 mx-1 bg-gray-200 rounded ${
                  currentPage === i + 1 ? 'bg-blue-500 text-black' : ''
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:bg-gray-400"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;