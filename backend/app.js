/*
The endpoint for POST operation '/edit/product/:productId' is yet to be tested

Subscription should be implemented within? mongoose.connect.then(), where there's already some test code to begin with
*/

// ---IMPORT
const Product = require('./models/Product');
const User = require('./models/User');
const Comment = require('./models/Comment');


const express = require('express');
const app = express();
app.use(express.json());

const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const multer = require('multer');
const PNG = require('pngjs').PNG;
const fs = require('fs');

const { requireAuth } = require('./middleware/authMiddleware');
app.use(authRoutes);

// notice that uri includes the database name before ?, 'mongodb.net/<db-name>?retry...'
const uri = 'your_mongo_db_uri';
mongoose.connect(uri)
  .then((res) => { 
	app.listen(3000);
	console.log('server is running on port 3000');
	
	// Set up a change stream on the 'users' collection
    const changeStream = Product.watch();

    // Listen for changes in the 'users' collection
    changeStream.on('change', (change) => {
      console.log('Change occurred:', change);
      // Handle the change event here
    });
	
  })
  .catch((err) => console.log(err));

// routes
app.get('/users', requireAuth, (req, res) => {
	// only admin can view users' details
});

// app.post('/users', requireAuth, (req, res) => {
	// to change user credentials
// });

// Serve images from the 'images' directory
app.use('/uploads', express.static('uploads'));

app.get('/products', /*requireAuth,*/ async (req, res) => {
	// all roles can view products
  try {
    // Fetch all products from the MongoDB collection
    let products = await Product.find();
	
	let parts = [];
	
	for (const product of products){
		
		const comments = await Comment.find({ "_productId": product._id });
		let totalRating = 0;
		comments.forEach((comment) => {
			totalRating += comment.rate;
		});
		
		const rate = totalRating / comments.length;
		console.log("rate is ", rate);
		
		const obj = {
			product: {
				_id: product._id,
				name: product.name,
				description: product.description,
				price: product.price,
				category: product.category,
				imagePath: product.imagePath,
				rate: rate.toFixed(1),
				__v: product.__v,
			}
		}
		
		// Send the response as JSON with both product information and image data
		parts.push(obj);
		
	}
	
	console.log("--------JSON OBJECTS ARRAY--------");
	console.log(parts);
	
    //// Send the products as a JSON response
    // res.status(200).json(products);
	// Join the parts and send the response
	res.json(parts);
	
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
	
});

// Route to get product by ID
app.get('/products/:productId', async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json(product);
});

// Route to get comment by user ID
app.get('/commentsByUser/:userId', async (req, res) => {
  const { userId } = req.params;
  const comments = await Comment.find({"_userId": userId});

  if (!comments) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  let commentsArray = [];
  
  for (const comment of comments) {
	  const user = await User.findById( userId );
	  const product = await Product.findById( comment._productId );
	  
	  const newCommentObj = {
		  _id: comment._id,
		  _userId: comment._userId,
		  _productId: comment._productId,
		  productName: product.name,
		  username: user.nickname,
		  updated: comment.updated,
		  text: comment.text,
		  rate: comment.rate,
		  __v: comment.__v
	  };
	  
	  commentsArray.push(newCommentObj);
  }

  res.json(commentsArray);
});

app.get('/commentsByProduct/:productId', /*requireAuth,*/ async (req, res) => {
	// all roles can view comments
  const { productId } = req.params;
  const comments = await Comment.find({ "_productId": productId });

  if (!comments) {
    return res.status(404).json({ error: 'Comments not found' });
  }
  
  let commentsArray = [];
  
  for (const comment of comments) {
	  const user = await User.findById( comment._userId );
	  
	  const newCommentObj = {
		  _id: comment._id,
		  _userId: comment._userId,
		  _productId: comment._productId,
		  username: user.nickname,
		  updated: comment.updated,
		  text: comment.text,
		  rate: comment.rate,
		  __v: comment.__v
	  };
	  
	  commentsArray.push(newCommentObj);
  }
  
  res.json(commentsArray);
});



// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: 'uploads/', // Specify the directory to save the uploaded files
  filename: (req, file, callback) => {
    callback(null, `${req.body.name}.png`);
  },
});

const upload = multer({ storage });

// Handle POST request for creating a new product
app.post('/products', upload.single('image'), async (req, res) => {

  // Extract product details from request body
  const { name, description, price, category} = req.body;
  let imagePath = "uploads/" + `${name.trim()}.png`;
  
  try {

    // Check if image file is present in the request
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    // Create a new Product instance
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      imagePath,
    });

    // Save the new product to MongoDB
    await newProduct.save();

    // Send a success response
    res.status(201).json({ message: 'Product created successfully' });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/edit/product/:productId', upload.single('image'), /*requireAuth,*/ async (req, res) => {
  const { productId } = req.params;
  
  // Extract product details from request body
  const { updatedField, updatedValue, productName } = req.body;
  let imagePath;
  if (updatedField == 'image')
	updateValue = "uploads/" + `${productName.trim()}.png`;
  
  try {
    const result = await Product.updateOne(
      { _id: productId },
        { $set: { 
		  [updatedField]: updatedValue,
		  } 
		}
    );

    if (result.modifiedCount > 0) {
      console.log(`Product with ID ${productId} updated successfully.`);
	  res.status(201).json("Edited Successfully");
    } else {
      console.log(`Product with ID ${productId} not found or not modified.`);
	  res.status(500).json('Error editing the comment');
    }
  } catch (error) {
    console.error('Error updating product:', error.message);
	res.status(500).json('Error editing the product');
  }
});

app.post('/edit/comment/:commentId', /*requireAuth,*/ async (req, res) => {
  const { commentId } = req.params;
  const { _userId, _productId, updated, text, rate } = req.body;
  try {
    const result = await Comment.updateOne(
      { _id: commentId },
      { $set: { updated, text } }
    );

    if (result.modifiedCount > 0) {
      console.log(`Comment with ID ${commentId} updated successfully.`);
	  res.status(201).json("Edited Successfully");
    } else {
      console.log(`Comment with ID ${commentId} not found or not modified.`);
	  res.status(500).json('Error editing the comment');
    }
  } catch (error) {
    console.error('Error updating comment:', error.message);
	res.status(500).json('Error editing the comment');
  }
});

app.post('/comments', /*requireAuth,*/ async (req, res) => {
	// only users can post comments
	const { _userId, _productId, updated, text, rate} = req.body;
	
	try {
		
		// Check if a comment by the user already exists for the product
		const existingComment = await Comment.findOne({ _userId, _productId });
		
		if (existingComment) {
		    // The person has already made a comment on the product
		    console.log('User has already commented on this product.');
	  
		    res.status(400).json("Comment exists");
		} else {
		    // The person has not commented on the product
		    console.log('User has not commented on this product yet.');
		  
		    const user = await Comment.create({_userId, _productId, updated, text: text.trim(), rate});
		  
		    res.status(201).json("Success");
		}
		
		
	} 
	catch(error) {
		console.error('Error publishing comment:', error);
		res.status(400).json( {error} );
	}
});

