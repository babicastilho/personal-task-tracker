// lib/user.ts

// Fetch the user profile from the API
export const fetchProfile = async (): Promise<any> => {
  try {
    // Get the token from the cookie
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('authToken='))
      ?.split('=')[1];

    if (!token) {
      throw new Error('No token found');
    }

    // Make a request to fetch the user profile
    const response = await fetch('/api/users/profile', { // Correct endpoint
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return await response.json(); // Return the profile data
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

// Update user profile via API
export const updateProfile = async (profileData: any): Promise<any> => {
  try {
    // Get the token from the cookie
    const token = document.cookie.split('; ').find(row => row.startsWith('authToken='));
    if (!token) {
      throw new Error('No token found');
    }

    const authToken = token.split('=')[1];

    // Make the profile update request
    const response = await fetch('/api/users/profile', { // Correct endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`, // Include the authentication token
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    return await response.json(); // Return the updated profile data
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

