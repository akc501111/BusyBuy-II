import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import { addDataToCollection } from "../../utils/utils";

/* ================= ASYNC THUNK ================= */

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const colRef = collection(db, "products");
    const snapshot = await getDocs(colRef);

    // Seed only once if empty
    if (snapshot.empty) {
      await addDataToCollection();
      const seededSnapshot = await getDocs(colRef);
      return seededSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    }

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }
);

/* ================= SLICE ================= */

const productSlice = createSlice({
  name: "products",
  initialState: {
    allProducts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.allProducts = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;
