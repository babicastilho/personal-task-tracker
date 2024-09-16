// lib/user.ts
import { apiFetch } from './apiFetch'; // Using the apiFetch function

// Fetch the user profile from the API
export const fetchProfile = async (): Promise<any> => {
  try {
    // Use apiFetch for token handling and session expiration
    const response = await apiFetch('/api/users/profile', {
      method: 'GET',
    });

    if (!response) {
      throw new Error('Session expired or failed to fetch profile');
    }

    return response; // Return the profile data
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

// Update user profile via API
export const updateProfile = async (profileData: any): Promise<any> => {
  try {
    // Use apiFetch for token handling and session expiration
    const response = await apiFetch('/api/users/profile', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });

    if (!response) {
      throw new Error('Session expired or failed to update profile');
    }

    return response; // Return the updated profile data
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};
