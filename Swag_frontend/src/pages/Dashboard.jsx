/*
  src/pages/Dashboard.js
  Example of a protected page: uses AuthContext token,
  fetches secured data via axios with Authorization header.
  Includes a Logout button that clears auth state and redirects to login.
*/




import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { fetchItems } from "../api/items";

export default function Dashboard({ axios: api }) {
  const { user, logout } = useAuth();

  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems(api)
      .then(setItems)
      .catch((err) => {
        console.error("Failed to load items", err);
        setError("Could not load dashboard items. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [api]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error)  return <div className="p-6 text-red-500 text-center">{error}</div>;

  return (
    <div className="p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">For You</h1>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
        >
          Log Out
        </button>
      </header>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow">
            <img src={item.image_url} alt={item.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="font-semibold text-lg">{item.title}</h2>
              <p className="text-sm text-gray-500">{item.subtitle}</p>
              <p className="mt-2 text-sm">
                <span className="font-medium">{item.condition}</span> by {" "}
                <span className="text-blue-600">{item.seller}</span>
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-bold text-xl">${item.price_usd.toLocaleString()}</span>
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                  Live • {item.live_count}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
