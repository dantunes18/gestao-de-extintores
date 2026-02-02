
import { Extinguisher, ExtinguisherStatus, ExtinguisherType, User } from '../types';

const DB_KEY = 'gestextintor_data';
const USERS_KEY = 'gestextintor_users';

const INITIAL_DATA: Extinguisher[] = [
  {
    id: '1',
    code: 'EXT-001',
    type: ExtinguisherType.ABC_PO,
    capacity: '6kg',
    location: 'Receção - Piso 0',
    assignedEquipment: 'Quadro Elétrico Geral',
    lastMaintenance: '2023-10-15',
    expiryDate: '2024-10-15',
    status: ExtinguisherStatus.OPERATIONAL,
  },
  {
    id: '2',
    code: 'EXT-002',
    type: ExtinguisherType.CO2,
    capacity: '2kg',
    location: 'Sala Servidores',
    assignedEquipment: 'Rack de Servidores Principal',
    lastMaintenance: '2023-01-20',
    expiryDate: '2024-01-20',
    status: ExtinguisherStatus.EXPIRED,
  },
  {
    id: '3',
    code: 'EXT-003',
    type: ExtinguisherType.WATER,
    capacity: '9L',
    location: 'Cozinha Refeitório',
    assignedEquipment: 'Fritadeira Industrial',
    lastMaintenance: '2023-11-02',
    expiryDate: '2024-11-02',
    status: ExtinguisherStatus.NEEDS_REPLACEMENT,
  }
];

export const getExtinguishers = (): Extinguisher[] => {
  const data = localStorage.getItem(DB_KEY);
  if (!data) {
    localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_DATA));
    return INITIAL_DATA;
  }
  return JSON.parse(data);
};

export const saveExtinguisher = (extinguisher: Extinguisher) => {
  const current = getExtinguishers();
  const index = current.findIndex(e => e.id === extinguisher.id);
  
  if (index >= 0) {
    current[index] = extinguisher;
  } else {
    current.push(extinguisher);
  }
  
  localStorage.setItem(DB_KEY, JSON.stringify(current));
};

export const deleteExtinguisher = (id: string) => {
  const current = getExtinguishers();
  const filtered = current.filter(e => e.id !== id);
  localStorage.setItem(DB_KEY, JSON.stringify(filtered));
};

// Funções de Utilizador
export const getUsers = (): (User & { password?: string })[] => {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const registerUser = (user: User & { password?: string }) => {
  const users = getUsers();
  if (users.find(u => u.username === user.username)) {
    throw new Error("Utilizador já existe.");
  }
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const findUser = (username: string) => {
  return getUsers().find(u => u.username === username);
};
