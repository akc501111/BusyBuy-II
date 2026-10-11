import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../reducers/authReducer";
import productReducer from "../reducers/productsReducer";
import cartReducer from "../reducers/cartReducer";
import ordersReducer from "../reducers/ordersReducer";

import {
  authGuardMiddleware,
  toastMiddleware,
} from "../middlewares/middleWares";

// Import your reducer and use them accordingly
// Note that you have to name the auth ,product and cart only.
export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    orders: ordersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authGuardMiddleware,
      toastMiddleware
    ),
});

// Expose the store to window for debugging in development mode do not modify the below code or else the test case will not run
if (process.env.NODE_ENV === "development") {
  window.store = store;
}
