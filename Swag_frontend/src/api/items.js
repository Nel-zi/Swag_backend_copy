// src/api/items.js
export const fetchItems = async (api) => {
  try {
    const res = await api.get("/api/items");
    return res.data;
  } catch (err) {
    console.error("Fetch items error:", err);
    throw err;
  }
};


