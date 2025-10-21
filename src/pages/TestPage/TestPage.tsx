import { useNavigate } from "react-router-dom";
import "./TestPage.css";
import Header from "@components/Header";

function TestPage() {
  const navigate = useNavigate();

  // Массив всех доступных роутов из App.tsx
  const routes = [
    {
      path: "/auth",
      name: "Страница авторизации",
      description: "Страница для входа в систему",
      component: "AuthorizationPage"
    },

    {
      path: "/admin",
      name: "Панель администратора",
      description: "Главная страница администратора с управлением документами",
      component: "AdminPage"
    },
    {
      path: "/admin/sopds",
      name: "Редактирование СОПД",
      description: "Страница для редактирования согласия на обработку персональных данных",
      component: "SOPDPage"
    },
    {
      path: "/admin/letter",
      name: "Редактирование шаблона письма",
      description: "Страница для редактирования шаблона письма кандидату",
      component: "LetterTemplatePage"
    },

    {
      path: "/error",
      name: "Ошибка",
      description: "Возможно, введён некорректный адрес или страница была удалена",
      component: "ErrorPage"
    },

    {
      path: "/registration/:token",
      name: "Регистрация кандидата",
      description: "Страница для регистрации кандидата",
      component: "RegistrationPage"
    },
    {
      path: "/registration/:token/sopds-request",
      name: "Запрос на подписание СОПД",
      description: "Страница для подписания СОПД",
      component: "RequestCandidateSOPDPage"
    },

    {
      path: "/success",
      name: "Ваш ответ был успешно отправлен",
      description: "Страница с ответом кандидату о завершении регистрации и подписании СОПД",
      component: "ResponseCandidatePage"
    },


    {
      path: "/manager",
      name: "Панель менеджера",
      description: "Главная страница менеджера с управлением кандидатами",
      component: "ManagerPage"
    },
    {
      path: "/manager/sent-emails/1",
      name: "Отправленные письма менеджером",
      description: "Страница менеджера с отпраленными письмами",
      component: "SentEmailsPage"
    },

    {
      path: "/super-admin",
      name: "Супер Админ",
      description: "Страница супер админа",
      component: "SuperAdminPage"
    },
    {
      path: "/super-admin/employees/1",
      name: "Работники",
      description: "Страница с таблицей всех работников",
      component: "EmployeesPage"
    },
    {
      path: "/super-admin/requests/1",
      name: "Скрытые заявки",
      description: "Страница с таблицей всех скрытых заявок менеджерами",
      component: "AllDeletedRequestsPage"
    },
  ];

  const handleRouteClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="test-page-container">
      <Header roleName="тестирования"/>

      <div className="test-page-content">
        <div className="test-page-card">
          <h2 className="test-page-title">Доступные маршруты (Routes)</h2>
          <p className="test-page-description">
            Нажмите на любой маршрут ниже, чтобы перейти на соответствующую страницу
          </p>
          
          <div className="routes-grid">
            {routes.map((route, index) => (
              <div 
                key={index} 
                className="route-card"
                onClick={() => handleRouteClick(route.path)}
              >
                <div className="route-header">
                  <h3 className="route-name">{route.name}</h3>
                  <span className="route-path">{route.path}</span>
                </div>
                <p className="route-description">{route.description}</p>
                <div className="route-component">
                  <strong>Компонент:</strong> {route.component}
                </div>
                <div className="route-click-hint">
                  👆 Нажмите для перехода
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestPage;