import User from './User.js'
import Category from './Category.js'
import Product from './Product.js'
import Cart from './Cart.js'
import CartItem from './CartItem.js'
import Order from './Order.js'
import OrderItem from './OrderItem.js'
import Address from './Address.js'
import Review from './Review.js'
import Wishlist from './Wishlist.js'

// 定義關聯關係

// User 關聯
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' })
User.hasMany(Address, { foreignKey: 'userId', as: 'addresses' })
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' })
User.hasMany(Wishlist, { foreignKey: 'userId', as: 'wishlists' })
User.hasOne(Cart, { foreignKey: 'userId', as: 'cart' })

// Category 關聯
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' })

// Product 關聯
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' })
Product.hasMany(CartItem, { foreignKey: 'productId', as: 'cartItems' })
Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' })
Product.hasMany(Review, { foreignKey: 'productId', as: 'reviews' })
Product.hasMany(Wishlist, { foreignKey: 'productId', as: 'wishlists' })

// Cart 關聯
Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' })
Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'items' })

// CartItem 關聯
CartItem.belongsTo(Cart, { foreignKey: 'cartId', as: 'cart' })
CartItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' })

// Order 關聯
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' })
Order.belongsTo(Address, { foreignKey: 'shippingAddressId', as: 'shippingAddress' })
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' })

// OrderItem 關聯
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' })
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' })

// Address 關聯
Address.belongsTo(User, { foreignKey: 'userId', as: 'user' })
Address.hasMany(Order, { foreignKey: 'shippingAddressId', as: 'orders' })

// Review 關聯
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' })
Review.belongsTo(Product, { foreignKey: 'productId', as: 'product' })

// Wishlist 關聯
Wishlist.belongsTo(User, { foreignKey: 'userId', as: 'user' })
Wishlist.belongsTo(Product, { foreignKey: 'productId', as: 'product' })

export {
  User,
  Category,
  Product,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Address,
  Review,
  Wishlist
}