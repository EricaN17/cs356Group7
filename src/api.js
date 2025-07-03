const API_BASE_URL = 'https://ui.uni.kylestevenson.dev'; // URL from the APIs

const getAuthHeaders = () => {
    const token = localStorage.getItem('id_token');
    if (!token) throw new Error('No token found, login first');
    return {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
    };
};

export const fetchEncoders = async () => {
    const response = await fetch(`${API_BASE_URL}/infrastructure/encoders`, {
        headers: getAuthHeaders(),
    });

   // const response = await fetch(`${process.env.PUBLIC_URL}/data/encoders.json`)


    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to fetch encoders: ${errorData.detail || response.status}`);
    }

    return await response.json();
};

export const fetchExperiments = async () => {
    const response = await fetch(`${API_BASE_URL}/experiments`, {
        headers: getAuthHeaders(),
    });

    //const response = await fetch(`${process.env.PUBLIC_URL}/data/experiments.json`)


    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to fetch experiments: ${errorData.detail || response.status}`);
    }

    return await response.json();
};

export const fetchNetworkProfiles = async () => {
    const response = await fetch(`${API_BASE_URL}/infrastructure/networks`, {
        headers: getAuthHeaders(),
    });

    // const response = await fetch(`${process.env.PUBLIC_URL}/data/network_profiles.json`)


    if (!response.ok) {
        throw new Error(`Failed to fetch network profiles: ${response.status}`);
    }

    return await response.json();
};

export const fetchVideoSources = async () => {
    const response = await fetch(`${API_BASE_URL}/infrastructure/videos`, {
        headers: getAuthHeaders(),
    });

    // const response = await fetch(`${process.env.PUBLIC_URL}/data/video.json`)

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to fetch video sources: ${errorData.detail || response.status}`);
    }

    return await response.json();
};

export const createExperiment = async (experimentData) => {
    const response = await fetch(`${API_BASE_URL}/experiments`, {
        method: 'POST',
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(experimentData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to create experiment: ${errorData.detail || response.status}`);
    }

    return await response.json();
};
