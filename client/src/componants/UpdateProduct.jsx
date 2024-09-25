import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function UpdateProduct() {
  const { id } = useParams();
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
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the product by ID and populate the form with the existing product data
    axios.get(`http://localhost:6060/update-Product/${id}`)
      .then(res => {
        const productData = res.data;
        // Parse variants if they are stringified
        if (typeof productData.variants === 'string') {
          productData.variants = JSON.parse(productData.variants);
        }
        setProduct(productData);
        console.log(productData);
        
      })
      .catch(err => console.error('Error fetching product:', err));
  }, [id]);

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
    const formData = new FormData(); 

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
      await axios.put(`http://localhost:6060/update-Product/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Error updating product:', err);
    }
  };

  return (
    <div className="flex justify-center items-center mt-10 w-full">
      <form onSubmit={handleSubmit} className="border p-4">
        <h2 className="text-2xl mb-4">Edit Product</h2>

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
            <option value="dairy & creams">Dairy & Creams</option>
            <option value="packages food">Packages Food</option>
            <option value="staples">Staples</option>
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

        {/* Inventory */}
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

        {/* Tax Rate */}
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

        {/* Weight and Dimensions */}
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

        {/* Status */}
        <div className="mb-4">
          <label>Status</label>
          <select
            name="status"
            value={product.status}
            onChange={handleChange}
            className="border p-2 w-full"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Return Policy */}
        <div className="mb-4">
          <label>Return Policy</label>
          <select
            name="returnPolicy"
            value={product.returnPolicy}
            onChange={handleChange}
            className="border p-2 w-full"
          >
            <option value="Returnable">Returnable</option>
            <option value="Non-Returnable">Non-Returnable</option>
          </select>
        </div>

        <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded">Update Product</button>
      </form>
    </div>
  );
}

export default UpdateProduct;
