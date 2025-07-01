

const API_BASE_URL = 'http://localhost:8000'; // url from the apis


export const fetchEncoders = async () => {
    const token = localStorage.getItem('id_token');
    if (!token) throw new Error('No token found, login first');

    const response = await fetch(`${API_BASE_URL}/infrastructure/encoders`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to fetch encoders: ${errorData.detail || response.status}`);
    }

    return await response.json();
};

export const fetchExperiments = async () => {
    const token = localStorage.getItem('id_token');
    if (!token) throw new Error('No token found, login first');

    const response = await fetch(`${API_BASE_URL}/experiments`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to fetch experiments: ${errorData.detail || response.status}`);
    }

    return await response.json();
};



