"use client";

import React, { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { onAuthStateChanged, User } from "firebase/auth";
import auth from '../../firebaseConfig'; // Firebase設定をインポート
import FileUpload from '../../ui/fileUpload';

interface FormSupplier {
  name: string;
  contact: string;
}

interface FormIngredient {
  name: string;
}

interface FormFood {
  name: string;
  gram: number;
  price: number;
  detail?: string | null;
  ingredient_id: number;
  supplier_id: number;
}

export default function IngredientPage() {
  const [suppliers, setSuppliers] = useState<FormSupplier[]>([]);
  const [ingredients, setIngredients] = useState<FormIngredient[]>([]);
  const [formFood, setFormFood] = useState<FormFood>({
    name: '',
    gram: 0,
    price: 0,
    detail: null,
    ingredient_id: 0,
    supplier_id: 0,
  });
  const [message, setMessage] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
        fetchSuppliers();
        fetchIngredients();
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('/api/supplier');
      if (response.ok) {
        const data = await response.json();
        setSuppliers(data);
      } else {
        console.error('Failed to fetch suppliers:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const fetchIngredients = async () => {
    try {
      const response = await fetch('/api/ingredient');
      if (response.ok) {
        const data = await response.json();
        setIngredients(data);
      } else {
        console.error('Failed to fetch ingredients:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching ingredients:', error);
    }
  };

  const handleFileUpload = (fileName: string) => {
    setFormFood((prevFood) => ({
      ...prevFood,
      detail: fileName,
    }));
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormFood((prevFood) => ({
      ...prevFood,
      [name]: name === 'gram' || name === 'price' || name === 'ingredient_id' || name === 'supplier_id' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/foodproduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formFood),
      });

      if (response.ok) {
        setMessage('Food product successfully added!');
        setFormFood({
          name: '',
          gram: 0,
          price: 0,
          detail: null,
          ingredient_id: 0,
          supplier_id: 0,
        });
      } else {
        const errorText = await response.text();
        setMessage(`Failed to add food product: ${errorText}`);
      }
    } catch (error) {
      console.error('Error adding food product:', error);
      setMessage(`Error: ${(error as Error).message}`);
    }
  };

  if (loading) {
    return <div className="w-full text-center py-10">Loading...</div>;
  }

  return (
    <div className="flex flex-col p-8 space-y-6 max-w-3xl mx-auto">
      <h1>Food Product Management</h1>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Food Name"
          value={formFood.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="gram"
          placeholder="Gram"
          value={formFood.gram}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formFood.price}
          onChange={handleChange}
          required
        />
        <select
          name="ingredient_id"
          value={formFood.ingredient_id}
          onChange={handleChange}
          required
        >
          <option value="">Select Ingredient</option>
          {ingredients.map((ingredient, index) => (
            <option key={index} value={index + 1}>
              {ingredient.name}
            </option>
          ))}
        </select>
        <select
          name="supplier_id"
          value={formFood.supplier_id}
          onChange={handleChange}
          required
        >
          <option value="">Select Supplier</option>
          {suppliers.map((supplier, index) => (
            <option key={index} value={index + 1}>
              {supplier.name}
            </option>
          ))}
        </select>
        <button type="submit">Add Food Product</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
