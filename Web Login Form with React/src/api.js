import axios from 'axios';

const API_URL = 'http://192.168.225.158:8000'
//const API_URL = 'https://2cea-102-89-69-204.ngrok-free.app' //TEMP

// Login API
const loginUser = async (credentials) => {
    try{
        const params = new URLSearchParams();
        for (const key in credentials){
            params.append(key, credentials[key]);
        }

        const response = await axios.post(
            `${API_URL}/auth/token`,
            params,
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
    await axios.post(`${API_URL}/auth/verify-identifier`, { identifier });
  } catch (err) {
    throw new Error(err.response?.data?.detail || 'User not found');
  }
};

export { loginUser, registerUser, fetchUserProfile, verifyIdentifier};