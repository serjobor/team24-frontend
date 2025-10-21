// данные о сотрудниках, которые ожидаю с сервера
export interface EmployeeResponse {
  _embedded: {
    userDtoWithRoleDtoList: IUser[],
  },
  page: IPage,
}

export interface IUser {
  userId: number,
  userMail: string,
  userLastName: string,
  userFirstName: string,
  userFatherName: string,

  role: {
    roleId: number,
    roleName: string,
  },
  
  userCreatedAt: string,
}

export interface IPage {
  size: number,
  totalElements: number,
  totalPages: number,
  number: number,
}

// данные нового пользователя для отправки на сервер
export interface IUserSendData {
    userLastName: string,
    userFirstName: string,
    userFatherName: string,
    userRole: string,
    userMail: string,
    userPassword: string,
}

// Данные об удаленных заявках менеджерами, которые ожидаю с сервера
export interface AllDeletedRequestsResponse {
  _embedded: { 
    requestWithCandidateAndManagerDtoList: CandidateAndManagerList[],
  },
  page: IPage,
}

export interface CandidateAndManagerList {
  requestId: number,
  user: {
    userMail: string,
  },
  candidate: ICandidate,
  requestState: string,
  requestDate: string,
}

export interface ICandidate {
  candidateId: number,
  candidateLastName: string,
  candidateFirstName: string,
  candidateFatherName: string,
  candidateMail: string,
  candidateBirthDate: string,
  candidatePhone: string,
}

export interface IPage {
  size: number,
  totalElements: number,
  totalPages: number,
  number: number,
}


