import $api from "@http";
import type { AxiosResponse } from "axios";
import type { AuthResponse } from "@typesResp/AuthResponse";

export default class AuthService {
    static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        //путь к эндпоинту на сервере
        return $api.post<AuthResponse>('/auth', {email, password});
    }

    static async logout(): Promise<void> {
        //путь к эндпоинту на сервере
        return $api.delete('/auth');
    }
}