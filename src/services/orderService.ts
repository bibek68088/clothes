// src/services/orderService.ts
import api from './api';

export const createOrder = async (orderData: { addressId: string, paymentMethod: string }) => {
  try {
    const response = await api.post('/orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getUserOrders = async () => {
  try {
    const response = await api.get('/orders');
    return response.data.orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const getOrderById = async (id: string) => {
  try {
    const response = await api.get(`/orders/${id}`);
    return response.data.order;
  } catch (error) {
    console.error(`Error fetching order ${id}:`, error);
    throw error;
  }
};

export const processPayment = async (paymentData: { paymentIntentId: string, paymentMethodId: string }) => {
  try {
    const response = await api.post('/orders/payment', paymentData);
    return response.data;
  } catch (error) {
    console.error('Error processing payment:', error);
    throw error;
  }
};