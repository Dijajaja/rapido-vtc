export type DocumentStatus = 'conforme' | 'a_verifier' | 'illisible' | 'manquant';

export interface DriverDocument {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  status: DocumentStatus;
  updatedAt?: string;
  notes?: string;
}

export type DriverStatus = 'en_attente' | 'documents_manquants' | 'approuve' | 'rejete';

export interface Driver {
  id: string;
  dossierNumber: string;
  nameFr: string;
  nameAr: string;
  phone: string;
  otpVerified: boolean;
  submittedAt: string;
  submittedTimeAgo: string;
  nni: string;
  nniVerified: boolean;
  immatriculation: string;
  immatriculationVerified: boolean;
  vehicle: string;
  year: number;
  color: string;
  category: 'Économique' | 'Confort' | 'Premium' | 'Van / Famille';
  hasClim: boolean;
  status: DriverStatus;
  documentsVerifiedCount: number;
  totalDocuments: number;
  documents: DriverDocument[];
  decisionNote?: string;
}

export type RideStatus = 'En cours' | 'Terminée' | 'En recherche' | 'En approche' | 'Annulée';

export interface Ride {
  id: string;
  ref: string;
  passengerName: string;
  passengerPhone?: string;
  driverName: string | null;
  driverPhone?: string;
  from: string;
  to: string;
  category: 'Économique' | 'Confort' | 'Premium' | 'Van / Famille';
  amountMru: number;
  paymentMethod?: 'Bankily' | 'Masrvi' | 'Cash' | 'Sadad' | 'Carte';
  status: RideStatus;
  time: string;
  distanceKm: number;
  durationMin: number;
  hasSosAlert?: boolean;
  sosReason?: string;
  commissionMru?: number;
}

export interface LiveVehicle {
  id: string;
  initials: string;
  driverName: string;
  plate: string;
  status: 'Disponible' | 'En course' | 'En approche';
  rating: number;
  currentZone: string;
  destination?: string;
  etaMinutes?: number;
  x: number; // coordinate percentage for Nouakchott map (0-100)
  y: number; // coordinate percentage for Nouakchott map (0-100)
}

export interface SurgeZone {
  name: string;
  multiplier: number;
  ridesDemand: number;
  activeCars: number;
}

export interface HourlyData {
  hour: string;
  rides: number;
  isPeak?: boolean;
}

export interface DailyRevenueData {
  date: string;
  valueM: number;
}

export interface PlatformOverview {
  ridesToday: number;
  ridesChangeVsLastWeek: string;
  volumeMru: string;
  volumeChange: string;
  commissionsMru: string;
  commissionsRate: string;
  driversOnline: number;
  driversActiveTotal: number;
  driversChangeHour: number;
  cancellationRate: string;
  cancellationChange: string;
  avgWaitTime: string;
  unassignedRequests: number;
}

export interface AdminUser {
  name: string;
  email: string;
  role: string;
  phone: string;
}

export interface NotificationItem {
  id: string;
  type: 'sos' | 'driver' | 'peak' | 'finance' | 'system';
  title: string;
  message: string;
  timeAgo: string;
  read: boolean;
  linkTab?: string;
}
