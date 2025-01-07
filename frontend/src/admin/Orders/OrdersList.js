import React from 'react';
import './OrdersList.css';
import Sidebar from '../Sidebar/Sidebar';

const OrdersList = () => {
  const orders = [
    {
      id: 1,
      customer: 'John Doe',
      address: '123 Main St, City A',
      items: ['Item1', 'Item2'],
      total: 'Rs.150',
      payment: 'Paid',
      status: 'Delivered',
    },
    {
      id: 2,
      customer: 'Jane Smith',
      address: '456 Elm St, City B',
      items: ['Item3', 'Item4'],
      total: 'Rs.200',
      payment: 'Pending',
      status: 'Processing',
    },
    {
      id: 3,
      customer: 'Peter Parker',
      address: '789 Oak St, City C',
      items: ['Item5', 'Item6'],
      total: 'Rs.250',
      payment: 'Paid',
      status: 'Shipped',
    },
  ];

  const handleAction = (action, orderId) => {
    alert(`Action: ${action} for Order ID: ${orderId}`);
    // Add your logic here for handling actions
  };

  return (
    <div>
      <Sidebar/>
    <div className="orders-list">
      <h2>Order List</h2>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer Name</th>
            <th>Address</th>
            <th>Items</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Status of Order</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer}</td>
              <td>{order.address}</td>
              <td>{order.items.join(', ')}</td>
              <td>{order.total}</td>
              <td>{order.payment}</td>
              <td>{order.status}</td>
              <td>
                <select
                  onChange={e => handleAction(e.target.value, order.id)}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Action
                  </option>
                  <option value="Payment Pending">Payment Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancel">Cancel</option>
                  <option value="Return">Return</option>
                  <option value="Refund">Refund</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default OrdersList;
