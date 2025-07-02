export const checkAuth = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('adminToken');
  if (!token) return false;

  try {
    const response = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
};

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('adminToken');
};