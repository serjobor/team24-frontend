// import { useState } from "react";
import styles from "./RequestCandidateSOPDPage.module.css";
import LogoSVG from "@components/LogoSVG";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Context } from "@main";
import Loading from "@/components/Loading";

const Status = {
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  PENDING: 'PENDING'
} as const;


function RequestCandidateSOPDPage() {
  // const [isAgreed, setIsAgreed] = useState<boolean>(false);
  const navigate = useNavigate();

  const { candidateStore } = useContext(Context);

  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadSOPDText = async () => {
    console.log("Попытка загрузки текста СОПД");
    setIsLoading(true);
    setLoadError(null);

    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Запрашиваем текст СОПД
      await candidateStore.getSOPDText();
      console.log("Попытка загрузки текста СОПД удалась!");
    } catch (error) {
      console.log("Попытка загрузки текста СОПД НЕ удалась!", error);
      setLoadError("Не удалось загрузить текст СОПД. Попробуйте обновить страницу.");
    } finally {
      setIsLoading(false);
    }
  };

  // Загружаем текст при монтировании компонента
  useEffect(() => {
    loadSOPDText();
  }, []);

  const handleAgree = async () => {
    // setIsAgreed(true);
    console.log("Попытка отсправить согласие");
    // Здесь будет логика обработки согласия
    // Переходим на страницу подтверждения

    try {
      console.log("Пользователь согласился на обработку персональных данных");

      candidateStore.candidateData.requestState = Status.APPROVED;
      await candidateStore.sendCandidateData();
      candidateStore.reset();
      navigate('/success');
    } catch (error) {
      console.log("Попытка отсправить согласие НЕ удалась!", error);
      alert("Попытка отсправить согласие НЕ удалась!");
    }
  };

  const handleDecline = async () => {
    // setIsAgreed(false);
    console.log("Попытка отсправить согласие");
    // Здесь будет логика обработки согласия
    // Переходим на страницу подтверждения

    try {
      console.log("Пользователь НЕ согласился на обработку персональных данных");

      candidateStore.candidateData.requestState = Status.REJECTED;
      await candidateStore.sendCandidateData();
      candidateStore.reset();
      navigate('/success');
    } catch (error) {
      console.log("Попытка отсправить согласие НЕ удалась!", error);
      alert("Попытка отсправить согласие НЕ удалась!");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <LogoSVG />
      </div>
      <div className={styles.card}>
        <div className={styles.content}>
          {loadError ? (<p className={styles.errorMessage}>{loadError}</p>) : ''}

          {isLoading ?
            (
              <Loading />
            )
            :
            (
              <div className={styles.text}
                dangerouslySetInnerHTML={{ __html: candidateStore.sopdText }}>
                {/* {candidateStore.sopdText} */}
              </div>
            )
          }

          <div className={styles.buttons}>
            <button
              type="button"
              className={`${styles.button} ${styles.decline}`}
              onClick={handleDecline}
              disabled={ (loadError) ? true: false }

            >
              Отказаться
            </button>

            <button
              type="button"
              className={`${styles.button} ${styles.agree}`}
              onClick={handleAgree}
              disabled={ (loadError) ? true: false }
            >Согласиться
            </button>
          </div>

          <div className={styles.signature}>
            <p>С уважением, команда Холдинга Т1</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestCandidateSOPDPage;

/*
<h1 className={styles.greeting}>Привет!</h1>

<p>
  ООО «ГК Иннотех» является разработчиком программного обеспечения для собственных нужд и партнеров.
</p>

<p>
  При организации разработки программного обеспечения мы обрабатываем персональные данные лиц, приглашаемых к участию и/или участвующих в разработке ПО, включая как потенциальных кандидатов, так и собственных работников, и представителей сторонних подрядчиков.
</p>

<p>
  Обработка персональных данных осуществляется на условиях политики конфиденциальности, с которой можно ознакомиться <a href="https://inno.tech/ru/data/privacy_policy/#navigation-id9" className={styles.link}>здесь</a>.
</p>

<p>
  Для выполнения требований законодательства РФ в области обработки персональных данных, предлагаем Вам дать согласие на обработку персональных данных (<a href="https://air.inno.tech/docs/AIR_personal_data_agreement_20240904.docx" className={styles.link}>см. здесь</a>), нажав соответствующую кнопку ниже.
</p>
*/