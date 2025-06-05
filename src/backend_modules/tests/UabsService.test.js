import axios from "axios";
import { getCurrentUser, getAuthHeaderConfig } from "../services/UabsService.js";

// Mock axios so that GET /users/{username} can be stubbed
jest.mock("axios");

describe("UserService", () => {
    const USER_API_BASE = "http://localhost:8000/api/v1";

    // Helper to build a fake JWT (header.payload.signature)
    function buildJwt({ sub, role, exp }) {
        const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
        const payload = Buffer.from(JSON.stringify({ sub, role, exp })).toString("base64url");
        return `${header}.${payload}.fakeSignature`;
    }

    beforeEach(() => {
        global.localStorage = {
            getItem: jest.fn(),
            setItem: jest.fn(),
            clear: jest.fn(),
            removeItem: jest.fn(),
        };
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    afterEach(() => {
        // Clear localStorage and reset mocks between tests
        window.localStorage.clear();
        jest.resetAllMocks();
    });

    test("throws if no token in localStorage", async () => {
        await expect(getCurrentUser()).rejects.toThrow(
            "No auth token found. User is not logged in."
        );
    });

    test("throws if token is expired", async () => {
        const pastExp = Math.floor(Date.now() / 1000) - 60; // 60 seconds ago
        const expiredToken = buildJwt({ sub: "alice", role: "user", exp: pastExp });
        window.localStorage.setItem("id_token", expiredToken);

        await expect(getCurrentUser()).rejects.toThrow(
            "Auth token expired. Please log in again."
        );
    });

    test("returns user object if token valid and API returns 200", async () => {
        const futureExp = Math.floor(Date.now() / 1000) + 3600;
        const validToken = buildJwt({ sub: "bob", role: "user", exp: futureExp });
        window.localStorage.setItem("id_token", validToken);

        const mockUser = {
            id: 42,
            username: "bob",
            firstName: "Bobby",
            lastName: "Tables",
            email: "bob@example.com",
            role: "user",
        };
        axios.get.mockResolvedValueOnce({ data: mockUser });

        const result = await getCurrentUser();
        expect(result).toEqual({ user: mockUser, token: validToken });

        expect(axios.get).toHaveBeenCalledWith(
            `${USER_API_BASE}/users/bob`,
            {
                headers: {
                    Authorization: `Bearer ${validToken}`,
                    Accept: "application/json",
                },
            }
        );
    });

    test("throws if GET /users/{username} returns 401", async () => {
        const futureExp = Math.floor(Date.now() / 1000) + 3600;
        const validToken = buildJwt({ sub: "charlie", role: "user", exp: futureExp });
        window.localStorage.setItem("id_token", validToken);

        const err = new Error("Invalid or expired auth token. Please log in again.");
        err.response = { status: 401 };
        axios.get.mockRejectedValueOnce(err);

        await expect(getCurrentUser()).rejects.toThrow(
            "Invalid or expired auth token. Please log in again."
        );
    });

    test("getAuthHeaderConfig returns headers if token valid", async () => {
        const futureExp = Math.floor(Date.now() / 1000) + 3600;
        const validToken = buildJwt({ sub: "dave", role: "user", exp: futureExp });
        window.localStorage.setItem("id_token", validToken);

        const mockUser = {
            id: 7,
            username: "dave",
            firstName: "David",
            lastName: "Smith",
            email: "dave@example.com",
            role: "user",
        };
        axios.get.mockResolvedValueOnce({ data: mockUser });

        const config = await getAuthHeaderConfig();
        expect(config).toEqual({
            headers: {
                Authorization: `Bearer ${validToken}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });
    });

    test("getAuthHeaderConfig({ json: false }) omits JSON headers", async () => {
        const futureExp = Math.floor(Date.now() / 1000) + 3600;
        const validToken = buildJwt({ sub: "eve", role: "user", exp: futureExp });
        window.localStorage.setItem("id_token", validToken);

        const mockUser = {
            id: 13,
            username: "eve",
            firstName: "Eve",
            lastName: "Jones",
            email: "eve@example.com",
            role: "user",
        };
        axios.get.mockResolvedValueOnce({ data: mockUser });

        const config = await getAuthHeaderConfig({ json: false });
        expect(config).toEqual({
            headers: {
                Authorization: `Bearer ${validToken}`,
            },
        });
    });
});