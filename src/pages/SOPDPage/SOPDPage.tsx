import React, { useContext, useEffect, useState } from "react";
import styles from "./SOPDPage.module.css";
import { useNavigate } from "react-router-dom";
import Header from "@components/Header";
import { Context } from "@main";
import { observer } from "mobx-react-lite";
import Editor from 'react-simple-wysiwyg';
import Loading from "@/components/Loading";

function SOPDPage() {
  const navigate = useNavigate();
  const { adminStore } = useContext(Context);

  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [loadError, setLoadError] = useState<string>('');
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');

  const loadSOPDText = async () => {
    setIsInitialLoading(true);
    setLoadError('');
    console.log("Попытка загрузки текста СОПД");

    adminStore.reset();

    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Запрашиваем текст СОПД
      await adminStore.getSOPDText();
      console.log("Попытка загрузки текста СОПД удалась!");

    } catch (error) {
      console.log("Попытка загрузки текста СОПД НЕ удалась!", error);
      setLoadError("Не удалось загрузить текст СОПД. Попробуйте обновить страницу.");
    } finally {
      setIsInitialLoading(false);
    }
  };

  // Загружаем текст при монтировании компонента
  useEffect(() => {
    loadSOPDText();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSaveError('');
    setSaveSuccess('');
    
    // Здесь будет логика сохранения текста СОПД
    console.log("Попытка сохранения текста СОПД:", adminStore.sopdText);

    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      await adminStore.saveSOPDText();
      setSaveSuccess('Текст СОПД сохранен!');
      // navigate('/admin');
    } catch (error) {
      console.log("Попытка сохранения текста СОПД НЕ удалась!", error);
      console.log("Попытка сохранения текста СОПД НЕ удалась!:", adminStore.sopdText);
      // alert("Попытка сохранения текста СОПД НЕ удалась!");
      setSaveError('Сохранить текст СОПД не удалось!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToAdmin = () => {
    // Здесь будет логика возврата на страницу администратора
    console.log("Возврат на страницу администратора");
    navigate('/admin');
  };

  // Показываем загрузку при инициализации
  if (isInitialLoading) {
    return (
      <div className={styles.container}>
        <Header roleName="администратора" />
        <div className={styles.content}>
          <div className={styles.card}>
            <div className={styles.loadingContainer}>
              <h2 className={styles.title}>Загрузка текста СОПД...</h2>
              <Loading />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header roleName="администратора" />

      <div className={styles.content}>
        <div className={styles.card}>
          <h2 className={styles.title}>Редактирование согласия на обработку персональных данных (СОПД)</h2>
          {loadError ? (<p className={styles.errorMessage}>{loadError}</p>) : ''}
          {saveError ? (<p className={styles.errorMessage}>{saveError}</p>) : ''}
          {saveSuccess ? (<p className={styles.successMessage}>{saveSuccess}</p>) : ''}
          <form onSubmit={handleSave} className={styles.form}>
            <div className={styles.group}>
              <label htmlFor="text" className={styles.label}>
                Текст согласия на обработку персональных данных:
              </label>
              <div className={styles.editorContainer}>
                {isLoading ? (
                  <Loading />
                ) : (
                  <Editor
                    value={adminStore.sopdText}
                    onChange={(e) => adminStore.setSopdText(e.target.value)}
                    placeholder="Введите текст..."
                  />
                )}
              </div>
            </div>

            <div className={styles.buttons}>
              <button
                type="button"
                onClick={handleBackToAdmin}
                className={styles.exit}
                disabled={isLoading}
              >
                Назад
              </button>

              {loadError ?
                (
                  <button
                    type="button"
                    onClick={loadSOPDText}
                    className={styles.save}
                  >
                    Обновить
                  </button>
                )
                :
                (
                  <button
                    type="submit"
                    className={styles.save}
                    disabled={isLoading}
                  >Сохранить
                  </button>
                )
              }
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default observer(SOPDPage);


/*
Я,  ____________________, даю согласие на обработку моих персональных данных в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных».

Настоящее согласие дается мной на обработку следующих персональных данных:
- Фамилия, имя, отчество
- Дата рождения
- Контактный телефон
- Адрес электронной почты

Цели обработки персональных данных:
- Рассмотрение кандидатуры для трудоустройства
- Проведение собеседований и тестирования
- Принятие решения о трудоустройстве
- Ведение кадрового учета

Согласие дается на срок действия трудовых отношений, а также на срок хранения документов в соответствии с законодательством РФ.

Я подтверждаю, что ознакомлен с правами субъекта персональных данных, установленными главой 3 Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных».
*/