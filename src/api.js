// api.js
export const fetchEncoders = async () => {
    const token = localStorage.getItem('id_token');
    if (!token) throw new Error('No token found, login first');
    const response = await fetch('http://localhost:8000/infrastructure/encoders', {
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

    const response = await fetch('http://localhost:8000/experiments', {
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

// Function to fetch networks
export const fetchNetworks = async () => {
    const response = await fetch('/infrastructure/networks');
    if (!response.ok) {
        throw new Error('Failed to fetch networks');
    }
    return await response.json();
};

export const fetchDropdownData = async () => {
    try {
        const [encoders, networks] = await Promise.all([
            fetchEncoders(),
            fetchNetworks(),
        ]);
        return {
            encoders,
            networks,
        };
    } catch (error) {
        console.error("Error fetching dropdown data:", error);
        throw error; // Rethrow the error for handling in the component
    }
};
