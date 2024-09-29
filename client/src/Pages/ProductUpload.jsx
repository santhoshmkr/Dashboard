import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate,Link } from "react-router-dom";

const ProductUpload = () => {
  const [activeTab, setActiveTab] = useState("General");
  const [fields, setFields] = useState([{ name: "", price: 0, stock: 0 }]);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    category: "",
    image: "",
    inventory: {
      stock: 0,
      sold: 0,
    },
    taxDetails: {
      taxRate: 0,
    },
    status: true,
    shippingDetails: {
      weight: 0,
      dimensions: {
        length: 0,
        width: 0,
        height: 0,
      },
    },
    returnPolicy: "",
  });
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryNames, setCategoryNames] = useState([]);
  const Navigate = useNavigate();

  const ImageUpload = async (e) => {
    console.log("uploading");
    const files = e.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "rgpqdzui");
    setImage(files[0]);
    setUploading(true);
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dija60v2h/image/upload`,
        data
      );
      setImageUrl(response.data.secure_url);
      setProductData({ ...productData, image: response.data.secure_url }); // Update the productData state with the image URL
      setUploading(false);
      console.log(imageUrl);
    } catch (err) {
      console.log(err);
      setUploading(false);
    }
  };


  useEffect(()=>{
    axios.get('http://localhost:6060/get-categories')
    .then(res=>{
      console.log(res.data)
      setCategories(res.data);
      setCategoryNames(res.data.map(category => category.category_name));
    })
    .catch(error=>{
      console.error(error)
    })
  },[])

  const handleAddField = (e) => {
    e.preventDefault();
    setFields([...fields, { name: "", price: 0, stock: 0 }]);
  };

  const handleChange = (index, event) => {
    const values = [...fields];
    values[index][event.target.name] = event.target.value;
    setFields(values);
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (type === "checkbox") {
      setProductData({ ...productData, [name]: checked });
    } else if (type === "radio") {
      setProductData({ ...productData, [name]: value === "true" });
    } else {
      setProductData({ ...productData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      name: productData.name,
      description: productData.description,
      category: productData.category,
      image: productData.image,
      variants: JSON.stringify(fields),
      inventory: {
        stock: productData.inventory.stock,
        sold: productData.inventory.sold,
      },
      taxDetails: {
        taxRate: productData.taxDetails.taxRate,
      },
      status: productData.status,
      shippingDetails: {
        weight: productData.shippingDetails.weight,
        dimensions: {
          length: productData.shippingDetails.dimensions.length,
          width: productData.shippingDetails.dimensions.width,
          height: productData.shippingDetails.dimensions.height,
        },
      },
      returnPolicy: productData.returnPolicy,
    };

    try {
      const res = await axios.post("http://localhost:6060/upload", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("productData added:", res.data);
      Navigate('/Dashboard  ')
    } catch (err) {
      console.error("Error adding productData:", err);
    }
  };

  return (
    <div className="container w-[80%] px-10 py-6 ml-64 mt-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Add New Product</h1>
        <div className="flex space-x-2">
        <Link to={'/Dashboard'} className="px-4 py-2 border rounded">Discard</Link>

          <button
            className=" px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleSubmit}
          >
            Add
          </button>
        </div>
      </div>
      <div className="border-b mb-6">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab("General")}
            className={`pb-2 ${
              activeTab === "General"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600"
            }`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab("Variation")}
            className={`pb-2 ${
              activeTab === "Variation"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600"
            }`}
          >
            Variation
          </button>
          <button
            onClick={() => setActiveTab("Shipping")}
            className={`pb-2 ${
              activeTab === "Shipping"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600"
            }`}
          >
            Shipping
          </button>
        </nav>
      </div>
      <form className="text-start">
        {activeTab === "General" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-md mb-4">
                <h2 className="text-xl font-bold mb-4">Basic Info</h2>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 font-bold mb-2"
                    htmlFor="name"
                  >
                    <span className="text-red-500">*</span> Product name
                  </label>
                  <input
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                    type="text"
                    id="name"
                    name="name"
                    value={productData.name}
                    onChange={handleInputChange}
                    placeholder="Product Name"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 font-bold mb-2"
                    htmlFor="description"
                  >
                    Description
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                    id="description"
                    name="description"
                    value={productData.description}
                    onChange={handleInputChange}
                    rows="4"
                  ></textarea>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Category</h2>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 font-bold mb-2"
                    htmlFor="category"
                  >
                    <span className="text-red-500">*</span> Category
                  </label>
                  <select
                    name="category"
                    id="category"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                    value={productData.category}
                    onChange={handleInputChange}
                  >
                    {categoryNames.map((categoryName, index) => (
        <option value={categoryName} key={index}>{categoryName}</option>
      ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Media</h2>
                <div className="border-dashed border-2 border-gray-300 p-6 text-center rounded-lg cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="image-upload"
                    onChange={(e) => ImageUpload(e)}
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
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Inventory</h2>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 font-bold mb-2"
                    htmlFor="status"
                  >
                    <span className="text-red-500">*</span> Status
                  </label>
                  <div className="flex space-x-2">
                    <label>
                      <input
                        type="radio"
                        name="status"
                        value={true}
                        checked={productData.status}
                        onChange={handleInputChange}
                      />
                      Active
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="status"
                        value={false}
                        checked={!productData.status}
                        onChange={handleInputChange}
                      />
                      Inactive
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === "Variation" && (
          <div className="mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Variants</h2>
            <p className="text-gray-600 mb-4">
              Add a custom variant options for your product, like different
              sizes or colors.
            </p>
            {fields.map((field, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="text-red-500">*</span> Variant
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={field.name}
                    onChange={(event) => handleChange(index, event)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus: ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="text-red-500">₹</span> Price
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm"></span>
                    </div>
                    <input
                      type="number"
                      name="price"
                      value={field.price}
                      onChange={(event) => handleChange(index, event)}
                      className="block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="text-red-500">*</span> Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={field.stock}
                    onChange={(event) => handleChange(index, event)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
              </div>
            ))}
            <div className="flex items-center justify-center border-2 border-dashed border-blue-300 rounded-md py-4">
              <button
                onClick={handleAddField}
                className="text-blue-500 flex items-center"
              >
                <i className="fas fa-plus mr-2"></i> Add field
              </button>
            </div>

          </div>
        )}
        {activeTab === "Shipping" && (
          <div className="mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb- 6">Shipping</h2>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 mb-2">Weight</label>
                <div className="flex">
                  <input
                    type="number"
                    className="flex-grow border border-gray-300 rounded-l-lg p-2"
                    name="weight"
                    onChange={(e) =>
                      setProductData({
                        ...productData,
                        shippingDetails: {
                          ...productData.shippingDetails,
                          weight: e.target.value,
                        },
                      })
                    }
                  />
                  <span className="border border-gray-300 rounded-r-lg p-2 bg-gray-100">
                    Gm
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Length</label>
                <div className="flex">
                  <input
                    type="number"
                    className="flex-grow border border-gray-300 rounded-l-lg p-2"
                    name="length"
                    value={productData.shippingDetails.dimensions.length}
                    onChange={(e) =>
                      setProductData({
                        ...productData,
                        shippingDetails: {
                          ...productData.shippingDetails,
                          dimensions: {
                            ...productData.shippingDetails.dimensions,
                            length: e.target.value,
                          },
                        },
                      })
                    }
                  />
                  <span className="border border-gray-300 rounded-r-lg p-2 bg-gray-100">
                    cm
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Width</label>
                <div className="flex">
                  <input
                    type="number"
                    className="flex-grow border border-gray-300 rounded-l-lg p-2"
                    name="width"
                    value={productData.shippingDetails.dimensions.width}
                    onChange={(e) =>
                      setProductData({
                        ...productData,
                        shippingDetails: {
                          ...productData.shippingDetails,
                          dimensions: {
                            ...productData.shippingDetails.dimensions,
                            width: e.target.value,
                          },
                        },
                      })
                    }
                  />
                  <span className="border border-gray-300 rounded-r-lg p-2 bg-gray-100">
                    cm
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Height</label>
                <div className="flex">
                  <input
                    type="number"
                    className="flex-grow border border-gray-300 rounded-l-lg p-2"
                    name="height"
                    value={productData.shippingDetails.dimensions.height}
                    onChange={(e) =>
                      setProductData({
                        ...productData,
                        shippingDetails: {
                          ...productData.shippingDetails,
                          dimensions: {
                            ...productData.shippingDetails.dimensions,
                            height: e.target.value,
                          },
                        },
                      })
                    }
                  />
                  <span className="border border-gray-300 rounded-r-lg p-2 bg-gray-100">
                    cm
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <div className="">
                  <label className="block text-gray-700 mb-2">
                    Return Policy
                  </label>
                  <select
                    value={productData.returnPolicy}
                    onChange={(e) =>
                      setProductData({
                        ...productData,
                        returnPolicy: e.target.value,
                      })
                    }
                    className="flex-grow border border-gray-300 rounded-l-lg p-2"
                  >
                    <option value="Returnable">Returnable</option>
                    <option value="Non-returnable">Non-returnable</option>
                    <option value="Replaceable">Replaceable</option>
                  </select>
                </div>
                <div className="">
                  <label className="block text-gray-700 mb-2">Tax Rate</label>
                  <input
                    type="number"
                    className="flex-grow border border-gray-300 rounded-l-lg p-2"
                    name="height"
                    value={productData.taxDetails.taxRate}
                    onChange={(e) =>
                      setProductData({
                        ...productData,
                        taxDetails: {
                          ...productData.taxDetails,
                          taxRate: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProductUpload;
