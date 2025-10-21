import { makeAutoObservable, toJS } from "mobx";
import AdminService from "@services/AdminService";

export default class AdminStore {
  sopdText = '';
  templateSubject = '';
  templateBody = '';

  constructor() {
    makeAutoObservable(this);
  }

  setSopdText(sopdText: string) {
    this.sopdText = sopdText;
  }

  setTemplateSubject(templateSubject: string) {
    this.templateSubject = templateSubject;
    // console.log('ТЕМА ПИСЬМА: ', this.templateSubject);
  }

  setTemplateBody(templateBody: string) {
    this.templateBody = templateBody;
    // console.log('ТЕЛО ПИСЬМА: ', this.templateBody);
  }

  // setLetterTemplate(templateSubject: string, templateBody: string) {
  //   this.templateSubject = templateSubject;
  //   this.templateBody = templateBody;
  // }

  //добавляем в стор текст СОПД
  async getSOPDText() {
    try {
      const response = await AdminService.getSOPDText();
      // const response = {
      //   data: {
      //     sopdText: 'test sopdText1'
      //   }
      // };
      console.log(toJS(response));
      this.setSopdText(response.data.sopdText);
    } catch (e :any) {
      console.log(e.response?.data?.message);
      throw e;
    }
  };

  //отправляем запрос на сервер для сохранения текста СОПД
  async saveSOPDText() {
    try {
      const response = await AdminService.saveSOPDText(this.sopdText);
      // const response = this.sopdText;
      console.log(toJS(response));
    } catch (e :any) {
      console.log(e.response?.data?.message);
      throw e;
    }
  };

  //добавляем в стор шаблона письма
  async getLetterTemplate() {
    try {
      const response = await AdminService.getLetterTemplate();
      // const response = {
      //   data: {
      //     templateSubject: 'test templateSubject',
      //     templateBody: 'test templateBody'
      //   }
      // };
      console.log(toJS(response));
      this.setTemplateSubject(response.data.templateSubject);
      this.setTemplateBody(response.data.templateBody);
      // this.setLetterTemplate(response.data.templateSubject, response.data.templateBody);
    } catch (e :any) {
      console.log(e.response?.data?.message);
      throw e;
    }
  };

  //отправляем запрос на сервер для сохранения шаблона письма
  async saveLetterTemplate() {
    try {
      const response = await AdminService.saveLetterTemplate(this.templateSubject, this.templateBody);
      // const response = {
      //   templateSubject: `${this.templateSubject}`,
      //   templateBody: `${this.templateBody}`
      // };
      console.log(toJS(response));
    } catch (e :any) {
      console.log(e.response?.data?.message);
      throw e;
    }
  };

  reset() {
    this.sopdText = '';
    this.templateSubject = '';
    this.templateBody = '';
  }

};
