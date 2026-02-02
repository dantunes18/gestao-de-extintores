
export enum ExtinguisherType {
  ABC_PO = 'Pó Químico ABC',
  CO2 = 'Dióxido de Carbono (CO2)',
  WATER = 'Água Aditivada',
  FOAM = 'Espuma'
}

export enum ExtinguisherStatus {
  OPERATIONAL = 'Operacional',
  MAINTENANCE = 'Em Manutenção',
  EXPIRED = 'Fora de Prazo',
  NEEDS_REPLACEMENT = 'Substituir em Breve'
}

export interface Extinguisher {
  id: string;
  code: string;
  type: ExtinguisherType;
  capacity: string;
  location: string;
  assignedEquipment?: string; // Novo campo: Equipamento ao qual o extintor está alocado
  lastMaintenance: string;
  expiryDate: string;
  status: ExtinguisherStatus;
  notes?: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'tecnico';
}
