import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProductsUsingProductIds,
  addProductToCart,
  decreaseProductQuantiyInCart,
  removeProductFromCart,
  clearUserCart,
} from "../../utils/utils";

/* ================= FETCH CART PRODUCTS ================= */

export const fetchCartProducts = createAsyncThunk(
  "cart/fetchCartProducts",
  async (cartMap) => {
    if (!cartMap || !Object.keys(cartMap).length) return [];
    return await getProductsUsingProductIds(cartMap);
  }
);

/* ================= CART MUTATIONS ================= */

export const increaseProductQuantity = createAsyncThunk(
  "cart/increase",
  async ({ userId, productId }) => {
    await addProductToCart(userId, productId);
  }
);

export const decreaseProductQuantity = createAsyncThunk(
  "cart/decrease",
  async ({ userId, productId }) => {
    await decreaseProductQuantiyInCart(userId, productId);
  }
);

export const removeProduct = createAsyncThunk(
  "cart/remove",
  async ({ userId, productId }) => {
    await removeProductFromCart(userId, productId);
  }
);

export const clearCartAsync = createAsyncThunk(
  "cart/clear",
  async ({ userId }) => {
    await clearUserCart(userId);
  }
);

/* ================= SLICE ================= */

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartMap: {},
    cartProducts: [],
    loading: true,
    error: null,
  },
  reducers: {
    setCartMap(state, action) {
      state.cartMap = action.payload;
    },
    clearCart(state) {
      state.cartMap = {};
      state.cartProducts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartProducts.pending, (state) => {
        state.loading = false;
      })
      .addCase(fetchCartProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.cartProducts = action.payload;
      })
      .addCase(fetchCartProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setCartMap, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
