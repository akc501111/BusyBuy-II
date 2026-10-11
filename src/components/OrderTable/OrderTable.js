import React from "react";
import styles from "./OrderTable.module.css";
import { convertDate } from "../../utils/utils";

const OrderTable = ({ order }) => {
  if (!order.length) return null;

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      {order[0]?.date && <h2>Ordered On:- {convertDate(order[0].date)}</h2>}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total Price</th>
          </tr>
        </thead>

        <tbody>
          {order.map((product, idx) => (
            <tr key={idx}>
              <td>{product.title.slice(0, 25) + "..."}</td>
              <td>{`₹ ${product.price}`}</td>
              <td>{product.quantity}</td>
              <td>{`₹ ${product.quantity * product.price}`}</td>
            </tr>
          ))}
        </tbody>

        <tfoot>
          <tr className={styles.totalPrice}>
            <td colSpan="4">
              {`₹ ${order.reduce(
                (acc, p) => acc + p.price * p.quantity,
                0
              )}`}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default OrderTable;
