import $api from "@http";
import type { AxiosResponse } from "axios";
import type { IUserSendData, EmployeeResponse, AllDeletedRequestsResponse } from "@typesResp/SuperAdminResponse";

export default class SuperAdminService {
    // запрос на получение списка сотрудников
    static async getEmployees(pageNum: number): Promise<AxiosResponse<EmployeeResponse>> {
        return $api.get<EmployeeResponse>(`/users?page=${pageNum}`);
    };

    // запрос на добавление сотрудника
    static async addNewEmployee(user: IUserSendData): Promise<AxiosResponse> {
        console.log("Service AddNewEmployee Данные нового сотрудника:", user);
        return $api.post(`/users`, user );
    };

    // запрос на удаление сотрудника
    static async deleteEmployee(userId: number): Promise<AxiosResponse> {
        return $api.patch<AxiosResponse>(`users/${userId}`);
    };

    // запрос: сортировка таблицы по роли
    static async sortEmployeesByRole(pageNum: number, roleName: string): Promise<AxiosResponse<EmployeeResponse>> {
        return $api.get<EmployeeResponse>(`/users?page=${pageNum}&role=${roleName}`);
    };

    // запрос на получение списка удаленных заявок кандидатам
    static async getAllDeletedRequests(pageNum: number): Promise<AxiosResponse<AllDeletedRequestsResponse>> {
        return $api.get<AllDeletedRequestsResponse>(`requests/deleted?page=${pageNum}`);
    };

    // запрос на удаление скрытых заявок кандидатам
    static async deleteAllDeletedRequests(): Promise<AxiosResponse> {
        return $api.delete('requests/all');
    };

    // запрос на удаление одной скрытой заявки
    static async deleteOneRequest(requestId: number): Promise<AxiosResponse> {
        return $api.delete<AxiosResponse>(`requests/${requestId}`);
    };
}