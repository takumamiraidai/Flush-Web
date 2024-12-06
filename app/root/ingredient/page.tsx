"use client";

import React, { useEffect, useState, FormEvent, ChangeEvent } from 'react';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface FormSupplier {
  id: number;
  name: string;
  contact: string;
}

interface FormIngredient {
  id: number;
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
  const [formSupplier, setFormSupplier] = useState<Omit<FormSupplier, 'id'>>({ name: '', contact: '' });
  const [formIngredient, setFormIngredient] = useState<Omit<FormIngredient, 'id'>>({ name: '' });
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    fetchSuppliers();
    fetchIngredients();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch(`${baseURL}/api/supplier`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json', // レスポンス形式を明示
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch suppliers: ${errorText}`);
      }
      const data = await response.json();
      setSuppliers(data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      setMessage(`Error fetching suppliers: ${(error as Error).message}`);
    }
  };
  

  const fetchIngredients = async () => {
    try {
      const response = await fetch(`${baseURL}/api/ingredient`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      if (!response.ok) throw new Error(`Failed to fetch ingredients: ${response.statusText}`);
      const data = await response.json();
      setIngredients(data);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      setMessage(`Error fetching ingredients: ${(error as Error).message}`);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    setState: React.Dispatch<React.SetStateAction<any>>
  ) => {
    const { name, value } = e.target;
    setState((prev: any) => ({
      ...prev,
      [name]: ['gram', 'price', 'ingredient_id', 'supplier_id'].includes(name) ? Number(value) : value,
    }));
  };

  const handleSubmit = async (
    e: FormEvent,
    endpoint: string,
    body: object,
    resetState: () => void,
    successMessage: string
  ) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`${baseURL}/api/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
  
      const contentType = response.headers.get('Content-Type');
      if (response.ok) {
        if (contentType && contentType.includes('application/json')) {
          const responseData = await response.json();
          console.log('Response data:', responseData);
          setMessage(successMessage);
        } else {
          const textData = await response.text();
          console.log('Response text:', textData);
          setMessage(successMessage);
        }
        resetState();
      } else {
        const errorText = await response.text();
        console.error(`Error response (${response.status}):`, errorText);
        setMessage(`Failed to submit: ${errorText}`);
      }
    } catch (error) {
      console.error('Request error:', error);
      setMessage(`Error: ${(error as Error).message}`);
    }
  };
   
   
  return (
    <div className="flex flex-col p-8 space-y-6 max-w-3xl mx-auto">
      <h1>Post FoodProduct</h1>

      <form
        onSubmit={(e) =>
          handleSubmit(
            e,
            'post_foodproduct',
            { food: formFood }, // 修正: foodオブジェクトでラップ
            () =>
              setFormFood({
                name: '',
                gram: 0,
                price: 0,
                detail: null,
                ingredient_id: 0,
                supplier_id: 0,
              }),
            'Food product successfully added!'
          )
        }
        className="flex flex-col space-y-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Food Name"
          value={formFood.name}
          onChange={(e) => handleChange(e, setFormFood)}
          required
        />
        <p>量(gram)</p>
        <input
          type="number"
          name="gram"
          placeholder="Gram"
          value={formFood.gram}
          onChange={(e) => handleChange(e, setFormFood)}
          required
        />
        <p>値段(円)</p>
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formFood.price}
          onChange={(e) => handleChange(e, setFormFood)}
          required
        />
        <p>説明</p>
        <input
          type="text"
          name="detail"
          placeholder="Detail"
          value={formFood.detail || ""} // 修正: nullを空文字列に変換
          onChange={(e) => handleChange(e, setFormFood)}
          required
        />
        <select
          name="ingredient_id"
          value={formFood.ingredient_id}
          onChange={(e) => handleChange(e, setFormFood)}
          required
        >
          <option value="">Select Ingredient</option>
          {ingredients.map((ingredient) => (
            <option key={ingredient.id} value={ingredient.id}>
              {ingredient.name}
            </option>
          ))}
        </select>
        <select
          name="supplier_id"
          value={formFood.supplier_id}
          onChange={(e) => handleChange(e, setFormFood)}
          required
        >
          <option value="">Select Supplier</option>
          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.name}
            </option>
          ))}
        </select>
        <button type="submit">Add Food Product</button>
      </form>

      {message && <p>{message}</p>}

      <h1>Post Supplier</h1>

      <form
        onSubmit={(e) =>
          handleSubmit(
            e,
            'supplier',
            formSupplier,
            () => setFormSupplier({ name: '', contact: '' }),
            'Supplier successfully added!'
          )
        }
        className="flex flex-col space-y-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Supplier Name"
          value={formSupplier.name}
          onChange={(e) => handleChange(e, setFormSupplier)}
          required
        />
        <input
          type="text"
          name="contact"
          placeholder="Supplier Contact"
          value={formSupplier.contact}
          onChange={(e) => handleChange(e, setFormSupplier)}
          required
        />
        <button type="submit">Add Supplier</button>
      </form>

      {message && <p>{message}</p>}

      <h1>Post Ingredient</h1>

      <form
        onSubmit={(e) =>
          handleSubmit(
            e,
            'ingredient',
            formIngredient,
            () => setFormIngredient({ name: '' }),
            'Ingredient successfully added!'
          )
        }
        className="flex flex-col space-y-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Ingredient Name"
          value={formIngredient.name}
          onChange={(e) => handleChange(e, setFormIngredient)}
          required
        />
        <button type="submit">Add Ingredient</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
