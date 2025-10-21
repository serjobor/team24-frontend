import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ManagerPage.module.css";
import Header from "@components/Header";
import { Context } from "@main";
import { observer } from "mobx-react-lite";

function ManagerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { authStore } = useContext(Context);
  const { managerStore } = useContext(Context);

  const handleSentEmailsNavigation = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Переход на страницу просмотра отправленных писем");
    navigate(`/manager/sent-emails/${managerStore.pageNum}`);
  };

  const handleLogout = async () => {
    // Здесь будет логика выхода из аккаунта
    setIsLoading(true);
    console.log("Попытка выхода из аккаунта менежера");
    
    try {
      await authStore.logout();
      managerStore.reset();
      console.log("Попытка выхода из аккаунта менежера удалась!"); 
      navigate('/auth');
    } catch (error) {
      console.log("Попытка выхода из аккаунта менежера НЕ удалась!", error); 
      alert("Попытка выхода из аккаунта менежера НЕ удалась!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Header roleName="менеджера"/>

      <div className={styles.content}>
        <div className={styles.card}>
          <h2 className={styles.title}>Управление кандидатами</h2>
          
          <form onSubmit={handleSentEmailsNavigation} className={styles.form}>
            <div className={styles.description}>
              <h3>Просмотр отправленных писем</h3>
            </div>
            <button 
              type="submit" 
              className={styles.button}
              disabled={isLoading}
            >
              {isLoading ? "Загрузка..." : "Отправленные письма"}
            </button>
          </form>
        </div>
      </div>

      <button 
          onClick={handleLogout} 
          className={styles.logoutbtn}
          disabled={isLoading}
        >
          Выйти
        </button>
    </div>
  );
}

export default observer(ManagerPage);