import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ProductUpload() {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    category: 'vegetables',
    variants: [],
    inventory: {
      stock: '',
      sold: '',
    },
    taxDetails: {
      taxRate: '',
    },
    status: 'Active',
    shippingDetails: {
      weight: '',
      dimensions: {
        length: '',
        width: '',
        height: '',
      },
    },
    returnPolicy: 'Returnable',
  });
  const [image, setImage] = useState(null); // State for the image file
  const navigate = useNavigate();
  
  // Handle variant changes
  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    const updatedVariants = [...product.variants];
    updatedVariants[index][name] = value;
    setProduct((prev) => ({ ...prev, variants: updatedVariants }));
  };

  // Handle adding a new variant
  const handleAddVariant = () => {
    setProduct((prev) => ({
      ...prev,
      variants: [...prev.variants, { name: '', price: '', stock: '' }],
    }));
  };

  // Handle form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  // Handle nested object changes
  const handleNestedChange = (e, field) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [name]: value,
      },
    }));
  };

  // Handle file input
  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(); // Create a new FormData object

    // Append the image file
    if (image) {
      formData.append('image', image);
    }

    // Prepare the structured data
    const structuredData = {
      ...product,
      variants: JSON.stringify(product.variants), 
    };

    // Append other product details
    for (const key in structuredData) {
      if (key === 'variants') {
        formData.append(key, structuredData[key]);
      } else if (key === 'inventory') {
        for (const invKey in structuredData.inventory) {
          formData.append(`inventory[${invKey}]`, structuredData.inventory[invKey]);
        }
      } else if (key === 'taxDetails') {
        for (const taxKey in structuredData.taxDetails) {
          formData.append(`taxDetails[${taxKey}]`, structuredData.taxDetails[taxKey]);
        }
      } else if (key === 'shippingDetails') {
        for (const shipKey in structuredData.shippingDetails) {
          if (shipKey === 'dimensions') {
            for (const dimKey in structuredData.shippingDetails.dimensions) {
              formData.append(`shippingDetails[dimensions][${dimKey}]`, structuredData.shippingDetails.dimensions[dimKey]);
            }
          } else {
            formData.append(`shippingDetails[${shipKey}]`, structuredData.shippingDetails[shipKey]);
          }
        }
      } else {
        formData.append(key, structuredData[key]);
      }
    }

    try {
      const res = await axios.post('http://localhost:6060/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Product added:', res.data);
      navigate('/dashboard'); 
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };

  return (
    <div className="flex justify-center  items-center mt-10 w-full">
      <form onSubmit={handleSubmit} className="border p-4">
        <h2 className="text-2xl mb-4">Add New Product</h2>
        
        {/* Product Name */}
        <div className="mb-4">
          <label>Product Name</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
            className="border p-2 w-full"
          />
        </div>
        
        {/* Description */}
        <div className="mb-4">
          <label>Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            required
            className="border p-2 w-full"
          ></textarea>
        </div>
        
        {/* Category */}
        <div className="mb-4">
          <label>Category</label>
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            required
            className="border p-2 w-full"
          >
            <option value="vegetables">Vegetables</option>
            <option value="fruits & nuts">Fruits & Nuts</option>
            <option value="dairy & creams">Dairy & creams</option>
            <option value="packages food">Packages Food</option>
            <option value="staples">Staples</option>
            <option value="chocolate">chocolate</option>
          </select>
        </div>
        
        {/* Image Upload */}
        <div className="mb-4">
          <label>Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border p-2 w-full"
          />
        </div>
        
        {/* Variants */}
        <div className="mb-4">
          <label className="block text-gray-700">Variants</label>
          {product.variants.map((variant, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                name="name"
                value={variant.name}
                onChange={(e) => handleVariantChange(index, e)}
                placeholder="Variant Name"
                className="w-1/3 p-2 border border-gray-300 rounded"
                required
              />
              <input
                type="number"
                name="price"
                value={variant.price}
                onChange={(e) => handleVariantChange(index, e)}
                placeholder="Price"
                className="w-1/3 p-2 border border-gray-300 rounded mx-2"
                required
              />
              <input
                type="number"
                name="stock"
                value={variant.stock}
                onChange={(e) => handleVariantChange(index, e)}
                placeholder="Stock"
                className="w-1/3 p-2 border border-gray-300 rounded"
                required
              />
            </div>
          ))}
          <button type="button" onClick={handleAddVariant} className="text-blue-500">Add Variant</button>
        </div>
        
        {/* Inventory Stock */}
        <div className="mb-4">
          <label>Inventory Stock</label>
          <input
            type="number"
            name="stock"
            value={product.inventory.stock}
            onChange={(e) => handleNestedChange(e, 'inventory')}
            required
            className="border p-2 w-full"
          />
        </div>
        
        {/* Inventory Sold */}
        <div className="mb-4">
          <label>Inventory Sold</label>
          <input
            type="number"
            name="sold"
            value={product.inventory.sold}
            onChange={(e) => handleNestedChange(e, 'inventory')}
            required
            className="border p-2 w-full"
          />
        </div>
        
        
        <div className="mb-4">
          <label>Tax Rate</label>
          <input
            type="number"
            name="taxRate"
            value={product.taxDetails.taxRate}
            onChange={(e) => handleNestedChange(e, 'taxDetails')}
            required
            className="border p-2 w-full"
          />
        </div>
        
        {/* Weight */}
        <div className="mb-4">
          <label>Weight</label>
          <input
            type="number"
            name="weight"
            value={product.shippingDetails.weight}
            onChange={(e) => handleNestedChange(e, 'shippingDetails')}
            required
            className="border p-2 w-full"
          />
        </div>
        
        {/* Dimensions */}
        <div className="mb-4">
          <label>Dimensions</label>
          <div className="flex space-x-4">
            <input
              type="number"
              name="length"
              placeholder="Length"
              value={product.shippingDetails.dimensions.length}
              onChange={(e) => handleNestedChange(e, 'shippingDetails.dimensions')}
              className="border p-2 w-full"
            />
            <input
              type="number"
              name="width"
              placeholder="Width"
              value={product.shippingDetails.dimensions.width}
              onChange={(e) => handleNestedChange(e, 'shippingDetails.dimensions')}
              className="border p-2 w-full"
            />
            <input
              type="number"
              name="height"
              placeholder="Height"
              value={product.shippingDetails.dimensions.height}
              onChange={(e) => handleNestedChange(e, 'shippingDetails.dimensions')}
              className="border p-2 w-full"
            />
          </div>
        </div>
        
        {/* Return Policy */}
        <div className="mb-4">
          <label>Return Policy</label>
          <select
            name="returnPolicy"
            value={product.returnPolicy}
            onChange={handleChange}
            required
            className="border p-2 w-full"
          >
            <option value="Returnable">Returnable</option>
            <option value="Non-returnable">Non-returnable</option>
            <option value="Replaceable">Replaceable</option>
          </select>
        </div>
        
        {/* Submit Button */}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add Product
        </button>
      </form>
    </div>
  );
}

export default ProductUpload;
