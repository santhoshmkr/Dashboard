import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddCategory = () => {
  const [category, setCategory] = useState({
    category_name: '',
    category_Description: '',
    category_image: ''
  });

  const [categoryInfo, setCategoryInfo] = useState([]);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Add current page state
  const [itemsPerPage, setItemsPerPage] = useState(5); // Add items per page state

  useEffect(() => {
    axios.get('http://localhost:6060/get-categories')
      .then(response => {
        console.log(response.data);
        setCategoryInfo(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleChange = event => {
    const { name, value } = event.target;
    setCategory(prevCategory => ({ ...prevCategory, [name]: value }));
  };

  const handleImageUpload = async event => {
    console.log('uploading');
    const files = event.target.files;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'rgpqdzui');
    setImage(files[0]);
    setUploading(true);
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dija60v2h/image/upload`,
        data
      );
      setImageUrl(response.data.secure_url);
      setCategory(prevCategory => ({ ...prevCategory, category_image: response.data.secure_url }));
      setUploading(false);
      console.log(imageUrl);
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  };

  const handleSubmit = event => {
    event.preventDefault();
    axios.post('http://localhost:6060/add-category', category)
      .then(response => {
        console.log(response);
        // Clear the form fields
        setCategory({
          category_name: '',
          category_Description: '',
          category_image: ''
        });
        setImageUrl('');
        setError(null);
        window.location.reload();
      })
      .catch(error => {
        console.error(error);
        if (error.response.status === 400) {
          // Handle validation error
          setError(error.response.data.error);
        } else if (error.response.status === 500) {
          // Handle server-side error
          setError(error.response.data.error);
        }
      });
  };

  // Add pagination functionality
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = categoryInfo.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="ml-56 mt-16">
      <div className="w-[90vw] flex">
        <div className="w-[60%]">
          <table className="w-[50vw] bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 border-b">Category Name:</th>
                <th className="py-2 border-b">Category Description</th>
                <th className="py-2 border-b">Category Image:</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((category, index) => (
                <tr key={index}>
                  <td className="py-2 border-b">{category.category_name}</td>
                  <td className="py-2 border-b">{category.category_Description}</td>
                  <td className="py-2 border-b flex justify-center">{category.category_image ? (
                  <img
                    src={`${category.category_image}`}
                    alt="Image"
                    className="w-24 h-24"
                  />
                ) : (
                  'N/A'
                )}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination mt-4 absolute bottom-28">
            {Array(Math.ceil(categoryInfo.length / itemsPerPage)).fill(0).map((_, index) => (
              <button key={index} onClick={() => paginate(index + 1)} className='border p-4 rounded-md bg-blue-500 mt-4'>
                {index + 1}
              </button>
            ))}
          </div>
        </div>
        <div className="w-[30%] border border-gray-300 rounded-lg p-4">
          {error && (
            <p style={{ color: 'red' }}>{error}</p>
          )}
          <form className="grid grid-cols-1 text-start place-content-center gap -1" onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-1 my-2 px-4 py-2">
              <label htmlFor="category_name" className="text-lg font-bold mr-3">Category Name:</label>
              <input
                type="text"
                name="category_name"
                id="category_name"
                className="border focus:outline-none border-gray-300"
                placeholder="Category Name..."
                value={category.category_name}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col space-y-2 px-4 py-2">
              <label htmlFor="category_Description" className="text-lg font-bold">Category Description:</label>
              <textarea
                name="category_Description"
                id="Description"
                placeholder="Category description...."
                className="border focus:outline-none border-gray-300"
                value={category.category_Description}
                onChange={handleChange}
              />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Category Image </h2>
              <div className="border-dashed border-2 border-gray-300 p-6 text-center rounded-lg cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="image-upload"
                  onChange={handleImageUpload}
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <img
                    src={imageUrl || "https://placehold.co/100x100"}
                    alt="Placeholder for media upload"
                    className="mx-auto mb-4"
                  />
                  <p>Click here to upload Image</p>
                </label>
              </div>
            </div>

            <div className="flex justify-center">
              <button type="submit" className="p-4 border bg-blue-500 rounded-lg text-lg font-bold text-white mt-4">Add category</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;