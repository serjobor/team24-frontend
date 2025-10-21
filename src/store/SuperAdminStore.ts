import { makeAutoObservable, toJS } from "mobx";
import SuperAdminService from "@services/SuperAdminService";
import type { CandidateAndManagerList, IUser, IUserSendData } from "@typesResp/SuperAdminResponse";

export default class SuperAdminStore {
  pageNum = 1;
  totalPage = 1;
  
  // employees
  userDtoList: IUser[] = [];

  // candidates and managers
  candidateAndManagerList: CandidateAndManagerList[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setPageNum(pageNum: number) {
    this.pageNum = pageNum;
  }

  setTotalPage(totalPage: number) {
    this.totalPage = totalPage;
  }

  setUserDtoList(userDtoList: IUser[]) {
    this.userDtoList = userDtoList;
  }

  setCandidateAndManagerList(candidateAndManagerList: CandidateAndManagerList[]) {
    this.candidateAndManagerList = candidateAndManagerList;
  }

  // EMPLOYEES1 = {
  //   "data": {
  //     "_embedded": {
  //       "userDtoList": [
  //         {
  //           'userId': 0,
  //           'userMail': 'test0@mail.ru',
  //           'userLastName': 'Test0',
  //           'userFirstName': 'Test00',
  //           'userFatherName': 'Test000',

  //           'role': {
  //             'roleId': 0,
  //             'roleName': 'ADMIN',
  //           },

  //           'userCreatedAt': '01.01.2000',
  //         },
  //         {
  //           'userId': 1,
  //           'userMail': 'test1@mail.ru',
  //           'userLastName': 'Test1',
  //           'userFirstName': 'Test11',
  //           'userFatherName': 'Test111',

  //           'role': {
  //             'roleId': 1,
  //             'roleName': 'MNAGER',
  //           },

  //           'userCreatedAt': '02.02.2002',
  //         },
  //       ],
  //     },
  //     "page": {
  //       "size": 10,
  //       "totalElements": 2,
  //       "totalPages": 3,
  //       "number": 1,
  //     }
  //   },
  // };

  // EMPLOYEES2 = {
  //   "data": {
  //     "_embedded": {
  //       "userDtoList": [
  //         {
  //           'userId': 0,
  //           'userMail': '11test0@mail.ru',
  //           'userLastName': '11Test0',
  //           'userFirstName': '11Test00',
  //           'userFatherName': '11Test000',

  //           'role': {
  //             'roleId': 0,
  //             'roleName': 'MANAGER',
  //           },

  //           'userCreatedAt': '01.01.2000',
  //         },
  //         {
  //           'userId': 1,
  //           'userMail': '11test1@mail.ru',
  //           'userLastName': '11Test1',
  //           'userFirstName': '11Test11',
  //           'userFatherName': '11Test111',

  //           'role': {
  //             'roleId': 1,
  //             'roleName': 'ADMIN',
  //           },

  //           'userCreatedAt': '02.02.2002',
  //         },
  //       ],
  //     },
  //     "page": {
  //       "size": 10,
  //       "totalElements": 3,
  //       "totalPages": 3,
  //       "number": 2,
  //     }
  //   },
  // };

  // EMPLOYEES3 = {
  //   "data": {
  //     "_embedded": {
  //       "userDtoList": [],
  //     },
  //     "page": {
  //       "size": 10,
  //       "totalElements": 0,
  //       "totalPages": 3,
  //       "number": 3,
  //     }
  //   },
  // };

  //получаем всех сотрудников
  async getEmployees() {
    console.log('Сработала функция getEmployees');
    try {
      const response = await SuperAdminService.getEmployees(this.pageNum - 1);
      // const response = this.EMPLOYEES1;
      // const response = this.EMPLOYEES2;

      console.log(toJS(response));
      this.setUserDtoList(response.data._embedded.userDtoWithRoleDtoList);
      this.setTotalPage(response.data.page.totalPages);
    } catch (e: any) {
      console.log(e.response?.data?.message);
      throw e;
    }
  };

  //добавляем нового сотрудника
  async addNewEmployee(user: IUserSendData) {
    console.log('Сработала функция addNewEmployee');
    console.log("AddNewEmployee Данные нового сотрудника:", user);
    try {
      const response = await SuperAdminService.addNewEmployee(user);
      // const response = user;
      console.log(toJS(response));

      await this.getEmployees();
    } catch (e: any) {
      console.log(e.response?.data?.message);
      throw e;
    }
  };

  //удаляем одного сотрудника
  async deleteEmployee(userId: number) {
    console.log('Сработала функция deleteEmployee, userId: ', userId);

    try {
      const response = await SuperAdminService.deleteEmployee(userId);
      console.log(toJS(response));
      await this.getEmployees();
    } catch (e: any) {
      console.log(e.response?.data?.message);
      throw e;
    }
  };

  //сортируем всех сотрудников по роли
  async sortEmployeesByRole(roleName: string) {
    console.log('Сработала функция sortEmployeesByRole по роли: ', roleName);
    this.reset();
    try {
      const response = await SuperAdminService.sortEmployeesByRole(this.pageNum - 1, roleName);
      console.log(toJS(response));

      this.setUserDtoList(response.data._embedded.userDtoWithRoleDtoList);
      this.setTotalPage(response.data.page.totalPages);
    } catch (e: any) {
      console.log(e.response?.data?.message);
      throw e;
    }
  };

  // AllDeleteRequests = {
  //   "data": {
  //     "_embedded": {
  //       "requestWithCandidateAndManagerDtoList": [
  //         {
  //           'requestId': 0,
  //           'user': {
  //             'userMail': 'userMail@mail.ru',
  //           },
  //           'candidate': {
  //             'candidateId': 0,
  //             'candidateLastName': 'Test0',
  //             'candidateFirstName': 'Test0',
  //             'candidateFatherName': 'Test0',
  //             'candidateMail': 'candidateMail0@mail.ru',
  //             'candidateBirthDate': '01.01.2000',
  //             'candidatePhone': '+7(800)555-35-35',
  //           },
  //           'requestState': 'PENDING',
  //           'requestDate': '11.09.2011',
  //         },
  //         {
  //           'requestId': 1,
  //           'user': {
  //             'userMail': 'userMail1@mail.ru',
  //           },
  //           'candidate': {
  //             'candidateId': 1,
  //             'candidateLastName': 'Test1',
  //             'candidateFirstName': 'Test1',
  //             'candidateFatherName': 'Test1',
  //             'candidateMail': 'candidateMail1@mail.ru',
  //             'candidateBirthDate': '01.01.2000',
  //             'candidatePhone': '+7(800)555-35-35',
  //           },
  //           'requestState': 'APPROVED',
  //           'requestDate': '11.09.2011',
  //         },
  //         {
  //           'requestId': 1,
  //           'user': {
  //             'userMail': 'userMail1@mail.ru',
  //           },
  //           'candidate': {
  //             'candidateId': 1,
  //             'candidateLastName': 'Test1',
  //             'candidateFirstName': 'Test1',
  //             'candidateFatherName': 'Test1',
  //             'candidateMail': 'candidateMail1@mail.ru',
  //             'candidateBirthDate': '01.01.2000',
  //             'candidatePhone': '+7(800)555-35-35',
  //           },
  //           'requestState': 'REJECTED',
  //           'requestDate': '11.09.2011',
  //         },
  //       ],
  //     },
  //     "page": {
  //       "size": 10,
  //       "totalElements": 2,
  //       "totalPages": 2,
  //       "number": 1,
  //     }
  //   },
  // };


  // получаем список всех скрытых заявок менеджерами
  async getAllDeletedRequests() {
    console.log('Сработала функция getAllDeletedRequests');
    try {
      const response = await SuperAdminService.getAllDeletedRequests(this.pageNum - 1);
      // const response = this.AllDeleteRequests;

      console.log(toJS(response));
      this.setCandidateAndManagerList(response.data._embedded.requestWithCandidateAndManagerDtoList);
      this.setTotalPage(response.data.page.totalPages);
    } catch (e: any) {
      console.log(e.response?.data?.message);
      throw e;
    }
  };

  // удаляем все скрытые заявоки менеджерами
  async deleteAllDeletedRequests() {
    console.log('Сработала функция deleteAllDeletedRequests');
    this.reset();
    try {
      const response = await SuperAdminService.deleteAllDeletedRequests();
      console.log(toJS(response));
      await this.getAllDeletedRequests();
    } catch (e: any) {
      console.log(e.response?.data?.message);
      throw e;
    }
  };

  async deleteOneRequest(requestId: number) {
    console.log('Сработала функция deleteOneRequest по requestId: ', requestId);
    this.reset();
    try {
      const response = await SuperAdminService.deleteOneRequest(requestId);
      console.log(toJS(response));
      await this.getAllDeletedRequests();
    } catch (e: any) {
      console.log(e.response?.data?.message);
      throw e;
    }
  };

  reset() {
    this.userDtoList = [];
    this.pageNum = 1;
    this.totalPage = 1;

    this.candidateAndManagerList = [];
  }

};