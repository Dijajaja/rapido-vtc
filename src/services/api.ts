import type {
  Driver,
  Ride,
  Passenger,
  CommissionSettings,
  PaymentMethodConfig,
  SupportTicket,
  PricingSettings
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

/**
 * Service centralisé pour l'interfaçage entre les acteurs de Rapido VTC :
 * - Administrateur / DG (Supervision, Validation, Paramètres)
 * - Chauffeurs (Dossiers, Statuts, Portefeuille, Courses)
 * - Passagers (Commandes, Notations, Dépenses)
 *
 * Fonctionne en mode hybride :
 * 1. Tente d'appeler l'API de votre camarade si connectée.
 * 2. Si l'API backend n'est pas encore démarrée, utilise le fallback local sans planter l'interface.
 */

// ==========================================
// 1. Chauffeurs (Drivers)
// ==========================================
export const driverApi = {
  async getDrivers(): Promise<Driver[]> {
    try {
      const res = await fetch(`${API_BASE}/drivers`);
      if (res.ok) {
        const data = await res.json();
        return data.drivers || data;
      }
    } catch {}
    return [];
  },

  async updateStatus(driverId: string, status: Driver['status'], note?: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/drivers/${driverId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, decisionNote: note }),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async requestDocument(driverId: string, note?: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/drivers/${driverId}/request-docs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }
};

// ==========================================
// 2. Courses (Rides & Trajets)
// ==========================================
export const rideApi = {
  async getRides(): Promise<Ride[]> {
    try {
      const res = await fetch(`${API_BASE}/rides`);
      if (res.ok) {
        const data = await res.json();
        return data.rides || data;
      }
    } catch {}
    return [];
  },

  async createRide(rideData: Partial<Ride>): Promise<Ride | null> {
    try {
      const res = await fetch(`${API_BASE}/rides`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rideData),
      });
      if (res.ok) return await res.json();
    } catch {}
    return null;
  },

  async resolveSos(rideId: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/rides/${rideId}/resolve-sos`, {
        method: 'POST',
      });
      return res.ok;
    } catch {
      return false;
    }
  }
};

// ==========================================
// 3. Passagers (Passengers)
// ==========================================
export const passengerApi = {
  async getPassengers(): Promise<Passenger[]> {
    try {
      const res = await fetch(`${API_BASE}/passengers`);
      if (res.ok) {
        const data = await res.json();
        return data.passengers || data;
      }
    } catch {}
    return [];
  },

  async toggleStatus(passengerId: string, currentStatus: 'actif' | 'bloque'): Promise<boolean> {
    const nextStatus = currentStatus === 'actif' ? 'bloque' : 'actif';
    try {
      const res = await fetch(`${API_BASE}/passengers/${passengerId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }
};

// ==========================================
// 4. Commission & Paramètres Plateforme
// ==========================================
export const settingsApi = {
  async getCommissionSettings(): Promise<CommissionSettings | null> {
    try {
      const res = await fetch(`${API_BASE}/settings/commission`);
      if (res.ok) return await res.json();
    } catch {}
    return null;
  },

  async saveCommissionSettings(settings: CommissionSettings): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/settings/commission`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async savePaymentMethods(methods: PaymentMethodConfig[]): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/settings/payment-methods`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ methods }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }
};

// ==========================================
// 5. Support & Réclamations
// ==========================================
export const supportApi = {
  async getTickets(): Promise<SupportTicket[]> {
    try {
      const res = await fetch(`${API_BASE}/support/tickets`);
      if (res.ok) {
        const data = await res.json();
        return data.tickets || data;
      }
    } catch {}
    return [];
  },

  async resolveTicket(ticketId: string, response: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/support/tickets/${ticketId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }
};
