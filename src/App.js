import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const ProductForm = ({ onProductAdd, onProductEdit, editProduct }) => {
  const [formData, setFormData] = useState({
    _id: '',
    name: '',
    img: '',
    price: 0,
  });

  useEffect(() => {
    setFormData(editProduct || { _id: '', name: '', img: '', price: 0 });
  }, [editProduct]);

  const handleChange = (e) => {
    const value =
      e.target.name === '_id' || e.target.name === 'price' ? parseInt(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editProduct) {
      axios.put(`http://127.0.0.1:5000/products/${editProduct._id}`, formData)
        .then((response) => {
          onProductEdit(response.data);
        })
        .catch((error) => {
          console.error('Error updating product:', error);
        });
    } else {
      axios.post('http://127.0.0.1:5000/products', formData)
        .then((response) => {
          onProductAdd(response.data);
        })
        .catch((error) => {
          console.error('Error creating product:', error);
        });
    }
  };

  return (
    <div className="product-form">
      <h2>{editProduct ? 'Edit Product' : 'Add Product'}</h2>
      <form onSubmit={handleSubmit}>
        <label>ID:</label>
        <input type="number" name="_id" value={formData._id} onChange={handleChange} />

        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} />

        <label>Image URL:</label>
        <input type="text" name="img" value={formData.img} onChange={handleChange} />

        <label>Price:</label>
        <input type="number" name="price" value={formData.price} onChange={handleChange} />

        <button type="submit">{editProduct ? 'Update Product' : 'Add Product'}</button>
      </form>
    </div>
  );
};

const ProductList = ({ products, onProductDelete, onProductEdit }) => {
  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/products/${productId}`);
      onProductDelete(productId);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleEdit = (product) => {
    onProductEdit(product);
  };

  return (
    <ul className="product-list">
      {products.map((product) => (
        <li key={product._id} className="product-item">
          <div className="product-details">
            <img src={product.img} alt={product.name} className="product-img" />
            <div className="product-info">
              <h3>{product.name}</h3>
              <p>ID: {product._id}</p>
              <p>Price: ${parseFloat(product.price).toFixed(2)}</p>
            </div>
          </div>
          <div className="product-actions">
            <button onClick={() => handleDelete(product._id)}>Delete</button>
            <button onClick={() => handleEdit(product)}>Edit</button>
          </div>
        </li>
      ))}
    </ul>
  );
};

const ProductApp = () => {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [deleting]);

  const handleProductAdd = (newProduct) => {
    setProducts([...products, newProduct]);
  };

  const handleProductDelete = async (productId) => {
    try {
      setDeleting(true);
      await axios.delete(`http://127.0.0.1:5000/products/${productId}`);
      setProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId));
      setDeleting(false);
      if (editProduct && editProduct._id === productId) {
        setEditProduct(null);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleEditProduct = (product) => {
    setEditProduct(product);
  };

  const handleProductEdit = (editedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => (product._id === editedProduct._id ? editedProduct : product))
    );
    setEditProduct(null);
  };

  return (
    <div className="product-app">
      <h1>SHOP NOTEBOOK STORE</h1>
      <ProductList
        products={products}
        onProductDelete={handleProductDelete}
        onProductEdit={handleEditProduct}
      />
      <ProductForm
        onProductAdd={handleProductAdd}
        onProductEdit={handleProductEdit}
        editProduct={editProduct}
      />
    </div>
  );
};

export default ProductApp;
