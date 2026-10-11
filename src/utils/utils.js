import data from "./data";
import {
  doc,
  updateDoc,
  writeBatch,
  query,
  where,
  getDocs,
  collection,
  getDoc,
  deleteDoc,
  setDoc,
  increment,
  deleteField,
  onSnapshot
} from "firebase/firestore";
import { db } from "../config/firebase";

// Add data to the products collection only for one time so that they can be used again.
const addDataToCollection = async () => {
  try {
    const batch = writeBatch(db);
    data.forEach((product) => {
      const docRef = doc(db, "products", product.id.toString());
      batch.set(docRef, product);
    });

    const res = await batch.commit();
  } catch (error) {
    console.log(error);
  }
};

// Fetch products from firestore based on their ids
const getProductsUsingProductIds = async (cart) => {
  const productIds = Object.keys(cart).map(Number);
  if (!productIds.length) {
    return false;
  }

  const productsRef = collection(db, "products");

  const productsSnapshot = await getDocs(
    query(productsRef, where("id", "in", productIds))
  );

  const productsData = productsSnapshot.docs.map((doc) => ({
    ...doc.data(),
    quantity: cart[doc.data().id],
  }));

  return productsData;
};

// Fetch users cart products from firestore

 const getUserCartProducts = (userId, callback) => {
  const cartRef = doc(db, "usersCarts", userId);

  return onSnapshot(cartRef, (snap) => {
    if (!snap.exists()) {
      callback({});
      return;
    }
    callback(snap.data().cart);
  });
};






const getUserOrders = async (uid) => {
  if (!uid) return [];

  const ordersRef = collection(db, "usersOrders");
  const q = query(ordersRef, where("userId", "==", uid));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toMillis() ?? null,
    };
  });
};



// add product or increase to cart
const addProductToCart = async (uid, productId) => {
  const cartRef = doc(db, "usersCarts", uid);

  try {
    // If product already exists → increment
    await updateDoc(cartRef, {
      [`cart.${productId}`]: increment(1),
    });
  } catch {
    // If cart or product does not exist → create
    await setDoc(
      cartRef,
      {
        cart: {
          [productId]: 1,
        },
      },
      { merge: true }
    );
  }
};
// decrease product quantity in cart
const decreaseProductQuantiyInCart = async (uid, productId) => {
  const cartRef = doc(db, "usersCarts", uid);
  await updateDoc(cartRef, {
    [`cart.${productId}`]: increment(-1),
  });
}
// remove product from cart
const removeProductFromCart = async (uid, productId) => {
  const cartRef = doc(db, "usersCarts", uid);
  await updateDoc(cartRef, {
    [`cart.${productId}`]: deleteField(),
  });
}


// Simple function to format date
const convertDate = (timestamp) => {
  const d = new Date(timestamp);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

// Function to clear user cart after order is placed
async function clearUserCart(uid) {
  const cartRef = doc(db, "usersCarts", uid);
  await deleteDoc(cartRef);
}

export {
  addDataToCollection,
  getProductsUsingProductIds,
  getUserCartProducts,
  getUserOrders,
  convertDate,
  clearUserCart,
  addProductToCart,
  decreaseProductQuantiyInCart,
  removeProductFromCart
};
