import React, { useState } from "react";
import styles from "./ProductDetails.module.css";
import { useNavigate } from "react-router-dom";
import MinusIcon from "../../../UI/Icons/MinusIcon";
import PlusIcon from "../../../UI/Icons/PlusIcon";
import { useDispatch, useSelector } from "react-redux";
import {
  increaseProductQuantity,
  decreaseProductQuantity,
  removeProduct as removeProductAction,
} from "../../../../redux/reducers/cartReducer";

const ProductDetails = ({ title, price, productId, onCart, quantity }) => {
  const [productAddingToCart, setProductAddingToCart] = useState(false);
  const [productRemovingFromCart, setProductRemovingCart] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const addProductToCart = async () => {
    // Function to add product to cart
    if (!user) {
      navigate("/signin");
      return;
    }

    try {
      setProductAddingToCart(true);
      await dispatch(
        increaseProductQuantity({
          userId: user.uid,
          productId,
          meta: {
            requiresAuth: true,
            successMessage: "Product added to cart",
            errorMessage: "Failed to add product to cart",
          },
        })
      );
    } finally {
      setProductAddingToCart(false);
    }
  };

  const removeProduct = async () => {
    // Function to remaove the cart
    if (!user) return;

    try {
      setProductRemovingCart(true);
      await dispatch(
        removeProductAction({
          userId: user.uid,
          productId,
          meta: {
            requiresAuth: true,
            successMessage: "Product removed from cart",
            errorMessage: "Failed to remove product from cart",
          },
        })
      );
    } finally {
      setProductRemovingCart(false);
    }
  };

  const handleAdd = async () => {
    // Function for Handling the product quantity increase
    if (!user) return;

    await dispatch(
      increaseProductQuantity({
        userId: user.uid,
        productId,
        meta: {
          requiresAuth: true,
          successMessage: "Quantity increased",
          errorMessage: "Failed to increase quantity",
        },
      })
    );
  };

  const handleRemove = async () => {
    // Handling the product quantity decrease
    if (!user) return;
    if(quantity===1){
      removeProduct();
      return
    }

    await dispatch(
      decreaseProductQuantity({
        userId: user.uid,
        productId,
        meta: {
          requiresAuth: true,
          successMessage: "Quantity decreased",
          errorMessage: "Failed to decrease quantity",
        },
      })
    );
  };

  return (
    <div className={styles.productDetails}>
      <div className={styles.productName}>
        <p>{`${title.slice(0, 35)}...`}</p>
      </div>

      <div className={styles.productOptions}>
        <p>₹ {price}</p>

        {onCart && (
          <div className={styles.quantityContainer}>
            <MinusIcon handleRemove={handleRemove} />
            {quantity}
            <PlusIcon handleAdd={handleAdd} />
          </div>
        )}
      </div>

      {/* Conditionally Rendering buttons based on the screen */}
      {!onCart ? (
        <button
          className={styles.addBtn}
          title="Add to Cart"
          disabled={productAddingToCart}
          onClick={addProductToCart}
        >
          {productAddingToCart ? "Adding" : "Add To Cart"}
        </button>
      ) : (
        <button
          className={styles.removeBtn}
          title="Remove from Cart"
          onClick={removeProduct}
        >
          {productRemovingFromCart ? "Removing" : "Remove From Cart"}
        </button>
      )}
    </div>
  );
};

export default ProductDetails;
