import { TypeUser } from '@/Types/User';
import { createContext } from 'react';

// Create a context
const ContextStore = createContext<{ user: TypeUser | null; updateUser: (user: TypeUser | null) => void }>({ user: null, updateUser: () => { } });

export default ContextStore;
