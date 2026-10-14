import mongoose, { Schema, Document } from 'mongoose';

// ==========================================
// 1. Modèle Chauffeur (Driver Actor)
// ==========================================
export interface IDriver extends Document {
  dossierNumber: string;
  nameFr: string;
  nameAr?: string;
  phone: string;
  otpVerified: boolean;
  nni: string;
  nniVerified: boolean;
  immatriculation: string;
  vehicle: string;
  year: number;
  color: string;
  category: 'Économique' | 'Confort' | 'Premium' | 'Van / Famille';
  hasClim: boolean;
  status: 'en_attente' | 'documents_manquants' | 'approuve' | 'rejete';
  walletBalanceMru: number; // Solde portefeuille pour le prélèvement des commissions Cash
  rating: number;
  totalCompletedRides: number;
  documents: {
    id: string;
    type: string;
    title: string;
    subtitle?: string;
    status: 'conforme' | 'a_verifier' | 'illisible' | 'manquant';
    notes?: string;
    updatedAt?: Date;
  }[];
  decisionNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DriverSchema = new Schema<IDriver>({
  dossierNumber: { type: String, required: true, unique: true },
  nameFr: { type: String, required: true },
  nameAr: { type: String },
  phone: { type: String, required: true, unique: true },
  otpVerified: { type: Boolean, default: true },
  nni: { type: String, required: true, unique: true },
  nniVerified: { type: Boolean, default: true },
  immatriculation: { type: String, required: true },
  vehicle: { type: String, required: true },
  year: { type: Number, default: 2020 },
  color: { type: String, default: 'Blanc' },
  category: { type: String, enum: ['Économique', 'Confort', 'Premium', 'Van / Famille'], default: 'Économique' },
  hasClim: { type: Boolean, default: true },
  status: { type: String, enum: ['en_attente', 'documents_manquants', 'approuve', 'rejete'], default: 'en_attente' },
  walletBalanceMru: { type: Number, default: 500, min: 0 },
  rating: { type: Number, default: 4.8, min: 0, max: 5 },
  totalCompletedRides: { type: Number, default: 0, min: 0 },
  documents: [{
    id: String,
    type: String,
    title: String,
    subtitle: String,
    status: { type: String, enum: ['conforme', 'a_verifier', 'illisible', 'manquant'], default: 'a_verifier' },
    notes: String,
    updatedAt: { type: Date, default: Date.now }
  }],
  decisionNote: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// ==========================================
// 2. Modèle Course (Ride Interfacing Actor)
// ==========================================
export interface IRide extends Document {
  ref: string;
  passengerId?: string;
  passengerName: string;
  passengerPhone?: string;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  from: string;
  to: string;
  category: 'Économique' | 'Confort' | 'Premium' | 'Van / Famille';
  amountMru: number;
  commissionMru: number; // Ex: 10% de amountMru
  driverEarningsMru: number; // Ex: 90%
  paymentMethod: 'Cash' | 'Bankily' | 'Masrvi' | 'Sedad' | 'Carte';
  status: 'En cours' | 'Terminée' | 'En recherche' | 'En approche' | 'Annulée';
  distanceKm: number;
  durationMin: number;
  hasSosAlert: boolean;
  sosReason?: string;
  createdAt: Date;
  completedAt?: Date;
}

const RideSchema = new Schema<IRide>({
  ref: { type: String, required: true, unique: true },
  passengerId: { type: String },
  passengerName: { type: String, required: true },
  passengerPhone: { type: String },
  driverId: { type: String },
  driverName: { type: String },
  driverPhone: { type: String },
  from: { type: String, required: true },
  to: { type: String, required: true },
  category: { type: String, default: 'Économique' },
  amountMru: { type: Number, required: true, min: 0 },
  commissionMru: { type: Number, default: 0, min: 0 },
  driverEarningsMru: { type: Number, default: 0, min: 0 },
  paymentMethod: { type: String, default: 'Cash' },
  status: { type: String, default: 'En recherche' },
  distanceKm: { type: Number, default: 5, min: 0 },
  durationMin: { type: Number, default: 15, min: 0 },
  hasSosAlert: { type: Boolean, default: false },
  sosReason: { type: String },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date }
});

// ==========================================
// 3. Modèle Passager (Passenger Actor)
// ==========================================
export interface IPassenger extends Document {
  name: string;
  phone: string;
  rating: number;
  totalRides: number;
  spentMru: number;
  status: 'actif' | 'bloque';
  preferredPayment: 'Cash' | 'Bankily' | 'Masrvi';
  createdAt: Date;
  lastRideAt?: Date;
}

const PassengerSchema = new Schema<IPassenger>({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  rating: { type: Number, default: 5.0, min: 0, max: 5 },
  totalRides: { type: Number, default: 0, min: 0 },
  spentMru: { type: Number, default: 0, min: 0 },
  status: { type: String, enum: ['actif', 'bloque'], default: 'actif' },
  preferredPayment: { type: String, default: 'Cash' },
  createdAt: { type: Date, default: Date.now },
  lastRideAt: { type: Date }
});

// ==========================================
// 4. Modèle Commission (Rapido Platform Setting)
// ==========================================
export interface ICommissionSetting extends Document {
  globalRate: number; // e.g. 10 (%)
  rateByCategory: {
    economique: number;
    confort: number;
    premium: number;
    van: number;
  };
  driverPayoutFrequency: string;
  cashCollectionMode: string;
  minBalanceToTakeRides: number;
  taxIncluded: boolean;
  updatedAt: Date;
}

const CommissionSettingSchema = new Schema<ICommissionSetting>({
  globalRate: { type: Number, default: 10, min: 0, max: 30 },
  rateByCategory: {
    economique: { type: Number, default: 10, min: 0 },
    confort: { type: Number, default: 12, min: 0 },
    premium: { type: Number, default: 15, min: 0 },
    van: { type: Number, default: 12, min: 0 }
  },
  driverPayoutFrequency: { type: String, default: 'instant' },
  cashCollectionMode: { type: String, default: 'wallet_deduction' },
  minBalanceToTakeRides: { type: Number, default: 200, min: 0 },
  taxIncluded: { type: Boolean, default: true },
  updatedAt: { type: Date, default: Date.now }
});

// ==========================================
// 5. Modèle Support Ticket (Litiges & Assistance)
// ==========================================
export interface ISupportTicket extends Document {
  ref: string;
  userType: 'passager' | 'chauffeur';
  userName: string;
  userPhone: string;
  subject: string;
  category: 'objet_perdu' | 'paiement' | 'comportement' | 'application' | 'autre';
  status: 'ouvert' | 'en_cours' | 'resolu';
  priority: 'urgente' | 'normale' | 'basse';
  rideRef?: string;
  description: string;
  adminResponse?: string;
  createdAt: Date;
  resolvedAt?: Date;
}

const SupportTicketSchema = new Schema<ISupportTicket>({
  ref: { type: String, required: true, unique: true },
  userType: { type: String, enum: ['passager', 'chauffeur'], required: true },
  userName: { type: String, required: true },
  userPhone: { type: String, required: true },
  subject: { type: String, required: true },
  category: { type: String, default: 'autre' },
  status: { type: String, enum: ['ouvert', 'en_cours', 'resolu'], default: 'ouvert' },
  priority: { type: String, enum: ['urgente', 'normale', 'basse'], default: 'normale' },
  rideRef: { type: String },
  description: { type: String, required: true },
  adminResponse: { type: String },
  createdAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date }
});

// Export des modèles Mongoose
export const DriverModel = mongoose.models.Driver || mongoose.model<IDriver>('Driver', DriverSchema);
export const RideModel = mongoose.models.Ride || mongoose.model<IRide>('Ride', RideSchema);
export const PassengerModel = mongoose.models.Passenger || mongoose.model<IPassenger>('Passenger', PassengerSchema);
export const CommissionSettingModel = mongoose.models.CommissionSetting || mongoose.model<ICommissionSetting>('CommissionSetting', CommissionSettingSchema);
export const SupportTicketModel = mongoose.models.SupportTicket || mongoose.model<ISupportTicket>('SupportTicket', SupportTicketSchema);
