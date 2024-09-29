const express = require('express')
const cors = require('cors')
const env = require('dotenv')
const mongoose = require('mongoose')
const connection = require('./db')
const UserModel = require('./model/User')
const ProductModel = require('./model/Product')
const CategoryModel = require('./model/Catogory')

env.config();

const app = express();
app.use(cors());
app.use(express.json());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// register

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email: email });
        if (user) {
            res.send({ message: 'User already exists' });
        } else {
            const user = new UserModel({ name, email, password });
            await user.save();
            res.send({ message: 'User created successfully' });
        }
    } catch (error) {
        res.send({ message: 'User creation failed' });
    }
})

// login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email: email, password: password });
        if (user) {
            res.send({ message: 'Login Successful', user: user });
        } else {
            res.send({ message: 'Login Failed' });
        }
    } catch (error) {
        res.send({ message: 'Login Failed' });
    }
})

// add category
app.post('/add-category', async(req,res)=>{
    try{
        const Category= new CategoryModel({
            category_name:req.body.category_name,
            category_image:req.body.category_image,
            category_Description:req.body.category_Description
        })
        await Category.save();
        res.status(200).send({
            message:'new category added',
            data: Category
        })
    }catch (error) {
        console.error('Error during category creation:', error);
        res.status(500).send({ message: 'category creation failed', error: error.message });
    }
})

app.get('/get-categories', async (req, res) => {
    try {
      const categories = await CategoryModel.find().exec();
      res.send(categories);
    } catch (error) {
      console.error('Unable to get categories:', error);
      res.status(500).send({
        message: 'Unable to get categories:',
        error: error.message,
        error_code: error.code,
      });
    }
  });

// Product Upload

app.post('/upload', async (req, res) => {
    try {
        const product = new ProductModel({
            name: req.body.name, 
            description: req.body.description,
            category: req.body.category, 
            image: req.body.image,
            variants: req.body.variants ? JSON.parse(req.body.variants) : [], 
            inventory: {
                stock: req.body.inventory.stock, 
                sold: req.body.inventory.sold 
            },
            taxDetails: {
                taxRate: req.body.taxDetails.taxRate, 
            },
            status: req.body.status , 
            shippingDetails: {
                weight: req.body.shippingDetails.weight, 
                dimensions: {
                    height: req.body.shippingDetails.dimensions.height, 
                    width: req.body.shippingDetails.dimensions.width, 
                    length: req.body.shippingDetails.dimensions.length, 
                },
            },
            returnPolicy: req.body.returnPolicy || 'Returnable' 
        });

        await product.save();
        res.status(201).send({
            message: 'Product created successfully',
            data: product 
        });
    } catch (error) {
        console.error('Error during product creation:', error);
        res.status(500).send({ message: 'Product creation failed', error: error.message });
    }
});

// product list
app.get('/products', async (req, res) => {
    try {
        const products = await ProductModel.find();
        res.send(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send({ message: 'Failed to fetch products', error: error.message });
    }
});


// get product
app.get('/update-Product/:id', (req, res) => {
    const id = req.params.id;  
    ProductModel.findById(id)
      .then(product => {
        if (product) {
          res.json(product);
        } else {
          res.status(404).json({ message: 'Product not found' });
        }
      })
      .catch(err => {
        res.status(500).json({ message: 'Error fetching product', error: err });
      });
  });


  // update product
  app.put("/update-Product/:id",  async (req, res) => {
    const id = req.params.id;

    try {
       
        if (!req.body.name ) {
            return res.status(400).send({ message: 'Name  are required.' });
        }

        // Find the product by ID
        const updatedProduct = await ProductModel.findByIdAndUpdate(
            id,
            {
                name: req.body.name,
                description: req.body.description,
                category: req.body.category,
                image: req.file ? req.file.filename : undefined, 
                variants: req.body.variants ? JSON.parse(req.body.variants) : [],
                inventory: {
                    stock: req.body.stock ? parseInt(req.body.stock) : 0,
                    sold: req.body.sold ? parseInt(req.body.sold) : 0,
                },
                taxDetails: {
                    taxRate: req.body.taxRate ? parseFloat(req.body.taxRate) : 0.0,
                },
                status: req.body.status,
                shippingDetails: {
                    weight: req.body.weight ? parseFloat(req.body.weight) : 0.0,
                    dimensions: {
                        length: req.body.length ? parseFloat(req.body.length) : 0.0,
                        width: req.body.width ? parseFloat(req.body.width) : 0.0,
                        height: req.body.height ? parseFloat(req.body.height) : 0.0,
                    },
                },
                returnPolicy: req.body.returnPolicy || 'Returnable',
            },
            { new: true } 
        );

      
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: "Error updating product", error: error.message });
    }
});

  

  // delete product
  app.delete('/delete-product/:id', async (req, res) => {
    const id = req.params.id;
    try {
      const product = await ProductModel.findByIdAndDelete(id);
      if (product) {
        res.send({ message: 'Product deleted successfully', product });
      } else {
        res.status(404).send({ message: 'Product not found' });
      }
    } catch (error) {
      res.status(500).send({ message: 'Error deleting product', error: error.message });
    }
  });

// search
app.get('/Search', async (req, res) => {
    const { q } = req.query;
    ProductModel.find({ name: { $regex: q, $options: 'i' } })
    .then((products) => {
        if (products.length > 0) {
            res.json(products);
        } else {
            res.status(404).json({ message: 'No products found' });
        }
    })
});




connection();

const port = process.env.PORT || 3030;
app.listen(port , () => {
    try{
    console.log(`Server listening on port ${process.env.PORT}`)
    }
    catch(err){
        console.log(err)
    }
})
