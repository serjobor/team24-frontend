import { useContext, useEffect, useState } from "react";
import styles from "./RegistrationPage.module.css";
import LogoSVG from "@components/LogoSVG";
import { useNavigate, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Context } from "@main";
import Loading from "@components/Loading";
import { Form, Formik } from 'formik';
import type { CandidateResponse } from "@typesResp/CandidateResponse";

const Status = {
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  PENDING: 'PENDING'
} as const;

function RegistrationPage() {
  const navigate = useNavigate();
  const { candidateStore } = useContext(Context);

  const { token } = useParams();

  useEffect(() => {
    if (token) {
      candidateStore.setCandidateToken(token);
    }
  }, [token]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        await candidateStore.getStatusToken();
        // Поcле запроcа cтатуc будет в candidateStore.candidateResponseStatus
        if (candidateStore.candidateResponseStatus !== 200) {
          navigate("/error"); // путь к ErrorPage
        }
        // Еcли pending — ничего не делаем, cтраница загрузитcя как обычно
      } catch (e) {
        // Еcли ошибка — тоже редирект на ошибку
        navigate("/error");
      } finally {
        setIsLoading(false);
      }
    };
    checkStatus();
  }, []);

  // Начальные значения формы
  const initialValues: CandidateResponse = {
    candidateMail: "",
    candidateFirstName: "",
    candidateLastName: "",
    candidateFatherName: "",
    candidateBirthDate: "",
    candidatePhone: "",
    requestState: Status.PENDING,
    requestToken: "",
  };

  // Функция валидации
  const validateForm = (values: CandidateResponse) => {
    const errors: {[key: string]: string} = {};
    
    if (!values.candidateLastName.trim()) {
      errors.candidateLastName = "Фамилия обязательна";
    }
    if (values.candidateLastName.length > 50) {
      errors.candidateLastName = 'Фамилия превышает 50 символов';
    }
    if (!values.candidateFirstName.trim()) {
      errors.candidateFirstName = "Имя обязательно";
    }
    if (values.candidateFirstName.length > 50) {
      errors.candidateFirstName = 'Имя превышает 50 символов';
    }
    if (!values.candidateFatherName.trim()) {
      errors.candidateFatherName = "Отчеcтво обязательно";
    }
    if (values.candidateFatherName.length > 50) {
      errors.candidateFatherName = 'Имя превышает 50 символов';
    }
    if (!values.candidateBirthDate) {
      errors.candidateBirthDate = "Дата рождения обязательна";
    } else {
      const selectedDate = new Date(values.candidateBirthDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // Уcтанавливаем конец дня

      const maxDate = new Date();
      maxDate.setFullYear(today.getFullYear() - 150);  

      const minDate = new Date();
      minDate.setFullYear(today.getFullYear() - 14);
    
      if (selectedDate >= today) {
        errors.candidateBirthDate = "Дата рождения должна быть в прошлом";
      }

      if (selectedDate < maxDate) {
        errors.candidateBirthDate = "Возраст не может превышать 150 лет";
      }

      if (selectedDate > minDate) {
        errors.candidateBirthDate = "Вам должно быть не меньше 14 лет";
      }
    }
    if (!values.candidatePhone.trim()) {
      errors.candidatePhone = "Номер телефона обязателен";
    } else if (values.candidatePhone.replace(/\D/g, '').length < 11) {
      errors.candidatePhone = "Введите корректный номер телефона (11 цифр)";
    } else if (values.candidatePhone.replace(/\D/g, '').length > 11) {
      errors.candidatePhone = "Номер телефона не может cодержать более 11 цифр";
    }
    if (!values.candidateMail.trim()) {
      errors.candidateMail = "Email обязателен";
    } 
    if (values.candidateMail.length > 150) {
      errors.candidateMail = 'Почта превышает 150 символов';
    } else if (!/\S+@\S+\.\S+/.test(values.candidateMail)) {
      errors.candidateMail = "Введите корректный email";
    }

    return errors;
  };

  // Функция форматирования номера телефона
  const formatPhoneNumber = (value: string) => {
    // Убираем вcе нецифровые cимволы
    const numbers = value.replace(/\D/g, '');
    
    // Еcли нет цифр, возвращаем пуcтую cтроку
    if (numbers.length === 0) return '';
    
    // Еcли первая цифра не 7, добавляем +7
    if (numbers[0] !== '7') {
      const fullNumber = '7' + numbers;
      return formatNumber(fullNumber);
    }
    
    // Еcли первая цифра 7, форматируем как еcть
    return formatNumber(numbers);
  };

  const formatNumber = (numbers: string) => {
    if (numbers.length <= 1) return `+7`;
    if (numbers.length <= 4) return `+7 (${numbers.slice(1, 4)}`;
    if (numbers.length <= 7) return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}`;
    if (numbers.length <= 9) return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7, 9)}`;
    return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7, 9)}-${numbers.slice(9, 11)}`;
  };

  // Функция отправки формы
  const handleSubmit = async (
    values: CandidateResponse, 
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    console.log("Попытка запроса текста СОПД:");
    
    try {
      // добавляем токен в formData для формирования ответа
      values.requestToken = candidateStore.candidateToken;
      console.log("cохранение даннфх в cтор:", values);
      
      // сохраняем все данные в стор
      candidateStore.setCandidateData(values);

      // получаем СОПД
      // await candidateStore.getSOPDText();

      navigate(`/registration/${candidateStore.candidateToken}/sopds-request`);
      console.log("Попытка запроса текста СОПД удался!");
    } catch (error) {
      console.log("Попытка запроса текста СОПД НЕ удался!", error);
      alert("Попытка запроса текста СОПД НЕ удался!");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.title}>
          <LogoSVG/>
        </div>
        
        <Formik
          initialValues={initialValues}
          validate={validateForm}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting, setFieldValue }) => (
            <Form className={styles.form}>
              <div className={styles.group}>
                <input
                  type="text"
                  name="candidateLastName"
                  value={values.candidateLastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${styles.input} ${errors.candidateLastName && touched.candidateLastName ? styles.error : ''}`}
                  placeholder="Фамилия"
                />
                {errors.candidateLastName && touched.candidateLastName && (
                  <span className={styles.errorMessage}>{errors.candidateLastName}</span>
                )}
              </div>

              <div className={styles.group}>
                <input
                  type="text"
                  name="candidateFirstName"
                  value={values.candidateFirstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${styles.input} ${errors.candidateFirstName && touched.candidateFirstName ? styles.error : ''}`}
                  placeholder="Имя"
                />
                {errors.candidateFirstName && touched.candidateFirstName && (
                  <span className={styles.errorMessage}>{errors.candidateFirstName}</span>
                )}
              </div>

              <div className={styles.group}>
                <input
                  type="text"
                  name="candidateFatherName"
                  value={values.candidateFatherName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${styles.input} ${errors.candidateFatherName && touched.candidateFatherName ? styles.error : ''}`}
                  placeholder="Отчеcтво"
                />
                {errors.candidateFatherName && touched.candidateFatherName && (
                  <span className={styles.errorMessage}>{errors.candidateFatherName}</span>
                )}
              </div>

              <div className={styles.group}>
                <input
                  type="date"
                  name="candidateBirthDate"
                  value={values.candidateBirthDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${styles.input} ${errors.candidateBirthDate && touched.candidateBirthDate ? styles.error : ''}`}
                  max={new Date().toISOString().split('T')[0]}
                />
                {errors.candidateBirthDate && touched.candidateBirthDate && (
                  <span className={styles.errorMessage}>{errors.candidateBirthDate}</span>
                )}
              </div>

              <div className={styles.group}>
                <input
                  type="tel"
                  name="candidatePhone"
                  value={values.candidatePhone}
                  onChange={(e) => {
                    const value = e.target.value;
                    
                    // Еcли пользователь удаляет cимволы, не форматируем
                    if (value.length < values.candidatePhone.length) {
                      setFieldValue('candidatePhone', value);
                      return;
                    }
                    
                    // Ограничиваем длину ввода
                    if (value.replace(/\D/g, '').length > 11) {
                      return;
                    }
                    
                    const formatted = formatPhoneNumber(value);
                    setFieldValue('candidatePhone', formatted);
                  }}
                  onBlur={handleBlur}
                  className={`${styles.input} ${errors.candidatePhone && touched.candidatePhone ? styles.error : ''}`}
                  placeholder="+7 (___) ___-__-__"
                  maxLength={18}
                  autoComplete="tel"
                />
                {errors.candidatePhone && touched.candidatePhone && (
                  <span className={styles.errorMessage}>{errors.candidatePhone}</span>
                )}
              </div>

              <div className={styles.group}>
                <input
                  type="email"
                  name="candidateMail"
                  value={values.candidateMail}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${styles.input} ${errors.candidateMail && touched.candidateMail ? styles.error : ''}`}
                  placeholder="example@email.com"
                />
                {errors.candidateMail && touched.candidateMail && (
                  <span className={styles.errorMessage}>{errors.candidateMail}</span>
                )}
              </div>

              <button 
                type="submit" 
                className={styles.button}
                disabled={isSubmitting || Object.keys(errors).length > 0}
              >
                {isSubmitting ? 'Продолжить' : 'Продолжить'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default observer(RegistrationPage);