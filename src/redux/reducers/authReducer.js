import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
} from "firebase/auth";
import { auth } from "../../config/firebase";

/* ================= ASYNC THUNKS ================= */

// LOGIN
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async ({ email, password }, { rejectWithValue }) => {

        const res = await signInWithEmailAndPassword(auth, email, password);
        const user = res.user;

        return {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
        };
    }
);

// REGISTER
export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async ({ name, email, password }, { rejectWithValue }) => {

        const res = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(res.user, { displayName: name });

        const user = res.user;
        return {
            uid: user.uid,
            email: user.email,
            displayName: name,
        };
    }
);

// LOGOUT
export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async () => {
        await signOut(auth);
    }
);

// AUTH STATE LISTENER
export const listenToAuthChanges = createAsyncThunk(
    "auth/listenToAuthChanges",
    async (_, { dispatch }) => {
        onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                dispatch(
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        displayName: firebaseUser.displayName,
                    })
                );
            } else {
                dispatch(setUser(null));
            }
            dispatch(setAuthLoading(false));
        });
    }
);

/* ================= SLICE ================= */

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        loading: true,
        error: null,
    },
    reducers: {
        setUser(state, action) {
            state.user = action.payload;
        },
        setAuthLoading(state, action) {
            state.loading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder

            // LOGIN
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // REGISTER
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // LOGOUT
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.loading = false;
            });
    },
});

export const { setUser, setAuthLoading } = authSlice.actions;
export default authSlice.reducer;
