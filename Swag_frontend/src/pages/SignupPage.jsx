import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { createAxiosInstance } from "../api/axiosInstance";
import { googleLogin } from "../api/auth";

// ─── Inline validators ───────────────────────────────────────────────
const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = pw =>
  pw.length >= 8 && /[A-Z]/.test(pw) && /[0-9]/.test(pw) && /[!@#$%^&.*]/.test(pw);
// ─────────────────────────────────────────────────────────────────────

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, token, logout } = useAuth();
  const axios = createAxiosInstance(token, logout);

  // ─── Shared state across steps ──────────────────────────────────────
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    location_zipcode: "",    // ZIP code input
    categories: []            // array of IDs
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Category options only
  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    // fetch category options
    async function fetchCategories() {
      try {
        const catRes = await axios.get("/categories");
        setCategoryOptions(catRes.data);
      } catch {
        setError("Unable to load categories.");
      }
    }
    fetchCategories();
  }, [axios]);

  const update = partial => setFormData(prev => ({ ...prev, ...partial }));
  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  // final submission
  async function finish() {
    setError("");
    if (!formData.location_zipcode) {
      setError("Please enter your ZIP code.");
      setStep(2);
      return;
    }
    if (formData.categories.length < 1) {
      setError("Select at least one category.");
      setStep(3);
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        location_zipcode: formData.location_zipcode,
        categories: formData.categories
      };
      await signup(payload);
      navigate("/verify-email", { state: { pending: true, email: formData.email } });
    } catch (e) {
      const errData = e.response?.data;
      if (Array.isArray(errData)) {
        setError(errData.map(err => err.msg).join("; "));
      } else if (typeof errData === 'object') {
        setError(errData.detail || JSON.stringify(errData));
      } else {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white shadow-lg rounded-lg">


















      {/* ===== Step 1: Details Page ===== */}
      {step === 1 && (
        <form
          className="space-y-4"
          onSubmit={e => {
            e.preventDefault();
            if (!validateEmail(formData.email)) {
              setError("Enter a valid email.");
              return;
            }
            if (!validatePassword(formData.password)) {
              setError(
                "Password must be at least 8 chars, include uppercase, number & symbol."
              );
              return;
            }
            setError("");
            nextStep();
          }}
        >
          <h1 className="text-2xl font-semibold text-center">Sign Up</h1>












          {/* Google Signup Option */}
          <button
            type="button"
            onClick={googleLogin}
            className="w-full py-2 bg-blue-500 text-white rounded"
          >
            Sign up with Google
          </button>

          <div className="flex items-center">
            <hr className="flex-grow border-gray-300" />
            <span className="px-2 text-gray-500 uppercase text-sm">or</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Detail Fields */}
          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={e => update({ name: e.target.value })}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={e => update({ username: e.target.value })}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={e => update({ email: e.target.value })}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={e => update({ password: e.target.value })}
            className="w-full px-3 py-2 border rounded"
            required
          />

          {error && step === 1 && <p className="text-red-500">{error}</p>}

          <div className="flex justify-between">
            <Link to="/login" className="text-blue-500 hover:underline">
              Log in
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="py-2 px-4 bg-green-500 text-white rounded"
            >
              Next
            </button>
          </div>
        </form>
      )}











      {/* ===== Step 2: Location/Zipcode Page ===== */}
      {step === 2 && (
        <div className="space-y-4 text-center">
          <h2 className="text-2xl font-semibold">Enter Your ZIP Code</h2>
          {error && step === 2 && <p className="text-red-500">{error}</p>}

          <input
            type="text"
            placeholder="e.g. 90210"
            value={formData.location_zipcode}
            onChange={e => update({ location_zipcode: e.target.value })}
            className="w-full px-3 py-2 border rounded"
            required
          />

          <div className="flex justify-between">
            <button onClick={prevStep} className="py-2 px-4 border rounded">
              Back
            </button>
            <button onClick={nextStep} className="py-2 px-4 bg-green-500 text-white rounded">
              Next
            </button>
          </div>
        </div>
      )}















      {/* ===== Step 3: Categories Page ===== */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-center">Choose Categories</h2>
          <p className="text-center text-sm">(Select 1–3)</p>
          {error && step === 3 && <p className="text-red-500 text-center">{error}</p>}

          <div className="grid grid-cols-2 gap-3">
            {categoryOptions.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  const sel = formData.categories.includes(cat.id)
                    ? formData.categories.filter(x => x !== cat.id)
                    : [...formData.categories, cat.id];
                  if (sel.length <= 3) update({ categories: sel });
                }}
                className={`px-3 py-2 border rounded text-sm uppercase ${
                  formData.categories.includes(cat.id)
                    ? 'bg-green-600 text-white border-green-600'
                    : 'border-gray-400 hover:border-gray-500'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex justify-between">
            <button onClick={prevStep} className="py-2 px-4 border rounded">
              Back
            </button>
            <button onClick={finish} disabled={loading} className="py-2 px-4 bg-green-500 text-white rounded">
              {loading ? 'Submitting…' : 'Finish'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}







