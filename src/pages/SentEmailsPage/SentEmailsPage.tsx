import styles from "./SentEmailsPage.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Header from "@components/Header";
import SendEmails from "@components/SendEmails";
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

function SentEmailsPage() {
  const navigate = useNavigate();

  const { managerStore } = useContext(Context);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [isSelectStatusError, setSelectStatusError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCandidatesData, setIsCandidatesData] = useState<string>('');
  const [loadError, setLoadError] = useState<string>('');

  const { pageNum } = useParams();

  const loadSentEmailsPage = async () => {
    setIsLoading(true);
    setLoadError('');
    setIsCandidatesData('')
    console.log("Попытка загрузки страницы");

    // managerStore.reset();

    if (pageNum && (/^\d+$/.test(pageNum.trim()))) {
      managerStore.setPageNum(parseInt(pageNum));
      console.log("текущий номер страницы: ", managerStore.pageNum);

      await new Promise(resolve => setTimeout(resolve, 1000));

      try {
        // Запрашиваем список кандидатов
        await managerStore.getCandidates();
        console.log("Попытка получить список кандидатов удалось!");

        (managerStore.candidateList.length === 0) ? setIsCandidatesData('Ни одно письмо еще не было отправлено') : setIsCandidatesData('');

      } catch (error) {
        console.log("Попытка получить список кандидатов НЕ удалось!", error);
        setLoadError("Не удалось получить список кандидатов. Попробуйте обновить страницу.");
      } finally {
        setIsLoading(false);
      }
    } else {
      navigate("/error");
    }
  };

  // Загружаем список кандидатов при монтировании компонента
  useEffect(() => {
    loadSentEmailsPage();
  }, []);

  const handleLogout = () => {
    managerStore.reset();
    console.log("managerStore.pageNum: ", managerStore.pageNum);
    navigate("/manager");
  };

  const handleSendNewEmails = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handlePageChange = async (pageNumber: number) => {
    managerStore.reset();

    navigate(`/manager/sent-emails/${pageNumber}`);

    setIsLoading(true);
    setLoadError('');
    console.log("Попытка загрузки страницы");

    managerStore.setPageNum(pageNumber);
    console.log("текущий номер страницы: ", managerStore.pageNum);

    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Запрашиваем список кандидатов
      await managerStore.getCandidates();
      console.log("Попытка получить список кандидатов удалось!");
    } catch (error) {
      console.log("Попытка получить список кандидатов НЕ удалось!", error);
      setLoadError("Не удалось получить список кандидатов. Попробуйте обновить страницу.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevPage = () => {
    if (managerStore.pageNum > 1) {
      handlePageChange(managerStore.pageNum - 1);
    }
  };

  const handleNextPage = () => {
    if (managerStore.pageNum < managerStore.totalPage) {
      handlePageChange(managerStore.pageNum + 1);
    }
  };

  // Единый обработчик для обновления таблицы по статусу
  const handleUpdateTableByStatus = async (status: string) => {
    setIsLoading(true);
    setSelectStatusError('');
    setSelectedStatus(status);

    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      await managerStore.sortCandidateByStatus(status);
    } catch (error) {
      console.log(`Попытка сортировки по статусу ${status} НЕ удалась!`, error);
      setSelectStatusError(`Попытка сортировки по статусу ${status} НЕ удалась!`);
    } finally {
      setIsLoading(false);
    }
  };

  // Сброс фильтра по статусу (логика обновления не реализуется)
  const handleResetStatusFilter = async () => {
    setIsLoading(true);
    setSelectStatusError('');
    setSelectedStatus('');
    try {
      managerStore.setPageNum(1);
      console.log("managerStore.pageNum: ", managerStore.pageNum);
      await managerStore.getCandidates();
    } catch (error) {
      console.log(`Попытка сбросить сортировку НЕ удалась!`, error);
      setSelectStatusError(`Попытка сбросить сортировку НЕ удалась!`);
    } finally {
      console.log('Сброшена сортировка по статусу');
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Header roleName="просмотра статуса отправленных писем" />

      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.buttonContainer}>
            <button
              className={styles.button}
              onClick={handleSendNewEmails}
              disabled={(isLoading) ? true : false}
            > Отправить новые письма
            </button>
          </div>

          <div className={styles.filterContainer}>
            <span className={styles.filterLabel}>Отсортировать записи по статусу: </span>
            <button
              className={`${styles.filterBtn} ${selectedStatus === Status.APPROVED ? styles.filterBtnActive : ''}`}
              onClick={() => handleUpdateTableByStatus(Status.APPROVED)}
              disabled={(isLoading || loadError || isCandidatesData) ? true : false}
            >
              Одобрено
            </button>
            <button
              className={`${styles.filterBtn} ${selectedStatus === Status.REJECTED ? styles.filterBtnActive : ''}`}
              onClick={() => handleUpdateTableByStatus(Status.REJECTED)}
              disabled={(isLoading || loadError || isCandidatesData) ? true : false}
            >
              Отказано
            </button>
            <button
              className={`${styles.filterBtn} ${selectedStatus === Status.PENDING ? styles.filterBtnActive : ''}`}
              onClick={() => handleUpdateTableByStatus(Status.PENDING)}
              disabled={(isLoading || loadError || isCandidatesData) ? true : false}
            >
              'Ожидает'
            </button>
            <button
              className={`${styles.filterBtn} ${styles.filterResetBtn}`}
              onClick={handleResetStatusFilter}
              type="button"
              title="Сбросить фильтр"
              aria-label="Сбросить фильтр"
              disabled={(isLoading || loadError || isCandidatesData) ? true : false}
            >
              Сбросить
            </button>
          </div>

          {isSelectStatusError ? (<p className={styles.errorMessage}>{isSelectStatusError}</p>) : ''}

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>№</th>
                  <th>Email кандидата</th>
                  <th>Дата и время отправки</th>
                  <th>Статус</th>
                  <th>Детали кандидата</th>
                  <th>Действия</th>
                </tr>
              </thead>
              {isLoading ? ('') :
                (
                  <tbody>
                    {managerStore.candidateList.map((requests, index) => (
                      <tr key={requests.requestId}>
                        <td>{index + 1}</td>
                        <td>{requests.candidate.candidateMail}</td>
                        <td>{requests.requestDate}</td>
                        <td>
                          <span className={`${styles.statusBadge} ${getStatusClass(requests.requestState)}`}>
                            {/* {requests.requestState} */}
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
                              <span>{requests.candidate.candidateNewMail}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <button
                            className={styles.deleteButton}
                            onClick={() => managerStore.deleteOneCandidate(requests.requestId)}
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
                onClick={loadSentEmailsPage}
                className={styles.button}
              >
                Обновить
              </button>
            ) : ''}

            {/* отображение сообщения при пустой БД */}
            {isCandidatesData ? (<p className={styles.errorMessage}>{isCandidatesData}</p>) : ''}

          </div>

          {managerStore.totalPage > 1 && (
            <div className={styles.pagination}>
              <button
                className={`${styles.paginationButton} ${managerStore.pageNum === 1 ? styles.disabled : ''}`}
                onClick={handlePrevPage}
                disabled={managerStore.pageNum === 1}
              >
                ←
              </button>

              {Array.from({ length: managerStore.totalPage }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`${styles.paginationButton} ${managerStore.pageNum === page ? styles.active : ''}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}

              <button
                className={`${styles.paginationButton} ${managerStore.pageNum === managerStore.totalPage ? styles.disabled : ''}`}
                onClick={handleNextPage}
                disabled={managerStore.pageNum === managerStore.totalPage}
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
              <h3 className={styles.popupTitle}>Отправить новые письма</h3>
              <button
                className={styles.closeButton}
                onClick={handleClosePopup}
              >
                ×
              </button>
            </div>
            <SendEmails onClose={handleClosePopup} isPopup={true} />
          </div>
        </div>
      )}
    </div>
  );
}

export default observer(SentEmailsPage)