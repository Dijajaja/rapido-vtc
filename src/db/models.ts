import mongoose, { Schema, Document } from 'mongoose';

// 1. Schéma Chauffeur (Driver)
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
  category: 'Économique' | 'Confort' | 'Premium' | 'Van / Famille';
  hasClim: boolean;
  status: 'en_attente' | 'documents_manquants' | 'approuve' | 'rejete';
  documents: {
    id: string;
    type: string;
    title: string;
    status: 'conforme' | 'a_verifier' | 'illisible' | 'manquant';
  }[];
  createdAt: Date;
}

const DriverSchema = new Schema<IDriver>({
  dossierNumber: { type: String, required: true, unique: true },
  nameFr: { type: String, required: true },
  nameAr: { type: String },
  phone: { type: String, required: true },
  otpVerified: { type: Boolean, default: true },
  nni: { type: String, required: true },
  nniVerified: { type: Boolean, default: true },
  immatriculation: { type: String, required: true },
  vehicle: { type: String, required: true },
  category: { type: String, default: 'Économique' },
  hasClim: { type: Boolean, default: true },
  status: { type: String, enum: ['en_attente', 'documents_manquants', 'approuve', 'rejete'], default: 'en_attente' },
  documents: [{
    id: String,
    type: String,
    title: String,
    status: String,
  }],
  createdAt: { type: Date, default: Date.now }
});

// 2. Schéma Course (Ride)
export interface IRide extends Document {
  ref: string;
  passengerName: string;
  passengerPhone?: string;
  driverName?: string;
  driverPhone?: string;
  from: string;
  to: string;
  category: string;
  amountMru: number;
  commissionMru: number;
  paymentMethod: 'Cash' | 'Bankily' | 'Masrvi' | 'Sedad';
  status: 'En cours' | 'Terminée' | 'En recherche' | 'En approche' | 'Annulée';
  distanceKm: number;
  hasSosAlert: boolean;
  createdAt: Date;
}

const RideSchema = new Schema<IRide>({
  ref: { type: String, required: true, unique: true },
  passengerName: { type: String, required: true },
  passengerPhone: { type: String },
  driverName: { type: String },
  driverPhone: { type: String },
  from: { type: String, required: true },
  to: { type: String, required: true },
  category: { type: String, default: 'Économique' },
  amountMru: { type: Number, required: true, min: 0 },
  commissionMru: { type: Number, default: 0, min: 0 },
  paymentMethod: { type: String, default: 'Cash' },
  status: { type: String, default: 'Terminée' },
  distanceKm: { type: Number, default: 5 },
  hasSosAlert: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// 3. Schéma Passager (Passenger)
export interface IPassenger extends Document {
  name: string;
  phone: string;
  rating: number;
  totalRides: number;
  spentMru: number;
  status: 'actif' | 'bloque';
  preferredPayment: string;
  createdAt: Date;
}

const PassengerSchema = new Schema<IPassenger>({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  rating: { type: Number, default: 5.0, min: 0, max: 5 },
  totalRides: { type: Number, default: 0, min: 0 },
  spentMru: { type: Number, default: 0, min: 0 },
  status: { type: String, enum: ['actif', 'bloque'], default: 'actif' },
  preferredPayment: { type: String, default: 'Cash' },
  createdAt: { type: Date, default: Date.now }
});

// Export des modèles Mongoose
export const DriverModel = mongoose.models.Driver || mongoose.model<IDriver>('Driver', DriverSchema);
export const RideModel = mongoose.models.Ride || mongoose.model<IRide>('Ride', RideSchema);
export const PassengerModel = mongoose.models.Passenger || mongoose.model<IPassenger>('Passenger', PassengerSchema);
