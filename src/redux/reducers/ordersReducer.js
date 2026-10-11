import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserOrders } from "../../utils/utils";

/* ================= GET USER ORDERS ================= */

export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async ({ userId }) => {
    const orders = await getUserOrders(userId);

    const normalizedOrders = orders.map(order => ({
      ...order,
      createdAt:
        typeof order.createdAt === "number"
          ? order.createdAt
          : order.createdAt?.toMillis
          ? order.createdAt.toMillis()
          : 0,
    }));

    return normalizedOrders.sort(
      (a, b) => b.createdAt - a.createdAt
    );
  }
);



/* ================= SLICE ================= */

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.log(action.error.message);
      });
  },
});

export default ordersSlice.reducer;
