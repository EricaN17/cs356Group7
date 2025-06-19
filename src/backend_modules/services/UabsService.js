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
        if (parts.length < 2) throw new Error('Invalid JWT format');
        let b64 = parts[1]
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        while (b64.length % 4) b64 += '=';
        const jsonStr = atob(b64);
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error('UabsService: Failed to decode JWT payload:', error);
        throw new Error('Invalid or malformed auth token.');
    }
}

export async function getCurrentUser() {
    const token = _readRawToken();
    const payload = _decodeJwtPayload(token);
    const username = payload.sub;
    if (!username) {
        throw new Error("Auth token is missing 'sub' (username) claim.");
    }
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        throw new Error('Auth token expired. Please log in again.');
    }
    try {
        const response = await axios.get(
            `${USER_API_BASE}/users/${username}`,
            { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }
        );
        return { user: response.data, token, payload };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response && (error.response.status === 401 || error.response.status === 403)) {
            throw new Error('Invalid or expired auth token. Please log in again.');
        }
        console.error('Unexpected error in getCurrentUser:', error);
        throw error;
    }
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