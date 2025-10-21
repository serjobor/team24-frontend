import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LetterTemplatePage.module.css";
import Header from "@components/Header";
import { Context } from "@main";
import { observer } from "mobx-react-lite";
// import Editor from 'react-simple-wysiwyg';
import Loading from "@/components/Loading";
import MyEditor from "@/components/MyEditor";


function LetterTemplatePage() {
  const navigate = useNavigate();
  const { adminStore } = useContext(Context);

  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [loadError, setLoadError] = useState<string>('');
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');

  const loadLetterTemplateText = async () => {
    setIsInitialLoading(true);
    setLoadError('');
    console.log("Попытка загрузки шаблона письма");

    adminStore.reset();

    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Запрашиваем текст шаблона письма
      await adminStore.getLetterTemplate();
      console.log("Попытка загрузки шаблона письма удалась!");

    } catch (error) {
      console.log("Попытка загрузки шаблона письма НЕ удалась!", error);
      setLoadError("Не удалось загрузить шаблон письма. Попробуйте обновить страницу.");
    } finally {
      setIsInitialLoading(false);
    }
  };

  // Загружаем текст при монтировании компонента
  useEffect(() => {
    loadLetterTemplateText();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSaveError('');
    setSaveSuccess('');

    // Здесь будет логика сохранения текста шаблона письма
    console.log("Попытка сохранения темы письма:", adminStore.templateSubject, "Попытка сохранения тела письма:", adminStore.templateBody);

    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      await adminStore.saveLetterTemplate();
      setSaveSuccess('Текст шаблона письма сохранен!');
      // navigate('/admin');
    } catch (error) {
      console.log("Попытка сохранения шаблона письма НЕ удалась!", error);
      console.log("templateSubject:", adminStore.templateSubject, "templateBody:", adminStore.templateBody);
      setSaveError('Сохранить шаблона письма не удалось!');
      // alert("Попытка сохранения шаблона письма НЕ удалась!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToAdmin = () => {
    // Навигация обратно на страницу администратора
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
              <h2 className={styles.title}>Загрузка шаблона письма</h2>
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
          <h2 className={styles.title}>Редактирование шаблона письма для отправки кандидатам</h2>
          {loadError ? (<p className={styles.errorMessage}>{loadError}</p>) : ''}
          {saveError ? (<p className={styles.errorMessage}>{saveError}</p>) : ''}
          {saveSuccess ? (<p className={styles.successMessage}>{saveSuccess}</p>) : ''}
          <form onSubmit={handleSave} className={styles.form}>
            <div className={styles.group}>
              {isLoading ? (
                  <Loading />
                ) : (
                  <MyEditor/>
                )}
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
                    onClick={loadLetterTemplateText}
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

export default observer(LetterTemplatePage);

/*
Привет!

Перейди пожалуйста по ссылке: {УНИКАЛЬНАЯ ССЫЛКА ДЛЯ КАНДИДАТА}

С уважением, команда Холдинга Т1

---
Письмо отправлено автоматически из системы подбора персонала. Пожалуйста, не отвечайте на него.

*/