import { useContext, useState } from "react";
import styles from "./AuthorizationPage.module.css";
import LogoSVG from "@components/LogoSVG";
import { useNavigate } from "react-router-dom";
import { Form, Formik } from 'formik';
import { Context } from "@main";
import { observer } from "mobx-react-lite"

interface IValues {
  email: string;
  password: string;
};

const ROLE = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  SUPER_ADMIN: 'SUPER_ADMIN'
} as const;

function AuthorizationPage() {
  const { authStore } = useContext(Context);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Проверки email по маске
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Функция валидации полей
  const validateForm = (values: IValues) => {
    const errors: any = {};

    // Валидация email
    if (!values.email) {
      errors.email = 'Введите почту';
    } else if (values.email.length > 150) {
      errors.email = 'Почта должна быть меньше 150 символов';
    } else if (!validateEmail(values.email)) {
      errors.email = 'Почта должна быть вида: example@email.com';
    }

    // Валидация password
    if (!values.password) {
      errors.password = 'Введите пароль';
    } else if (values.password.length > 150) {
      errors.password = 'Пароль должен быть меньше 150 символов';
    }

    return errors;
  };

  // Обработчик переключения видимости пароля
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Функция авторизации
  const handleAuthorization = async (
    values: IValues,
    setSubmitting: (isSubmitting: boolean) => void,
    setFieldError: (field: string, message: string) => void
  ) => {
    try {
      console.log("Попытка входа:");
      console.log("email:", values.email, "password:", values.password);

      // Устанавливаем значения в store
      authStore.setEmail(values.email);
      authStore.setPassword(values.password);

      // Выполняем логин
      await authStore.login();
      console.log("Попытка входа удалась!");

      if (authStore.role === ROLE.ADMIN) {
        console.log("переход на страницу AdminPage");
        navigate('/admin');
      }
      else if (authStore.role === ROLE.MANAGER) {
        console.log("переход на страницу ManagerPage");
        navigate('/manager');
      }
      else if (authStore.role === ROLE.SUPER_ADMIN) {
        console.log("переход на страницу SuperAdminPage");
        navigate('/super-admin');
      }
    } catch (error) {
      console.log("Попытка входа НЕ удалась!", error);
      setFieldError('password', 'Неверный email или пароль');
      alert("Попытка входа НЕ удалась!");
    } finally {
      setSubmitting(false);
    }
  };

  // //Если пользователь уже авторизован
  // if(authStore.isAuth) {
  //   if (authStore.role === ROLE.ADMIN) {
  //     console.log("переход на страницу AdminPage");
  //     navigate('/admin');
  //   }
  //   else if (authStore.role === ROLE.MANAGER) {
  //     console.log("переход на страницу ManagerPage");
  //     navigate('/manager');
  //   }
  // }

  return (
    <div className={styles.container}>
      <div className={styles.card}>

        <div className={styles.title}>
          <LogoSVG />
        </div>

        <Formik
          initialValues={{ email: '', password: '' }}
          validate={validateForm}
          onSubmit={async (values, { setSubmitting, setFieldError }) => {
            handleAuthorization(values, setSubmitting, setFieldError);
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.group}>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${styles.input} ${errors.email && touched.email ? styles.inputError : ''}`}
                  placeholder="example@email.com"
                />
                {errors.email && touched.email && (
                  <div className={styles.errorMessage}>
                    {errors.email}
                  </div>
                )}
              </div>

              <div className={styles.group}>
                <div className={styles.passwordContainer}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${styles.input} ${errors.password && touched.password ? styles.inputError : ''}`}
                    placeholder="Введите пароль"
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && touched.password && (
                  <div className={styles.errorMessage}>
                    {errors.password}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className={styles.button}
                disabled={isSubmitting || Object.keys(errors).length > 0}
              >
                {isSubmitting ? 'Вход...' : 'Войти'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default observer(AuthorizationPage);