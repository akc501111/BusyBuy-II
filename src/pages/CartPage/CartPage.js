import React, { useEffect, useState } from "react";
import Loader from "../../components/UI/Loader/Loader";
import ProductList from "../../components/Product/ProductList/ProductList";
import styles from "./CartPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchCartProducts,
  setCartMap,
  clearCartAsync,
} from "../../redux/reducers/cartReducer";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import { getUserCartProducts } from "../../utils/utils";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { cartProducts, loading } = useSelector(
    (state) => state.cart
  );

  const [purchasing, setPurchasing] = useState(false);

  // Fetch all cart products for the user
  useEffect(() => {
    console.log("start")
  if (!user?.uid) return;
      // console.log("running")


  const unsubscribe = getUserCartProducts(user.uid, (cartMap) => {
    // console.log(cartMap)
    dispatch(setCartMap(cartMap));
    dispatch(fetchCartProducts(cartMap));
  });
  // console.log("ending")

  return () => unsubscribe();
}, [user?.uid, dispatch]);




  const purchaseProductsHandler = async () => {
    // Write code to purchase the item present in the cart
    // Redirect the user to orders page after successful purchase
    // Clear the item present in the cart after successful purchase
    try {
      if (!user?.uid || !cartProducts.length) return;

      setPurchasing(true);

      const orderData = {
        userId: user.uid,
        order: cartProducts.map((p) => ({
          productId: p.id,
          title: p.title,
          quantity: p.quantity,
          price: p.price,
          date: Date.now(),
        })),
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "usersOrders"), orderData);
      await dispatch(clearCartAsync({ userId: user.uid }));
      toast.success("Order placed successfully");
      navigate("/myorders");
    } finally {
      setPurchasing(false);
    }
  };

  if (!user) return <h2>Login to view cart products</h2>;
  if (loading) return <Loader />;

  return (
    <div className={styles.cartPageContainer}>
      {/*cartProduct here is the array of item present in the cart for the user yu can change this as per your need */}
      {!!cartProducts?.length && (
        <aside className={styles.totalPrice}>
          <p>
            TotalPrice:- ₹
            {cartProducts.reduce(
              (total, product) =>
                total + product.price * product.quantity,
              0
            )}
            /-
          </p>
          <button
            className={styles.purchaseBtn}
            onClick={purchaseProductsHandler}
          >
            {purchasing ? "Purchasing" : "Purchase"}
          </button>
        </aside>
      )}
      {!!cartProducts?.length ? (
        <ProductList
          products={cartProducts}
          style={styles}
          onCart={true}
        />
      ) : (
        <h1>Cart is Empty!</h1>
      )}
    </div>
  );
};

export default CartPage;
