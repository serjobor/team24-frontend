// export interface Role {
//     role: 'ADMIN' | 'MANAGER';
// };

export interface AuthResponse {
    role: string;
    // role: Role;
    accessToken: string;
    // refreshToken: string;
};

