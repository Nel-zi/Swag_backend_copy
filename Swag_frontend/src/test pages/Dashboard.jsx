/*
  Dashboard.js
  Example of a protected page: fetches data
  from a secured backend route and displays it.
*/

import React, { useEffect, useState } from "react";

export default function Dashboard({ axios }) {
  // data: holds the API’s successful JSON response
  // error: captures any fetch error (e.g., network issue)
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // On component mount (or if axios prop ever changes),
    // call the backend’s protected endpoint.
    axios
      .get("/protected-route")
      .then((res) => {
        // On success, put the JSON payload into state.
        setData(res.data);
      })
      .catch((err) => {
        // On failure (other than 401, which already triggered logout),
        // store the error so we can show a message.
        setError(err);
      });
  }, [axios]); // dependency array ensures effect re-runs if axios instance changes.

  // If we encountered an error, show a friendly message.
  if (error) {
    return <div>Error loading data. Please try again.</div>;
  }

  // Otherwise, display the raw JSON in a <pre> block (formatted nicely).
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dashboard</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}