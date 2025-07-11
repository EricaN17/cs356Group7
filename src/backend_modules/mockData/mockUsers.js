// mockUsers.js
export const mockUsers = [
    {
        id: '1',
        username: 'user1',
        role: 'user',
        email: 'user1@example.com',
        firstName: 'User',
        lastName: 'One',
        createdAt: '2025-01-01T10:00:00Z',
        preferences: { theme: 'light', notifications: true }
    },
    {
        id: '2',
        username: 'user2',
        role: 'user',
        email: 'user2@example.com',
        firstName: 'User',
        lastName: 'Two',
        createdAt: '2025-02-15T14:30:00Z',
        preferences: { theme: 'dark', notifications: false }
    },
    {
        id: '3',
        username: 'admin',
        role: 'superuser',
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        createdAt: '2025-01-01T09:00:00Z',
        preferences: { theme: 'light', notifications: true }
    }
];

export function setMockToken(username) {
    const user = mockUsers.find(u => u.username === username);
    if (!user) throw new Error(`Unknown mock user: ${username}`);

    const header = { alg: 'none', typ: 'JWT' };
    const payload = {
        sub: user.username,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + 60 * 60
    };
    const encode = obj =>
        btoa(JSON.stringify(obj))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

    const token = `${encode(header)}.${encode(payload)}.`;
    window.localStorage.setItem('authToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJzdXBlcl9hZG1pbiIsImZpcnN0X25hbWUiOiJzdHJpbmciLCJsYXN0X25hbWUiOiJzdHJpbmciLCJlbWFpbCI6InN0cmluZ3MiLCJpYXQiOjE3NTE1MDQ0NTEsImV4cCI6MTc1MTUxMTY1MX0.389tAR6NiYTiFUWSEDwx6WmYadj6zqZwPLw6sR2QvSg');
}
