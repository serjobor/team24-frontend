import { createContext, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AuthStore from '@store/AuthStore.ts';
import AdminStore from '@store/AdminStore.ts';
import CandidateStore from '@store/CandidateStore.ts';
import ManagerStore from '@store/ManagerStore.ts';
import SuperAdminStore from './store/SuperAdminStore.ts';

interface IStore {
  authStore: AuthStore;
  adminStore: AdminStore;
  candidateStore: CandidateStore;
  managerStore: ManagerStore;
  superAdminStore: SuperAdminStore;
  // какие то еще сторы
};

const authStore = new AuthStore();
const adminStore = new AdminStore();
const managerStore = new ManagerStore();
const candidateStore = new CandidateStore();
const superAdminStore = new SuperAdminStore();

export const Context = createContext<IStore>({
  authStore,
  adminStore,
  candidateStore,
  managerStore,
  superAdminStore
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Context.Provider value={{ 
      authStore, 
      adminStore, 
      candidateStore,
      managerStore,
      superAdminStore 
    }}>
      <App />
    </Context.Provider>
  </StrictMode>,
)
