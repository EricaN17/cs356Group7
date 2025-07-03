import axios from 'axios';
import { setMockToken as _setMockToken, mockUsers } from '../mockData/mockUsers.js';

const USER_API_BASE = 'http://localhost:8000/api/v1';

export { _setMockToken as setMockToken, mockUsers };

export function _readRawToken() {
    const token = window.localStorage.getItem('id_token');
    if (!token) {
        throw new Error('No auth token found. User is not logged in.');
    }
    return token;
}

export function _decodeJwtPayload(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) throw new Error('Invalid JWT format');
        let b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        while (b64.length % 4) b64 += '=';
        const jsonStr = atob(b64);
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error('UabsService: Failed to decode JWT payload:', error);
        throw new Error('Invalid or malformed auth token.');
    }
}

export async function loginAndStoreToken(username, password) {
    const response = await axios.post('http://localhost:8000/auth/login', {
        username,
        password
    }, {
        headers: { 'Content-Type': 'application/json' }
    });

    const token = response.data.token;
    localStorage.setItem('id_token', token);
    console.log('Stored valid token:', token);
    return token;
}

export async function getCurrentUser() {
    const token = _readRawToken();
    const payload = _decodeJwtPayload(token);

    const mockUser = mockUsers.find(u => u.username === payload.sub);
    if (mockUser) {
        return { user: mockUser, token, payload };
    }

    const username = payload.sub;
    const response = await axios.get(
        `${USER_API_BASE}/users/${username}`,
        { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }
    );
    return { user: response.data, token, payload };
}

export async function getAuthHeaderConfig(options = { json: true }) {
    const { token } = await getCurrentUser();
    const headers = { Authorization: `Bearer ${token}` };
    if (options.json) {
        headers['Content-Type'] = 'application/json';
        headers['Accept'] = 'application/json';
    }
    return { headers };
}