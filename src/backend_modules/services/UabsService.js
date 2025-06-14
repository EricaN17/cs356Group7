import axios from "axios";


const USER_API_BASE = "http://localhost:8000/api/v1";


export function _readRawToken() {
    const token = window.localStorage.getItem("id_token");
    if (!token) {
        throw new Error("No auth token found. User is not logged in.");
    }
    return token;
}


export function _decodeJwtPayload(token) {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) throw new Error("Invalid JWT format");

        // Convert base64url → base64
        let b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        // Pad with "="
        while (b64.length % 4 !== 0) {
            b64 += "=";
        }

        const jsonStr = atob(b64);
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("UserService: Failed to decode JWT payload:", error);
        throw new Error("Invalid or malformed auth token.");
    }
}

export async function getCurrentUser() {
    // 1) Read raw token
    const token = _readRawToken();

    // 2) Decode payload to extract sub, role, exp
    const payload = _decodeJwtPayload(token);
    const username = payload.sub;
    if (!username) {
        throw new Error("Auth token is missing 'sub' (username) claim.");
    }

    // 3) Check expiration if present
    if (payload.exp) {
        const nowSec = Math.floor(Date.now() / 1000);
        if (payload.exp < nowSec) {
            throw new Error("Auth token expired. Please log in again.");
        }
    }
    try {
        const response = await axios.get(
            `${USER_API_BASE}/users/${username}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            }
        );

        return {
            user: response.data,
            token,
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error during getCurrentUser:", error);
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                throw new Error("Invalid or expired auth token. Please log in again.");
            }
            // Handle other axios errors as needed
        } else {
            // Log and re-throw unexpected errors.
            console.error("Unexpected error in getCurrentUser:", error);
            throw error;  // Re-throw for higher level handling
        }
    }
}


    export async function getAuthHeaderConfig(options = {json: true}) {
        const {token} = await getCurrentUser();
        const headers = {
            Authorization: `Bearer ${token}`,
        };
        if (options.json) {
            headers["Content-Type"] = "application/json";
            headers["Accept"] = "application/json";
        }
        return {headers};
    }
