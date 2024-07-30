// lib/auth.ts

export async function checkAuth(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/check', {
      method: 'GET',
      credentials: 'include', // Inclui cookies para autenticação, se necessário
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.authenticated; // Supõe que a resposta contém um campo `authenticated`
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
}
