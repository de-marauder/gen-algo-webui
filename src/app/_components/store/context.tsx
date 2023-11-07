import { TypeUser } from '@/Types/User';
import { createContext } from 'react';


// Create a context
const ContextStore = createContext<{
  user: TypeUser | null; updateUser: (user: TypeUser | null) => void;
  notifications: boolean, updateNotification: (show: boolean) => void;
  notifCounter: number, updateNotifCounter: (count: number) => void;
  swr: ServiceWorkerRegistration | null, updateSWR: (swr: ServiceWorkerRegistration) => void;
}>({
  user: null, updateUser: () => { },
  notifications: false, updateNotification: () => { },
  notifCounter: 0, updateNotifCounter: () => { },
  swr: null, updateSWR: () => { },
});

export default ContextStore;
