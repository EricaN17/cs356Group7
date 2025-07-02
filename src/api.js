// api.js
const BASE_URL = "http://localhost:8000"; // Adjust the base URL as needed
// Authentication
export const login = async (username, password) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Login failed: ${errorData.detail || response.status}`);
        }
        const data = await response.json();
        localStorage.setItem('id_token', data.token); // Store the token
        return data.token;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const deleteExperiment = async (experimentId) => {
    const token = localStorage.getItem('id_token');
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${BASE_URL}/experiments/${experimentId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Delete failed: ${errorData.detail || response.status}`);
    }

    return await response.json();
};

export const fetchExperiments = async () => {
try {
    const token = localStorage.getItem('id_token');
    if (!token) throw new Error('No token found, login first');
    const response = await fetch(`${BASE_URL}/experiments`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
        },
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Fetch failed: ${errorData.detail || response.status}`);
    }
    return await response.json();
} catch (error) {
    console.error(error);
    throw error;
}
};

// Encoders
export const fetchEncoders = async () => {
    const token = localStorage.getItem('id_token');
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${BASE_URL}/infrastructure/encoders`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Fetch failed: ${errorData.detail || response.status}`);
    }

    return await response.json();
};

export const createEncoder = async (encoderData) => {
    const token = localStorage.getItem('id_token');
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${BASE_URL}/infrastructure/encoders`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(encoderData)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Create failed: ${errorData.detail || response.status}`);
    }

    return await response.json();
};

export const deleteEncoder = async (encoderId) => {
    const token = localStorage.getItem('id_token');
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${BASE_URL}/infrastructure/encoders/${encoderId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Delete failed: ${errorData.detail || response.status}`);
    }

    return await response.json();
};
