// import { useNavigate } from "react-router-dom";
import styles from "./ErrorPage.module.css";
import LogoSVG from "@components/LogoSVG";
import notFoundImage from "@assets/notFound.svg";

function ErrorPage() {
  // const navigate = useNavigate();

  // const handleBackToHome = () => {
  //   navigate('/');
  // };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <LogoSVG />
      </div>
      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.imageContainer}>
            <img
              src={notFoundImage}
              alt="Страница не найдена"
              className={styles.image}
            />
          </div>

          <div className={styles.textContainer}>
            <h2 className={styles.heading}>Страница не найдена</h2>
            <p className={styles.description}>
              Возможно, введён некорректный адрес или страница была удалена.
            </p>
          </div>

          {/* <button
            onClick={handleBackToHome}
            className={styles.backHomeBtn}
          >
            Вернуться на главную
          </button> */}
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;