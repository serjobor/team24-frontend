import { BrowserRouter, Route, Routes } from "react-router-dom"
import AuthorizationPage from "@pages/AuthorizationPage"
import RegistrationPage from "@pages/RegistrationPage"
import RequestCandidateSOPDPage from "@pages/RequestCandidateSOPDPage"
import ResponseCandidatePage from "@pages/ResponseCandidatePage"
import SentEmailsPage from "@pages/SentEmailsPage"
import AdminPage from "@pages/AdminPage"
import SOPDPage from "@pages/SOPDPage"
import LetterTemplatePage from "@pages/LetterTemplatePage"
import TestPage from "@pages/TestPage"
import ErrorPage from "@pages/ErrorPage"
import ManagerPage from "@pages/ManagerPage"
import SuperAdminPage from "@pages/SuperAdminPage"
import EmployeesPage from "@pages/EmployeesPage"
import AllDeletedRequestsPage from "@pages/AllDeletedRequestsPage"
//import { useContext, useEffect } from "react"
//import { Context } from "@main"
import { observer } from "mobx-react-lite"

function App() {
  /*
    const { authStore } = useContext(Context);

    useEffect(() => {
      if(localStorage.getItem('token')) {
        authStore.checkAuth();
      }
    }, []);
  */
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthorizationPage/>} ></Route>

        <Route path="/super-admin" element={<SuperAdminPage/>}></Route>
        <Route path="/super-admin/employees/:pageNum" element={<EmployeesPage/>}></Route>
        <Route path="/super-admin/requests/:pageNum" element={<AllDeletedRequestsPage/>}></Route>

        <Route path="/admin" element={<AdminPage/>}></Route>
        <Route path="/admin/sopds" element={<SOPDPage/>}></Route>
        <Route path="/admin/letter" element={<LetterTemplatePage/>}></Route>

        <Route path="/registration/:token" element={<RegistrationPage/>} ></Route>
        <Route path="/registration/:token/sopds-request" element={<RequestCandidateSOPDPage/>} ></Route>
        <Route path="/success" element={<ResponseCandidatePage/>} ></Route>

        <Route path="/manager" element={<ManagerPage/>} ></Route>
        <Route path="/manager/sent-emails/:pageNum" element={<SentEmailsPage/>} ></Route>

        <Route path="/error" element={<ErrorPage/>}></Route>
        <Route path="/test" element={<TestPage/>} ></Route>
        <Route path="*" element={<TestPage/>} />
        {/* <Route path="*" element={<ErrorPage/>} /> */}

      </Routes>
    </BrowserRouter>
    </>
  )
}

export default observer(App)
