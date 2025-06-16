export const mockUsers = [
    { username: 'user1', role: 'user', password: 'password1' },
    { username: 'user2', role: 'user', password: 'password2' },
    { username: 'admin', role: 'superuser', password: 'adminpass' },
];


export function setMockToken(username) {
    const user = mockUsers.find(u => u.username === username);
    if (!user) throw new Error(`Unknown mock user: ${username}`);
    const header = { alg: 'none', typ: 'JWT' };
    const payload = {
        sub: user.username,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 // 1 hour expiry
    };
    const encode = obj =>
        btoa(JSON.stringify(obj))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    const token = `${encode(header)}.${encode(payload)}.`;
    window.localStorage.setItem('id_token', token);
}