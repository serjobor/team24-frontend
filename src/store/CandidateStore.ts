import { makeAutoObservable, toJS } from "mobx";
import CandidateService from "@services/CandidateService";
import type { CandidateResponse } from "@typesResp/CandidateResponse";

export default class CandidateStore {
  candidateData = {} as CandidateResponse;
  candidateToken = '';
  candidateResponseStatus = {} as number; 
  sopdText = '';

  constructor() {
    makeAutoObservable(this);
  }

  setCandidateData(candidateData: CandidateResponse) {
    this.candidateData = candidateData;
  }

  setCandidateToken(candidateToken: string) {
    this.candidateToken = candidateToken;
  }

  setCandidateResponseStatus(candidateResponseStatus: number) {
    this.candidateResponseStatus = candidateResponseStatus;
  }

  setSopdText(sopdText: string) {
    this.sopdText = sopdText;
  }

  reset() {
    this.candidateData = {} as CandidateResponse;
    this.candidateToken = '';
    this.candidateResponseStatus = {} as number; 
    this.sopdText = '';
  }

  //запроc на получение cтатуcа у токена кандидата
  async getStatusToken() {
    try {
      if (!this.candidateToken) {
        throw new Error('Токен не найден');
      }
      const response = await CandidateService.getStatusToken(this.candidateToken);
      // const response = {
      //   status: 200
      // };
      console.log(toJS(response));
      this.setCandidateResponseStatus(response.status);
    } catch (e: any) {
      console.log(e.response?.data?.message);
      throw e;
    }
  };

  //запроc на изменение данных о кандидате
  async sendCandidateData() {
    try {
      const response = await CandidateService.sendCandidateData(this.candidateData);
      // const response = this.candidateData;
      console.log(toJS(response));
    } catch (e: any) {
      console.log(e.response?.data?.message);
      throw e;
    }
  };

  //добавляем в стор текст СОПД
  async getSOPDText() {
    try {
      const response = await CandidateService.getSOPDText();
      // const response = {
      //   data: {
      //     sopdText: 'test sopdText22222'
      //   }
      // };
      console.log(toJS(response));
      this.setSopdText(response.data.sopdText);
    } catch (e :any) {
      console.log(e.response?.data?.message);
      throw e;
    }
  };
};
