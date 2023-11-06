import { TypeUser } from '@/Types/User';
import { createContext } from 'react';

// Create a context
const ContextStore = createContext<{
  user: TypeUser | null; updateUser: (user: TypeUser | null) => void;
  notifications: boolean, updateNotification: (show: boolean) => void
}>({
  user: null, updateUser: () => { },
  notifications: false, updateNotification: () => { }
});

export default ContextStore;
