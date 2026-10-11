import React, { useEffect } from "react";
import styles from "./OrdersPage.module.css";
import OrderTable from "../../components/OrderTable/OrderTable";
import Loader from "../../components/UI/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrders } from "../../redux/reducers/ordersReducer";

const OrdersPage = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { orders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(
      fetchUserOrders({
        userId: user?.uid,
      }, {
        meta: {
          requiresAuth: true,
        },
      })
    );
  }, [dispatch, user?.uid]);

  if (loading) return <Loader />;

  if (!orders.length) {
    return <h1 style={{ textAlign: "center" }}>No Orders Found!</h1>;
  }

  return (
    <div className={styles.ordersContainer}>
      <h1>Your Orders</h1>

      {orders.map((orderDoc) => (
        <OrderTable key={orderDoc.id} order={orderDoc.order} />
      ))}
    </div>
  );
};

export default OrdersPage;
