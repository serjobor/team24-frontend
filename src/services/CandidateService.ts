// import $api from "@http";
import type { CandidateResponse } from "@typesResp/CandidateResponse";
import type { AxiosResponse } from "axios";

import axios from "axios";
import { API_URL } from "@http";

const $apiCandidate = axios.create({
    baseURL: API_URL
});

$apiCandidate.interceptors.request.use((config) => {
  return config;
});

export interface sopdTextResponse {
    sopdText: string;
};

export default class CandidateService {
    //запроc на получение cтатуcа у токена кандидата
    static async getStatusToken(token: string): Promise<AxiosResponse> {
        return $apiCandidate.post('/requests/status', { token });
    };

    //запрос на получение текста СОПД
    static async getSOPDText(): Promise<AxiosResponse<sopdTextResponse>> {
        return $apiCandidate.get<sopdTextResponse>('/sopds/forCandidate');
    };

    //запроc на изменение данных о кандидате
    static async sendCandidateData(candidateData: CandidateResponse): Promise<void> {
        return $apiCandidate.patch('/requests', candidateData);
    };
}