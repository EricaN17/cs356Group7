const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:8000/api/v1';


export async function getCurrentUser(username) {
    if (!username) return null;

    try {
        const res = await fetch(
            `${API_BASE_URL}/users/${encodeURIComponent(username)}`
        );

        if (!res.ok) {
            if (res.status === 400 || res.status === 404) {
                // Invalid or not found => treat as unauthenticated
                return null;
            }
            throw new Error(`Failed to fetch user: ${res.status}`);
        }

        const user = await res.json();
        return { id: user.id, username: user.username };
    } catch (error) {
        console.error('uabsService.getCurrentUser error:', error);
        throw error;
    }
}