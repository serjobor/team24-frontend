import { observer } from "mobx-react-lite";
import styles from "./AddNewEmployee.module.css";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "@main";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import type { IUserSendData } from "@/types/SuperAdminResponse";

interface AddNewEmployeeProps {
  onClose?: () => void;
  isPopup?: boolean;
}

// Простая валидация без внешних зависимостей
const validateForm = (values: any) => {
  const errors: any = {};
  
  if (!values.userLastName) {
    errors.userLastName = 'Фамилия обязательна для заполнения';
  } else if (values.userLastName.length < 2) {
    errors.userLastName = 'Фамилия должна содержать минимум 2 символа';
  } else if (values.userLastName.length > 50) {
    errors.userLastName = 'Фамилия не должна превышать 50 символов';
  }
  
  if (!values.userFirstName) {
    errors.userFirstName = 'Имя обязательно для заполнения';
  } else if (values.userFirstName.length < 2) {
    errors.userFirstName = 'Имя должно содержать минимум 2 символа';
  } else if (values.userFirstName.length > 50) {
    errors.userFirstName = 'Имя не должно превышать 50 символов';
  }
  
  if (!values.userFatherName) {
    errors.userFatherName = 'Отчество обязательно для заполнения';
  } else if (values.userFatherName.length < 2) {
    errors.userFatherName = 'Отчество должно содержать минимум 2 символа';
  } else if (values.userFatherName.length > 50) {
    errors.userFatherName = 'Отчество не должно превышать 50 символов';
  }
  
  if (!values.userRole) {
    errors.userRole = 'Роль обязательна для выбора';
  } else if (!['ADMIN', 'MANAGER'].includes(values.userRole)) {
    errors.userRole = 'Выберите корректную роль';
  }
  
  if (!values.userMail) {
    errors.userMail = 'Email обязателен для заполнения';
  } else if (!/\S+@\S+\.\S+/.test(values.userMail)) {
    errors.userMail = 'Введите корректный email адрес';
  }
  
  if (!values.userPassword) {
    errors.userPassword = 'Пароль обязателен для заполнения';
  } else if (values.userPassword.length < 8) {
    errors.userPassword = 'Пароль должен содержать минимум 8 символов';
  }
  
  return errors;
};

function AddNewEmployee({ onClose, isPopup = false }: AddNewEmployeeProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const navigate = useNavigate();

  const { superAdminStore } = useContext(Context);

  const initialValues: IUserSendData = {
    userLastName: '',
    userFirstName: '',
    userFatherName: '',
    userRole: '',
    userMail: '',
    userPassword: '',
  };

  const handleSubmit = async (values: IUserSendData, { resetForm }: any) => {
    setSubmitError(null);
    
    try {
      // TODO: интеграция с API для добавления сотрудника
      console.log("Component AddNewEmployee Данные нового сотрудника:", values);
      
      // Здесь должен быть вызов API для добавления сотрудника
      await superAdminStore.addNewEmployee(values);
      // await superAdminStore.getEmployees();
      
      setSubmitSuccess(true);
      resetForm();

      // Автоматически закрываем форму через 2 секунды
      setTimeout(() => {
        if (isPopup && onClose) {
          onClose();
        } else {
          navigate("/super-admin/employees/1");
        }
      }, 2000);
      
    } catch (error) {
      console.error("Ошибка при добавлении сотрудника:", error);
      setSubmitError("Произошла ошибка при добавлении сотрудника. Попробуйте еще раз.");
    }
  };

  return (
    <div className={`${styles.container} ${isPopup ? styles.popup : ''}`}>
      <div className={styles.card}>
        {submitSuccess && (
          <div className={styles.successMessage}>
            <div className={styles.successIcon}>✅</div>
            <div className={styles.successText}>
              <h4>Сотрудник успешно добавлен!</h4>
              <p>Форма будет закрыта автоматически...</p>
            </div>
          </div>
        )}

        {submitError && (
          <div className={styles.errorMessage}>
            <div className={styles.errorIcon}>❌</div>
            <p>{submitError}</p>
          </div>
        )}

        <Formik
          initialValues={initialValues}
          validate={validateForm}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, isValid, dirty }) => (
            <Form className={styles.form}>
              <div className={styles.formGrid}>
                {/* Фамилия */}
                <div className={styles.fieldGroup}>
                  <label htmlFor="userLastName" className={styles.label}>
                    Фамилия *
                  </label>
                  <Field
                    type="text"
                    id="userLastName"
                    name="userLastName"
                    className={styles.input}
                    placeholder="Введите фамилию"
                  />
                  <ErrorMessage name="userLastName" component="div" className={styles.error} />
                </div>

                {/* Имя */}
                <div className={styles.fieldGroup}>
                  <label htmlFor="userFirstName" className={styles.label}>
                    Имя *
                  </label>
                  <Field
                    type="text"
                    id="userFirstName"
                    name="userFirstName"
                    className={styles.input}
                    placeholder="Введите имя"
                  />
                  <ErrorMessage name="userFirstName" component="div" className={styles.error} />
                </div>

                {/* Отчество */}
                <div className={styles.fieldGroup}>
                  <label htmlFor="userFatherName" className={styles.label}>
                    Отчество *
                  </label>
                  <Field
                    type="text"
                    id="userFatherName"
                    name="userFatherName"
                    className={styles.input}
                    placeholder="Введите отчество"
                  />
                  <ErrorMessage name="userFatherName" component="div" className={styles.error} />
                </div>

                {/* Роль */}
                <div className={styles.fieldGroup}>
                  <label htmlFor="userRole" className={styles.label}>
                    Роль *
                  </label>
                  <Field
                    as="select"
                    id="userRole"
                    name="userRole"
                    className={styles.select}
                  >
                    <option value="">Выберите роль</option>
                    <option value="ADMIN">Администратор</option>
                    <option value="MANAGER">Менеджер</option>
                  </Field>
                  <ErrorMessage name="userRole" component="div" className={styles.error} />
                </div>

                {/* Email */}
                <div className={styles.fieldGroup}>
                  <label htmlFor="userMail" className={styles.label}>
                    Email *
                  </label>
                  <Field
                    type="email"
                    id="userMail"
                    name="userMail"
                    className={styles.input}
                    placeholder="example@company.com"
                  />
                  <ErrorMessage name="userMail" component="div" className={styles.error} />
                </div>

                {/* Пароль */}
                <div className={styles.fieldGroup}>
                  <label htmlFor="userPassword" className={styles.label}>
                    Пароль *
                  </label>
                  <Field
                    // type="password"
                    id="userPassword"
                    name="userPassword"
                    className={styles.input}
                    placeholder="Минимум 8 символов"
                  />
                  <ErrorMessage name="userPassword" component="div" className={styles.error} />
                  <div className={styles.passwordHint}>
                    Пароль должен содержать латинские буквы и цифры
                  </div>
                </div>
              </div>

              <div className={styles.actions}>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isSubmitting || !isValid || !dirty}
                >
                  {isSubmitting ? (
                    <>
                      <span className={styles.spinner}></span>
                      Добавление...
                    </>
                  ) : (
                    'Добавить сотрудника'
                  )}
                </button>

                {!isPopup && (
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => navigate("/super-admin/employees/1")}
                  >
                    Отмена
                  </button>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default observer(AddNewEmployee)