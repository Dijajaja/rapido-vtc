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

export interface PaymentMethodConfig {
  id: string;
  name: string;
  nameAr: string;
  type: 'cash' | 'bank_app' | 'wallet';
  provider: string;
  color: string;
  enabled: boolean;
  isDefault?: boolean;
  partnershipStatus: 'active' | 'en_negociation' | 'inactif';
  merchantCode?: string;
  description: string;
  descriptionAr: string;
}

export interface CommissionSettings {
  globalRate: number;
  rateByCategory: {
    economique: number;
    confort: number;
    premium: number;
    van: number;
  };
  driverPayoutFrequency: 'daily' | 'weekly' | 'instant';
  cashCollectionMode: 'wallet_deduction' | 'weekly_invoice';
  minBalanceToTakeRides: number;
  taxIncluded: boolean;
}

export interface Passenger {
  id: string;
  name: string;
  phone: string;
  rating: number;
  totalRides: number;
  spentMru: number;
  status: 'actif' | 'bloque';
  joinedDate: string;
  lastRideDate: string;
  preferredPayment: 'Cash' | 'Bankily' | 'Masrvi';
}

export interface PricingCategoryRule {
  baseFareMru: number;
  pricePerKmMru: number;
  pricePerMinMru: number;
  minFareMru: number;
  cancellationFeeMru: number;
}

export interface PricingSettings {
  rules: {
    economique: PricingCategoryRule;
    confort: PricingCategoryRule;
    premium: PricingCategoryRule;
    van: PricingCategoryRule;
  };
  flatRates: {
    id: string;
    from: string;
    to: string;
    priceMru: number;
    category: string;
  }[];
  nightMultiplier: number;
  peakHourMultiplier: number;
}

export interface SupportTicket {
  id: string;
  ref: string;
  userType: 'passager' | 'chauffeur';
  userName: string;
  userPhone: string;
  subject: string;
  category: 'objet_perdu' | 'paiement' | 'comportement' | 'application' | 'autre';
  status: 'ouvert' | 'en_cours' | 'resolu';
  priority: 'urgente' | 'normale' | 'basse';
  createdAt: string;
  description: string;
  rideRef?: string;
  adminResponse?: string;
}


