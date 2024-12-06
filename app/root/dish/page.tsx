"use client";

import React, { useEffect, useState, FormEvent, ChangeEvent } from "react";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Ingredient {
  id: number;
  name: string;
}

interface DishIngredient {
  ingredient_id: number;
  quantity: number;
}

interface DishForm {
  name: string;
  content?: string | null;
  calorie?: number | null;
  ingredients: DishIngredient[];
}

export default function DishPostPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formDish, setFormDish] = useState<DishForm>({
    name: "",
    content: "",
    calorie: null,
    ingredients: [],
  });
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      const response = await fetch(`${baseURL}/api/ingredient`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error(`Failed to fetch ingredients: ${response.statusText}`);
      const data = await response.json();
      setIngredients(data);
    } catch (error) {
      setError(`Error fetching ingredients: ${(error as Error).message}`);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormDish((prev) => ({
      ...prev,
      [name]: name === "calorie" ? (value ? parseFloat(value) : null) : value,
    }));
  };

  const handleIngredientSelect = (id: number) => {
    setFormDish((prev) => {
      const isSelected = prev.ingredients.some((item) => item.ingredient_id === id);
      const updatedIngredients = isSelected
        ? prev.ingredients.filter((item) => item.ingredient_id !== id)
        : [...prev.ingredients, { ingredient_id: id, quantity: 0 }];
      return { ...prev, ingredients: updatedIngredients };
    });
  };

  const handleIngredientQuantityChange = (id: number, quantity: number) => {
    setFormDish((prev) => {
      const updatedIngredients = prev.ingredients.map((item) =>
        item.ingredient_id === id ? { ...item, quantity } : item
      );
      return { ...prev, ingredients: updatedIngredients };
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage("");

    if (formDish.ingredients.length === 0) {
      setError("Please select at least one ingredient.");
      return;
    }

    const payload = {
      dish: {
        name: formDish.name,
        content: formDish.content ?? null,
        calorie: formDish.calorie ?? null,
      },
      ingredients: formDish.ingredients.map((ingredient) => ({
        id: ingredient.ingredient_id,
        quantity: ingredient.quantity,
      })),
    };

    console.log("Submitting dish payload:", JSON.stringify(payload, null, 2));

    try {
      const response = await fetch(`${baseURL}/api/post_dish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to submit dish: ${errorText}`);
      }

      const responseData = await response.json();
      setMessage(responseData.message || "Dish successfully added!");
      setFormDish({ name: "", content: null, calorie: null, ingredients: [] });
    } catch (error) {
      setError(`Error: ${(error as Error).message}`);
    }
  };

  const filteredIngredients = ingredients.filter((ingredient) =>
    ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col p-8 space-y-6 max-w-3xl mx-auto">
      <h1>Post a New Dish</h1>
      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-green-500">{message}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Dish Name"
          value={formDish.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="content"
          placeholder="Dish Content"
          value={formDish.content || ""}
          onChange={handleChange}
        />
        <input
          type="number"
          name="calorie"
          placeholder="Calories"
          value={formDish.calorie ?? ""}
          onChange={handleChange}
        />
        <h2>Ingredients</h2>
        <input
          type="text"
          placeholder="Search Ingredients"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        <div className="flex flex-col space-y-2">
          {filteredIngredients.map((ingredient) => (
            <div key={ingredient.id} className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={formDish.ingredients.some((i) => i.ingredient_id === ingredient.id)}
                onChange={() => handleIngredientSelect(ingredient.id)}
              />
              <span>{ingredient.name}</span>
              {formDish.ingredients.some((i) => i.ingredient_id === ingredient.id) && (
                <input
                  type="number"
                  min="0"
                  placeholder="Quantity"
                  value={
                    formDish.ingredients.find((i) => i.ingredient_id === ingredient.id)?.quantity || ""
                  }
                  onChange={(e) =>
                    handleIngredientQuantityChange(
                      ingredient.id,
                      parseFloat(e.target.value) || 0
                    )
                  }
                />
              )}
            </div>
          ))}
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Dish
        </button>
      </form>
    </div>
  );
}
