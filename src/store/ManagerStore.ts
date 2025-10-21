import { makeAutoObservable, toJS } from "mobx";
import ManagerService from "@services/ManagerService";
import type { CandidateList } from "@typesResp/ManagerResponse";

export default class ManagerStore {
  pageNum = 1;
  totalPage = 1;
  
  // список кандидатов из БД
  candidateList: CandidateList[] = [];
  
  // список почт для отправки на сервер
  candidatEmails: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setPageNum(pageNum: number) {
    this.pageNum = pageNum;
  }

  setTotalPage(totalPage: number) {
    this.totalPage = totalPage;
  }

  setCandidatEmails(candidatEmails: string[]) {
    this.candidatEmails = candidatEmails;
  }

  setRequestCandidates(candidateList: CandidateList[]) {
    this.candidateList = candidateList;
  }

  // тестовый массив кандидатов
  // CandidatesData1 = {
  //   "data": {
  //     "_embedded": {
  //       "requestWithCandidateDtoList": [
  //         {
  //           "requestId": 1,
  //           "userId": 1,
  //           "candidate": {
  //             "candidateId": 1,
  //             "candidateFirstName": "Сергей",
  //             "candidateLastName": "Иванов",
  //             "candidateFatherName": "Петрович",
  //             "candidateMail": "sergey@example.com",
  //             "candidateNewMail": "aaaa@example.com",
  //             "candidateBirthDate": "14.05.1990",
  //             "candidatePhone": "+79161234567",
  //             "candidateCreatedAt": "18.08.2025 15:18"
  //           },
  //           "templateId": 1,
  //           "sopdId": 0,
  //           "requestToken": "token123",
  //           "requestState": "PENDING",
  //           "requestDate": "2025-08-18T15:18:59.592+00:00"
  //         },
  //         {
  //           "requestId": 10,
  //           "userId": 1,
  //           "candidate": {
  //             "candidateId": 1,
  //             "candidateFirstName": "Сергей",
  //             "candidateLastName": "Иванов",
  //             "candidateFatherName": "Петрович",
  //             "candidateMail": "sergey@example.com",
  //             "candidateNewMail": "aaaa@example.com",
  //             "candidateBirthDate": "14.05.1990",
  //             "candidatePhone": "+79161234567",
  //             "candidateCreatedAt": "18.08.2025 15:18"
  //           },
  //           "templateId": 1,
  //           "sopdId": 0,
  //           "requestToken": "token008",
  //           "requestState": "APPROVED",
  //           "requestDate": "2025-08-18T17:03:49.820+00:00"
  //         },
  //         {
  //           "requestId": 11,
  //           "userId": 1,
  //           "candidate": {
  //             "candidateId": 1,
  //             "candidateFirstName": "Сергей",
  //             "candidateLastName": "Иванов",
  //             "candidateFatherName": "Петрович",
  //             "candidateMail": "sergey@example.com",
  //             "candidateNewMail": "aaaa@example.com",
  //             "candidateBirthDate": "14.05.1990",
  //             "candidatePhone": "+79161234567",
  //             "candidateCreatedAt": "18.08.2025 15:18"
  //           },
  //           "templateId": 1,
  //           "sopdId": 0,
  //           "requestToken": "token009",
  //           "requestState": "REJECTED",
  //           "requestDate": "2025-08-18T17:03:49.820+00:00"
  //         }
  //       ]
  //     },
  //     "page": {
  //       "size": 10,
  //       "totalElements": 3,
  //       "totalPages": 2,
  //       "number": 0
  //     }
  //   },
  // };

  // CandidatesData2 = {
  //   "data": {
  //     "_embedded": {
  //       "requestWithCandidateDtoList": []
  //     },
  //     "page": {
  //       "size": 10,
  //       "totalElements": 0,
  //       "totalPages": 1,
  //       "number": 1
  //     }
  //   },
  // };

  //добавляем в стор всех кандидатов
  async getCandidates() {
    console.log('Сработала функция getCandidates');
    try {
      const response = await ManagerService.getCandidates(this.pageNum - 1);
      // const response = this.CandidatesData1;
      // const response = this.CandidatesData2;
      
      console.log(toJS(response));
      this.setRequestCandidates(response.data._embedded.requestWithCandidateDtoList);
      this.setTotalPage(response.data.page.totalPages);
    } catch (e: any) {
      console.log(e.response?.data?.message);
      throw e;
    } 
  };

  //добавляем в стор всех кандидатов
  async addNewCandidates() {
    console.log('Сработала функция addNewCandidates');
    try {
      const response = await ManagerService.addNewCandidates(this.candidatEmails);
      // const response = this.candidatEmails;
      console.log(toJS(response));

      await this.getCandidates();
    } catch (e: any) {
      console.log(e.response?.data?.message);
      throw e;
    } 
  };

  //сортируем всех кандидатов по статусу
  async sortCandidateByStatus(requestStatus: string) {
    console.log('Сработала функция sortCandidateByStatus по статусу: ', requestStatus);
    this.reset();

    try {
      const response = await ManagerService.sortCandidateByStatus(this.pageNum - 1, requestStatus);
      console.log(toJS(response));

      this.setRequestCandidates(response.data._embedded.requestWithCandidateDtoList);
      this.setTotalPage(response.data.page.totalPages);
    } catch (e: any) {
      console.log(e.response?.data?.message);
      throw e;
    } 
  };

  //удаляем одного кандидата
  async deleteOneCandidate(requestId: number) {
    console.log('Сработала функция deleteOneCandidate по requestId: ', requestId);
    this.reset();

    try {
      const response = await ManagerService.deleteOneCandidate(requestId);
      console.log(toJS(response));
      
      await this.getCandidates();
    } catch (e: any) {
      console.log(e.response?.data?.message);
      throw e;
    } 
  };

  reset() {
    this.candidateList = [];
    this.pageNum = 1;
    this.totalPage = 1;
    this.candidatEmails = [];
  }

};