import { Cart } from '../models/Cart.js';
import { Product } from '../models/Product.js';
import { Offer } from '../models/Offer.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';

const getPopulatedCart = async (cart) => {
  const itemsWithProduct = await Promise.all(
    (cart.items || []).map(async (item) => {
      let product = null;
      if (typeof item.productId === 'string' && item.productId.match(/^[0-9a-fA-F]{24}$/)) {
        product = await Product.findById(item.productId);
      }
      if (!product) {
        product = await Product.findOne({ $or: [{ id: item.productId }, { slug: item.productId }] });
      }
      return {
        productId: item.productId,
        quantity: item.quantity,
        variant: item.variant,
        size: item.size,
        product: product ? product.toJSON() : null
      };
    })
  );

  const validItems = itemsWithProduct.filter(i => i.product);
  const subtotal = validItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const discount = cart.coupon ? Math.round(subtotal * (cart.coupon.discountPercent / 100)) : 0;
  const shipping = subtotal > 1500 || subtotal === 0 ? 0 : 150;
  const total = Math.max(0, subtotal - discount + shipping);

  return {
    items: validItems,
    coupon: cart.coupon,
    subtotal,
    discount,
    shipping,
    total,
    itemCount: validItems.reduce((acc, item) => acc + item.quantity, 0)
  };
};

export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne();
    if (!cart) {
      cart = await Cart.create({ items: [], coupon: null });
    }
    const populated = await getPopulatedCart(cart);
    return successResponse(res, populated);
  } catch (err) {
    next(err);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1, variant = 'Standard', size = 'Standard' } = req.body;
    let cart = await Cart.findOne();
    if (!cart) cart = await Cart.create({ items: [], coupon: null });

    const existingIdx = cart.items.findIndex(
      i => i.productId === productId && i.variant === variant && i.size === size
    );

    if (existingIdx > -1) {
      cart.items[existingIdx].quantity += Number(quantity);
    } else {
      cart.items.push({ productId, quantity: Number(quantity), variant, size });
    }

    await cart.save();
    const populated = await getPopulatedCart(cart);
    return successResponse(res, populated, 'Item added to shopping bag');
  } catch (err) {
    next(err);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { quantity, variant } = req.body;
    const { productId } = req.params;
    let cart = await Cart.findOne();
    if (!cart) return errorResponse(res, 'Cart not found', 404);

    const item = cart.items.find(i => i.productId === productId && (!variant || i.variant === variant));
    if (item) {
      if (quantity <= 0) {
        cart.items = cart.items.filter(i => !(i.productId === productId && (!variant || i.variant === variant)));
      } else {
        item.quantity = Number(quantity);
      }
      await cart.save();
    }

    const populated = await getPopulatedCart(cart);
    return successResponse(res, populated);
  } catch (err) {
    next(err);
  }
};

export const removeCartItem = async (req, res, next) => {
  try {
    const { variant } = req.query;
    const { productId } = req.params;
    let cart = await Cart.findOne();
    if (!cart) return errorResponse(res, 'Cart not found', 404);

    cart.items = cart.items.filter(i => !(i.productId === productId && (!variant || i.variant === variant)));
    await cart.save();

    const populated = await getPopulatedCart(cart);
    return successResponse(res, populated, 'Item removed from bag');
  } catch (err) {
    next(err);
  }
};

export const applyCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) return errorResponse(res, 'Coupon code is required', 400);

    const offer = await Offer.findOne({ code: code.trim().toUpperCase(), isActive: true });
    if (!offer) {
      return errorResponse(res, 'Invalid or expired coupon code. Try NIHARA10 or GLOW20', 400);
    }

    let cart = await Cart.findOne();
    if (!cart) cart = await Cart.create({ items: [], coupon: null });

    cart.coupon = {
      code: offer.code,
      discountPercent: offer.discountPercent
    };
    await cart.save();

    return successResponse(res, { coupon: cart.coupon }, `Coupon ${offer.code} applied!`);
  } catch (err) {
    next(err);
  }
};

export const removeCoupon = async (req, res, next) => {
  try {
    let cart = await Cart.findOne();
    if (cart) {
      cart.coupon = null;
      await cart.save();
    }
    const populated = cart ? await getPopulatedCart(cart) : { items: [], total: 0 };
    return successResponse(res, populated, 'Coupon removed');
  } catch (err) {
    next(err);
  }
};
