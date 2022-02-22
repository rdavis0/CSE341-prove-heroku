const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: String,
    resetTokenExpiration: Date,
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: { type: Number, required: true }
        }]
    },
    wishlist: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },

        }]
    }
});

userSchema.methods.addToCart = function(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
        updatedCartItems.push({
            productId: product._id,
            quantity: newQuantity
        });
    }
    const updatedCart = {
        items: updatedCartItems
    };
    this.cart = updatedCart;
    return this.save();
};

userSchema.methods.removeFromCart = function(productId) {
    const updatedCartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== productId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
};

userSchema.methods.clearCart = function() {
    this.cart = { items: [] };
    return this.save();
};

userSchema.methods.addToWishlist = function(product) {
    const updatedWishlistItems = [...this.wishlist.items];
    updatedWishlistItems.push({
        productId: product._id
    });
    const updatedWishlist = {
        items: updatedWishlistItems
    };
    this.wishlist = updatedWishlist;
    return this.save();
};

userSchema.methods.removeFromWishlist = function(productId) {
    const updatedWishlistItems = this.wishlist.items.filter(item => {
        return item.productId.toString() !== productId.toString();
    });
    this.wishlist.items = updatedWishlistItems;
    return this.save();
};

module.exports = mongoose.model('User', userSchema);