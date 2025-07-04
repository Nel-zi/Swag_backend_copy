/*
  src/pages/Dashboard.js
  Example of a protected page: uses AuthContext token,
  fetches secured data via axios with Authorization header.
  Adjust the endpoint to match the backend (e.g. "/auth/verify-identifier" or
  other secured routes).
*/

// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";

// Dashboard: protected page that fetches data from backend
export default function Dashboard({ axios }) {
  const [data, setData] = useState(null);   // store fetched data
  const [error, setError] = useState(null); // store fetch error

  useEffect(() => {
    axios.get("/protected-route")  // call protected API endpoint
      .then((res) => setData(res.data))  // on success, save data
      .catch((err) => setError(err));  // on failure, save error
  }, [axios]);  // run when axios instance changes

  if (error) {
    return <div>Error loading data. Please try again.</div>;  // show error UI
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dashboard</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>  // display JSON data
    </div>
  );
}