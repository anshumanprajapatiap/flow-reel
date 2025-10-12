const API_URL = import.meta.env.VITE_API_URL;

const USER_URL = `${API_URL}/user`;

// Add a new user
export const addUser = async (userData) => {
  try {
    const response = await fetch(`${USER_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`Error adding user: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Add User failed:", error);
    throw error;
  }
};

// Get user by ID
export const getUser = async (userData) => {
  try {
    const response = await fetch(`${USER_URL}/${userData.id}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Error fetching user: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Get User failed:", error);
    throw error;
  }
};