export interface ManagerResponse {
    page: IPage;
    _embedded: { 
        requestWithCandidateDtoList: CandidateList[] 
    }
    _links?: {};
}

export interface CandidateList {
    requestId: number;
    userId: number;
    candidate: ICandidate;
    templateId: number;
    sopdId: number;
    requestToken: string;
    requestState: string;
    requestDate: string;
}

export interface IPage {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
}

export interface ICandidate {
    candidateId: number,
    candidateLastName: string,
    candidateFirstName: string,
    candidateFatherName: string,
    candidateMail: string,
    candidateNewMail: string,
    candidateBirthDate: string,
    candidatePhone: string,
    candidateCreatedAt: string;
}