import $api from "@http";
import type { AxiosResponse } from "axios";
import type { ManagerResponse } from "@typesResp/ManagerResponse";

export default class ManagerService {
    // запрос на получение списка кандидатов
    static async getCandidates(pageNum: number): Promise<AxiosResponse<ManagerResponse>> {
        return $api.get<ManagerResponse>(`/requests?page=${pageNum}`);
    };

    // запрос на добавление кандидатов
    static async addNewCandidates(emails: string[]): Promise<AxiosResponse> {
        return $api.post(`/requests`, { emails });
    };

    // запрос на удаление записи о кандидате из таблицы
    static async deleteOneCandidate(requestId: number): Promise<AxiosResponse> {
        return $api.patch<AxiosResponse>(`/requests/${requestId}`);
    };

    // запрос: сортировка таблицы по статусу
    static async sortCandidateByStatus(pageNum: number, requestStatus: string): Promise<AxiosResponse<ManagerResponse>> {
        return $api.get<ManagerResponse>(`/requests?page=${pageNum}&state=${requestStatus}`);
    };
}