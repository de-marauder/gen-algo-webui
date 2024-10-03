import { TypeConfig } from '@/Types/Config';
import { TypeUser } from '@/Types/User';
import { createContext } from 'react';


// Create a context
const ContextStore = createContext<{
  user: TypeUser | null; updateUser: (user: TypeUser | null) => void;
  configId: string; updateConfigId: (configId: string) => void;
  configs: TypeConfig[]; updateConfigs: (configs: TypeConfig[]) => void;
  configLoading: boolean; updateConfigLoading: (loading: boolean) => void;
  configError: string; updateConfigError: (error: string) => void;
  notifications: boolean, updateNotification: (show: boolean) => void;
  notifCounter: number, updateNotifCounter: (count: number) => void;
  swr: ServiceWorkerRegistration | null, updateSWR: (swr: ServiceWorkerRegistration) => void;
}>({
  user: null, updateUser: () => { },
  configId: '', updateConfigId: () => { },
  configs: [], updateConfigs: () => { },
  configLoading: false, updateConfigLoading: () => { },
  configError: '', updateConfigError: () => { },
  notifications: false, updateNotification: () => { },
  notifCounter: 0, updateNotifCounter: () => { },
  swr: null, updateSWR: () => { },
});

export default ContextStore;
