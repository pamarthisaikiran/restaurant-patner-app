// Orders.js
import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebase'; // Ensure you have auth for current user
import { collection, getDocs, query, where } from 'firebase/firestore';
import Header from '../Header';
import "./index.css"; // Make sure you create this CSS file for styles

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const user = auth.currentUser; // Get the current user
      if (!user) return; // If no user, exit

      try {
        const ordersCollection = collection(db, 'orders');
        const q = query(ordersCollection, where("userId", "==", user.uid)); // Fetch orders for the current user
        const ordersSnapshot = await getDocs(q);
        
        const ordersList = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(ordersList);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false); // Stop loading when done
      }
    };

    fetchOrders(); // Fetch orders on component mount
  }, []);

  return (
    <>
      <Header />
      <div className="orders-list">
        <h2>Your Orders</h2>
        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <ul>
            {orders.map((order) => (
              <li key={order.id} className="order-item">
                <h3>Order from: {order.restaurantName}</h3>
                <p>Order Status: {order.orderStatus}</p>
                <p>Total Price: {order.totalPrice}</p>
                <p>Timestamp: {new Date(order.timestamp).toLocaleString()}</p>
                <h4>Items:</h4>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index} className="order-detail">
                      <p>Name: {item.name}</p>
                      <p>Price: {item.price}</p>
                      <p>Quantity: {item.quantity}</p>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Orders;
