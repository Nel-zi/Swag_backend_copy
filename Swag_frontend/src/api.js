import axios from 'axios';


//const API_URL = 'https://dfe1-102-89-76-192.ngrok-free.app'
const API_URL = 'https://swag-backend.onrender.com' // TEMP

// Login API
/*const loginUser = async (credentials, identifier, password) => {
    try{
        const params = new URLSearchParams();
        for (const key in credentials){
            params.append(key, credentials[key]);
        }

        const response = await axios.post(
            `${API_URL}/auth/token`,
            credentials/*params,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        return response.data;
    } catch(error) {
        console.error("Login error:", error)
        throw error;
    }
};*/
const loginUser = async (identifier, password) => {
  try {
    const payload = {
      identifier,
      password,
    };

    const response = await axios.post(
      `${API_URL}/login`,
      payload
    );

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

const registerUser = async (userData) => {
    try {
        await axios.post(`${API_URL}/auth/register`, userData);
    } catch (error) {
        console.error("Registration error:", error);
        throw error;
    }
};

const fetchUserProfile = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/users/me/`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Fetch user profile error:", error);
        throw error;
    }
};

const verifyIdentifier = async (identifier) => {
  try {
    const response = await axios.post(`${API_URL}/auth/verify-identifier`, { identifier });
    return true; /////response.data.exists;
  } catch (err) {
    //throw new Error(err.response?.data?.detail || 'User not found');
    const detail = err.response?.data?.detail;
    const message = Array.isArray(detail) ? detail[0]?.msg : 'User not found';
    throw new Error(message || 'User not found');
  }
};

const authenticateGoogle = async () => {
  try {
    const result = await axios.get(`${API_URL}/oauth/auth/google/login`);
    return result.data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

const googleLogin = () => {
  const redirectUri = window.location.origin + "/auth-success";  // Callback URL
  const loginUrl =
      `${API_URL}/auth/google/login?` +
      `redirect_uri=${encodeURIComponent(redirectUri)}`;  // Full login URL
    window.location.href = loginUrl;  // Redirect to backend OAuth endpoint
};

export { loginUser, registerUser, fetchUserProfile, verifyIdentifier, googleLogin};