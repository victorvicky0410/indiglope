const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Add product to cart
exports.addToCart = async (req, res) => {
  const { product_id, quantity = 1, mobilenumber } = req.body;
  
  try {
    // Find product by product_id
    const product = await Product.findOne({ product_id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find user's cart by mobilenumber
    let cart = await Cart.findOne({ mobilenumber });
    if (!cart) {
      cart = new Cart({ mobilenumber, items: [] });
    }

    // Check if item already exists in cart
    const existingItem = cart.items.find(item => item.product_id === product_id);
    if (existingItem) {
      // If product already in cart, update quantity
      existingItem.quantity += quantity;
    } else {
      // Otherwise, add new item to cart
      cart.items.push({
        product_id: product.product_id,
        product_name: product.product_name,
        description: product.description,
        image: product.image,
        selling_price: product.selling_price,
        product_price: product.product_price,
        quantity,
      });
    }

    // Save the updated cart
    await cart.save();
    res.status(200).json({ message: 'Item added to cart', cart });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get cart items for a user based on mobilenumber
exports.getCartItems = async (req, res) => {
  const { mobilenumber } = req.query;
  
  try {
    // Find cart by mobilenumber
    const cart = await Cart.findOne({ mobilenumber });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.status(200).json(cart.items);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};



// Update cart item quantity (increase or decrease)
exports.updateCart = async (req, res) => {
  try {
    const { mobilenumber, product_id, quantity } = req.body;

    // Find the cart by mobile number
    const cart = await Cart.findOne({ mobilenumber });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found for this mobile number.' });
    }

    // Find the item to update in the cart
    const itemIndex = cart.items.findIndex(item => item.product_id === product_id);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart.' });
    }

    // Update the quantity of the item
    cart.items[itemIndex].quantity = quantity;

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: 'Cart updated successfully', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating cart', error: error.message });
  }
};


// Handle delete item from cart
exports.deleteItemFromCart = async (req, res) => {
  const { mobilenumber, product_id } = req.body;

  console.log('Request body:', req.body); // Log the incoming data for debugging

  if (!mobilenumber || !product_id) {
    return res.status(400).json({ error: 'Mobile number and product ID are required' });
  }

  try {
    // Find the user's cart by mobilenumber
    const cart = await Cart.findOne({ mobilenumber });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Find the index of the item in the cart
    const itemIndex = cart.items.findIndex(item => item.product_id === product_id);

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found in the cart' });
    }

    // Remove the item from the cart array
    cart.items.splice(itemIndex, 1);

    // Save the updated cart
    await cart.save();

    return res.status(200).json({ message: 'Item deleted from the cart successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    return res.status(500).json({ error: 'Failed to delete item from the cart' });
  }
};




