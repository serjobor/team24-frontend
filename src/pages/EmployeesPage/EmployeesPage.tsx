import styles from "./EmployeesPage.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Header from "@components/Header";
import AddNewEmployee from "@/components/AddNewEmployee";
import { observer } from "mobx-react-lite";
import { Context } from "@main";
import Loading from "@/components/Loading";

const ROLE = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER'
} as const;

function getRoleClass(role: string) {
  return (role === ROLE.ADMIN) ? styles.admin : styles.manager;
}

function EmployeesPage() {
  const navigate = useNavigate();

  const { superAdminStore } = useContext(Context);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [isSelectRoleError, setSelectRoleError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmployeesData, setIsEmployeesData] = useState<string>('');
  const [loadError, setLoadError] = useState<string>('');

  const { pageNum } = useParams();

  const loadEmployeesPage = async () => {
    setIsLoading(true);
    setLoadError('');
    setIsEmployeesData('');
    console.log("Попытка загрузки страницы");

    // superAdminStore.reset();

    if (pageNum && (/^\d+$/.test(pageNum.trim()))) {
      superAdminStore.setPageNum(parseInt(pageNum));
      console.log("текущий номер страницы: ", superAdminStore.pageNum);

      await new Promise(resolve => setTimeout(resolve, 1000));

      try {
        // Запрашиваем список работников
        await superAdminStore.getEmployees();
        console.log("Попытка получить список работников удалась!");

        (superAdminStore.userDtoList.length === 0) ? setIsEmployeesData('Сотрудников нет в базе данных') : setIsEmployeesData('');

      } catch (error) {
        console.log("Попытка получить список работников НЕ удалась!", error);
        setLoadError("Не удалось получить список работников. Попробуйте обновить страницу.");
      } finally {
        setIsLoading(false);
      }
    } else {
      navigate("/error");
    }
  };

  // Загружаем список работников при монтировании компонента
  useEffect(() => {
    loadEmployeesPage();
  }, []);

  const handleLogout = () => {
    superAdminStore.reset();
    console.log("superAdminStore.pageNum: ", superAdminStore.pageNum);
    navigate("/super-admin");
  };

  const handleAddNewEmployee = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handlePageChange = async (pageNumber: number) => {
    superAdminStore.reset();

    navigate(`/super-admin/employees/${pageNumber}`);

    setIsLoading(true);
    setLoadError('');
    setIsEmployeesData('');

    console.log("Попытка загрузки страницы");

    superAdminStore.setPageNum(pageNumber);
    console.log("текущий номер страницы: ", superAdminStore.pageNum);

    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Запрашиваем список работников
      await superAdminStore.getEmployees();
      console.log("Попытка получить список работников удалась!");
    } catch (error) {
      console.log("Попытка получить список работников НЕ удалась!", error);
      setLoadError("Не удалось получить список работников. Попробуйте обновить страницу.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevPage = () => {
    if (superAdminStore.pageNum > 1) {
      handlePageChange(superAdminStore.pageNum - 1);
    }
  };

  const handleNextPage = () => {
    if (superAdminStore.pageNum < superAdminStore.totalPage) {
      handlePageChange(superAdminStore.pageNum + 1);
    }
  };

  // Единый обработчик для обновления таблицы по роли
  const handleUpdateTableByRole = async (roleName: string) => {
    setIsLoading(true);
    setSelectRoleError('');
    setSelectedRole(roleName);

    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      await superAdminStore.sortEmployeesByRole(roleName);
    } catch (error) {
      console.log(`Попытка сортировки по роли ${roleName} НЕ удалась!`, error);
      setSelectRoleError(`Попытка сортировки по роли ${roleName} НЕ удалась!`);
    } finally {
      setIsLoading(false);
    }
  };

  // Сброс фильтра по роли
  const handleResetRoleFilter = async () => {
    setIsLoading(true);
    setSelectRoleError('');
    setSelectedRole('');
    try {
      superAdminStore.setPageNum(1);
      console.log("superAdminStore.pageNum: ", superAdminStore.pageNum);
      await superAdminStore.getEmployees();
    } catch (error) {
      console.log(`Попытка сбросить сортировку НЕ удалась!`, error);
      setSelectRoleError(`Попытка сбросить сортировку НЕ удалась!`);
    } finally {
      console.log('Сброшена сортировка по роли');
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Header roleName="просмотра всех работников" />

      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.buttonContainer}>
            <button
              className={styles.button}
              onClick={handleAddNewEmployee}
              disabled={(isLoading || loadError) ? true : false}
            > Добавить сотрудника
            </button>
          </div>

          <div className={styles.filterContainer}>
            <span className={styles.filterLabel}>🔍 Отсортировать записи по роли: </span>
            <button
              className={`${styles.filterBtn} ${selectedRole === ROLE.ADMIN ? styles.filterBtnActive : ''}`}
              onClick={() => handleUpdateTableByRole(ROLE.ADMIN)}
              disabled={(isLoading || loadError || isEmployeesData) ? true : false}
            >
              Администраторы
            </button>
            <button
              className={`${styles.filterBtn} ${selectedRole === ROLE.MANAGER ? styles.filterBtnActive : ''}`}
              onClick={() => handleUpdateTableByRole(ROLE.MANAGER)}
              disabled={(isLoading || loadError || isEmployeesData) ? true : false}
            >
              Менеджеры
            </button>

            <button
              className={`${styles.filterBtn} ${styles.filterResetBtn}`}
              onClick={handleResetRoleFilter}
              type="button"
              title="Сбросить фильтр"
              aria-label="Сбросить фильтр"
              disabled={(isLoading || loadError || isEmployeesData) ? true : false}
            >
              Сбросить
            </button>
          </div>

          {isSelectRoleError ? (<p className={styles.errorMessage}>{isSelectRoleError}</p>) : ''}

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  {/* <th style={{ width: '45px', textAlign: 'center' }}>№</th>
                  <th style={{ width: '150px' }}>Роль</th>
                  <th style={{ width: '350px' }}>ФИО</th>
                  <th style={{ width: '250px' }}>Дата добавления</th>
                  <th style={{ width: '341px', textAlign: 'center' }}>Действия</th> */}
                  <th>№</th>
                  <th>Роль</th>
                  <th>ФИО</th>
                  <th>Дата добавления</th>
                  <th>Действия</th>
                </tr>
              </thead>
              {isLoading ? ('') :
                (
                  <tbody>
                    {superAdminStore.userDtoList.map((user, index) => (
                      <tr key={user.userId}>
                        {<td>{index + 1}</td>}
                        <td>
                          <span className={`${styles.statusBadge} ${getRoleClass(user.role.roleName)}`}>
                            {user.role.roleName === ROLE.ADMIN ? 'Администратор' : 'Менеджер'}
                          </span>
                        </td>
                        <td>
                          {`
                          ${user.userLastName}
                          ${user.userFirstName}
                          ${user.userFatherName}
                          `}
                        </td>
                        <td>{user.userCreatedAt}</td>
                        <td>
                          <button
                            className={styles.deleteButton}
                            onClick={() => superAdminStore.deleteEmployee(user.userId)}
                            title="Удалить сотрудника"
                            aria-label="Удалить сотрудника"
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )
              }
            </table>
            {/* отображение загрузки */}
            {isLoading ? (
              <Loading />
            ) : ''}

            {/* отображение сообщениея об ошибке */}
            {loadError ? (<p className={styles.errorMessage}>{loadError}</p>) : ''}

            {/* отображение кнопки "обновить" при ошибке */}
            {loadError ? (
              <button
                type="button"
                onClick={loadEmployeesPage}
                className={styles.button}
              >
                Обновить
              </button>
            ) : ''}

            {/* отображение сообщения при пустой БД */}
            {isEmployeesData ? (<p className={styles.errorMessage}>{isEmployeesData}</p>) : ''}

          </div>

          {superAdminStore.totalPage > 1 && (
            <div className={styles.pagination}>
              <button
                className={`${styles.paginationButton} ${superAdminStore.pageNum === 1 ? styles.disabled : ''}`}
                onClick={handlePrevPage}
                disabled={superAdminStore.pageNum === 1}
              >
                ←
              </button>

              {Array.from({ length: superAdminStore.totalPage }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`${styles.paginationButton} ${superAdminStore.pageNum === page ? styles.active : ''}`}
                  onClick={() => handlePageChange(page)}
                  title={`Страница ${page}`}
                >
                  {page}
                </button>
              ))}

              <button
                className={`${styles.paginationButton} ${superAdminStore.pageNum === superAdminStore.totalPage ? styles.disabled : ''}`}
                onClick={handleNextPage}
                disabled={superAdminStore.pageNum === superAdminStore.totalPage}
                title="Следующая страница"
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>

      <button className={styles.logoutbtn} onClick={handleLogout}>Назад</button>

      {isPopupOpen && (
        <div className={styles.popupOverlay} onClick={handleClosePopup}>
          <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.popupHeader}>
              <h3 className={styles.popupTitle}>Добавить сотрудника</h3>
              <button
                className={styles.closeButton}
                onClick={handleClosePopup}
              >
                ×
              </button>
            </div>
            <AddNewEmployee onClose={handleClosePopup} isPopup={true} />
          </div>
        </div>
      )}
    </div>
  );
}

export default observer(EmployeesPage)