import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SuperAdminPage.module.css";
import Header from "@components/Header";
import { Context } from "@main";
import { observer } from "mobx-react-lite";

function SuperAdminPage() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const { authStore } = useContext(Context);
  // const { adminStore } = useContext(Context);

  const handleToEmployees =  async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Переход на страницу просмотра сотрудников");
    navigate('/super-admin/employees/1');
  };

  const handleToAllDeletedRequests = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Переход на страницу всех удаленных заявок менеджерами");
    navigate('/super-admin/requests/1');
  };

  const handleLogout = async () => {
    // Здесь будет логика выхода из аккаунта
    setIsLoading(true);
    console.log("Попытка выхода из аккаунта супер администратора");
    
    try {
      await authStore.logout();
      // adminStore.reset();
      console.log("Попытка выхода из аккаунта супер администратора удалась!"); 
      navigate('/auth');
    } catch (error) {
      console.log("Попытка выхода из аккаунта супер администратора НЕ удалась!", error); 
      alert("Попытка выхода из аккаунта супер администратора НЕ удалась!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Header roleName="супер администратора"/>

      <div className={styles.content}>
        <div className={styles.card}>
          <h2 className={styles.title}>Функционал</h2>
          
          <form onSubmit={handleToEmployees} className={styles.form}>
            <div className={styles.description}>
              <h3>Просмотр всех действующих сотрудников</h3>
            </div>
            <button 
              type="submit" 
              className={styles.button}
            >Посмотреть сотрудников
            </button>
          </form>

          <form onSubmit={handleToAllDeletedRequests} className={styles.form}>
            <div className={styles.description}>
              <h3>Просмотр всех удаленных писем менеджерами</h3>
            </div>
            <button 
              type="submit" 
              className={styles.button}
            >Посмотреть письма
            </button>
          </form>
        </div>
      </div>

      <button 
          onClick={handleLogout} 
          className={styles.logoutbtn}
          disabled={isLoading}
        >
          {isLoading ? "Выход..." : "Выйти"}
        </button>
    </div>
  );
}

export default observer(SuperAdminPage);