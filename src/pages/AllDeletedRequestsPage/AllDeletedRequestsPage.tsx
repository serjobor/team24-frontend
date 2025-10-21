import styles from "./AllDeletedRequestsPage.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Header from "@components/Header";
import { observer } from "mobx-react-lite";
import { Context } from "@main";
import Loading from "@/components/Loading";

const Status = {
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  PENDING: 'PENDING'
} as const;

function getStatusClass(status: string) {
  if (status === Status.APPROVED) return styles.statusApproved;
  if (status === Status.REJECTED) return styles.statusDeclined;
  return styles.statusWaiting;
}

function AllDeletedRequestsPage() {
  const navigate = useNavigate();

  const { superAdminStore } = useContext(Context);

  const [isLoading, setIsLoading] = useState(false);
  const [isRequestsData, setIsRequestsData] = useState<string>('');
  const [loadError, setLoadError] = useState<string>('');

  const { pageNum } = useParams();

  const loadAllDeletedRequestsPage = async () => {
    setIsLoading(true);
    setLoadError('');
    setIsRequestsData('')
    console.log("Попытка загрузки страницы");

    // superAdminStore.reset();

    if (pageNum && (/^\d+$/.test(pageNum.trim()))) {
      superAdminStore.setPageNum(parseInt(pageNum));
      console.log("текущий номер страницы: ", superAdminStore.pageNum);

      await new Promise(resolve => setTimeout(resolve, 1000));

      try {
        // Запрашиваем список всех удаленных заявок
        await superAdminStore.getAllDeletedRequests();
        console.log("Попытка получить список заявок удалась!");

        (superAdminStore.candidateAndManagerList.length === 0) ? setIsRequestsData('Ни одна заявка еще не была удалена менеджером') : setIsRequestsData(''); 

      } catch (error) {
        console.log("Попытка получить список заявок НЕ удалась!", error);
        setLoadError("Не удалось получить список заявок. Попробуйте обновить страницу.");
      } finally {
        setIsLoading(false);
      }
    } else {
      navigate("/error");
    }
  };

  // Загружаем список заявок при монтировании компонента
  useEffect(() => {
    loadAllDeletedRequestsPage();
  }, []);

  const handleLogout = () => {
    superAdminStore.reset();
    console.log("superAdminStore.pageNum: ", superAdminStore.pageNum);
    navigate("/super-admin");
  };

  const handlePageChange = async (pageNumber: number) => {
    superAdminStore.reset();

    navigate(`/super-admin/requests/${pageNumber}`);

    setIsLoading(true);
    setLoadError('');
    setIsRequestsData('');
    console.log("Попытка загрузки страницы");

    superAdminStore.setPageNum(pageNumber);
    console.log("текущий номер страницы: ", superAdminStore.pageNum);

    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Запрашиваем список заявок
      await superAdminStore.getAllDeletedRequests();
      console.log("Попытка получить список заявок удалась!");
    } catch (error) {
      console.log("Попытка получить список заявок НЕ удалась!", error);
      setLoadError("Не удалось получить список заявок. Попробуйте обновить страницу.");
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

  return (
    <div className={styles.container}>
      <Header roleName="просмотра всех удаленных заявок"/>

      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.buttonContainer}>
            <button
              className={`${styles.button} ${styles.deleteBtn}`}
              onClick={() => superAdminStore.deleteAllDeletedRequests()}
              disabled={(isLoading || loadError) ? true : false}
            > Удалить все заявки безвозвратно 
            </button>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>№</th>
                  <th>Email менеджера</th>
                  <th>Дата и время отправки письма</th>
                  <th>Статус</th>
                  <th>Детали кандидата</th>
                  <th>Действия</th>
                </tr>
              </thead>
              {isLoading ? ('') :
                (
                  <tbody>
                    {superAdminStore.candidateAndManagerList.map((requests, index) => (
                      <tr key={requests.requestId}>
                        <td>{index + 1}</td>
                        <td>{requests.user.userMail}</td>
                        <td>{requests.requestDate}</td>
                        <td>
                          <span className={`${styles.statusBadge} ${getStatusClass(requests.requestState)}`}>
                            {
                            requests.requestState === Status.APPROVED ? 'Одобрено' :
                            requests.requestState === Status.REJECTED ? 'Отказано' : 'Ожидает'
                            }
                          </span>
                        </td>
                        <td>
                          <div className={styles.candidateCell}>
                            <div className={styles.candidateLine}>
                              <span className={styles.label}>ФИО:</span>
                              <span className={styles.labelText}>
                                <span>{requests.candidate.candidateLastName}  </span>
                                <span>{requests.candidate.candidateFirstName} </span>
                                <span>{requests.candidate.candidateFatherName}</span>
                              </span>
                            </div>
                            <div className={styles.candidateLine}>
                              <span className={styles.label}>Дата рождения:</span>
                              <span>{requests.candidate.candidateBirthDate}</span>
                            </div>
                            <div className={styles.candidateLine}>
                              <span className={styles.label}>Телефон:</span>
                              <span>{requests.candidate.candidatePhone}</span>
                            </div>
                            <div className={styles.candidateLine}>
                              <span className={styles.label}>Email:</span>
                              <span>{requests.candidate.candidateMail}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <button
                            className={styles.deleteButton}
                            onClick={() => superAdminStore.deleteOneRequest(requests.requestId)}
                            title="Удалить запись"
                            aria-label="Удалить запись"
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
                onClick={loadAllDeletedRequestsPage}
                className={styles.button}
              >
                Обновить
              </button>
            ) : ''}

            {/* отображение сообщения при пустой БД */}
            {isRequestsData ? (<p className={styles.errorMessage}>{isRequestsData}</p>) : ''}

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
                >
                  {page}
                </button>
              ))}

              <button
                className={`${styles.paginationButton} ${superAdminStore.pageNum === superAdminStore.totalPage ? styles.disabled : ''}`}
                onClick={handleNextPage}
                disabled={superAdminStore.pageNum === superAdminStore.totalPage}
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>

      <button className={styles.logoutbtn} onClick={handleLogout}>Назад</button>
    </div>
  );
}

export default observer(AllDeletedRequestsPage)