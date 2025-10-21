import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminPage.module.css";
import Header from "@components/Header";
import { Context } from "@main";
import { observer } from "mobx-react-lite";

function AdminPage() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const { authStore } = useContext(Context);
  const { adminStore } = useContext(Context);

  const handleSOPDNavigation =  async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Переход на страницу редактирования текста СОПД");
    navigate('/admin/sopds');
  };

  const handleTemplateNavigation = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Переход на страницу редактирования шаблона письма");
    navigate('/admin/letter');
  };

  const handleLogout = async () => {
    // Здесь будет логика выхода из аккаунта
    setIsLoading(true);
    console.log("Попытка выхода из аккаунта администратора");
    
    try {
      await authStore.logout();
      adminStore.reset();
      console.log("Попытка выхода из аккаунта администратора удалась!"); 
      navigate('/auth');
    } catch (error) {
      console.log("Попытка выхода из аккаунта администратора НЕ удалась!", error); 
      alert("Попытка выхода из аккаунта администратора НЕ удалась!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Header roleName="администратора"/>

      <div className={styles.content}>
        <div className={styles.card}>
          <h2 className={styles.title}>Управление документами</h2>
          
          <form onSubmit={handleSOPDNavigation} className={styles.form}>
            <div className={styles.description}>
              <h3>Согласие на обработку персональных данных (СОПД)</h3>
            </div>
            <button 
              type="submit" 
              className={styles.button}
            >Редактировать СОПД
            </button>
          </form>

          <form onSubmit={handleTemplateNavigation} className={styles.form}>
            <div className={styles.description}>
              <h3>Шаблон письма для отправки кандидату</h3>
            </div>
            <button 
              type="submit" 
              className={styles.button}
            >Редактировать шаблон письма
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

export default observer(AdminPage);