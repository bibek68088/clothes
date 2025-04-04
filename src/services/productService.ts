// src/services/productService.ts
import api from './api';

export const getProducts = async (params = {}) => {
  try {
    const response = await api.get('/products', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductById = async (id: string) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data.product;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await api.get('/products/categories/all');
    return response.data.categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};