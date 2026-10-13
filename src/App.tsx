import React, { useState, useEffect } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewView } from './components/OverviewView';
import { ValidationView } from './components/ValidationView';
import { TrackingView } from './components/TrackingView';
import { RidesManagementView } from './components/RidesManagementView';
import { DriversDirectoryView } from './components/DriversDirectoryView';
import { AdminLoginPage } from './components/AdminLoginPage';
import { PaymentsView } from './components/PaymentsView';
import { SettingsView } from './components/SettingsView';
import { PassengersView } from './components/PassengersView';
import { PricingView } from './components/PricingView';
import { SupportView } from './components/SupportView';
import type {
  Driver,
  Ride,
  LiveVehicle,
  SurgeZone,
  PlatformOverview,
  HourlyData,
  DailyRevenueData,
  NotificationItem,
  AdminUser,
  PaymentMethodConfig,
  CommissionSettings,
  Passenger,
  PricingSettings,
  SupportTicket
} from './types';

const getStoredAdminToken = () => {
  try {
    return localStorage.getItem('rapido_admin_token') || sessionStorage.getItem('rapido_admin_token');
  } catch {
    return null;
  }
};

const defaultAdmin: AdminUser = {
  id: 'admin-01',
  name: 'Directeur Général',
  email: 'admin@rapido.mr',
  role: 'super_admin',
  phone: '+222 46 55 43 21'
};

type AuthStatus = 'checking' | 'unauthenticated' | 'authenticated';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [lang, setLang] = useState<'FR' | 'AR'>('FR');
  const [authToken, setAuthToken] = useState<string | null>(() => getStoredAdminToken() || 'demo-token');
  const [authStatus, setAuthStatus] = useState<AuthStatus>('authenticated');
  const [adminUser, setAdminUser] = useState<AdminUser | null>(defaultAdmin);

  // Payment methods state (par défaut, seul Cash est actif comme demandé)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodConfig[]>([
    {
      id: 'cash',
      name: 'Espèces (Cash MRU)',
      nameAr: 'نقدًا (Cash)',
      type: 'cash',
      provider: 'Règlement direct à bord',
      color: '#10B981',
      enabled: true, // Seul actif actuellement !
      isDefault: true,
      partnershipStatus: 'active',
      description: 'Paiement en liquide remis au chauffeur.',
      descriptionAr: 'الدفع نقدًا مباشرة للسائق.'
    },
    {
      id: 'bankily',
      name: 'Bankily (BPM)',
      nameAr: 'بنكيلي (Bankily)',
      type: 'bank_app',
      provider: 'Banque Populaire de Mauritanie',
      color: '#2563EB',
      enabled: false,
      partnershipStatus: 'en_negociation',
      merchantCode: 'RAPIDO-BPM-2026',
      description: 'Paiement instantané via l\'application Bankily.',
      descriptionAr: 'الدفع الفوري عبر تطبيق بنكيلي للهواتف الذكية.'
    },
    {
      id: 'masrvi',
      name: 'Masrvi (BIM)',
      nameAr: 'مصرفي (Masrvi)',
      type: 'bank_app',
      provider: 'Banque Islamique de Mauritanie',
      color: '#059669',
      enabled: false,
      partnershipStatus: 'en_negociation',
      merchantCode: 'RAPIDO-BIM-99',
      description: 'Paiement par portefeuille Masrvi de la BIM.',
      descriptionAr: 'الدفع عبر المحفظة الرقمية مصرفي من بنك المعاملات الإسلامية.'
    }
  ]);

  // Commission platform settings
  const [commissionSettings, setCommissionSettings] = useState<CommissionSettings>({
    globalRate: 10,
    rateByCategory: {
      economique: 10,
      confort: 12,
      premium: 15,
      van: 12,
    },
    driverPayoutFrequency: 'instant',
    cashCollectionMode: 'wallet_deduction',
    minBalanceToTakeRides: 200,
    taxIncluded: true
  });

  // Passengers State
  const [passengers, setPassengers] = useState<Passenger[]>([
    {
      id: 'pass-01',
      name: 'Aissata Kane',
      phone: '+222 46 12 34 56',
      rating: 4.9,
      totalRides: 38,
      spentMru: 6840,
      status: 'actif',
      joinedDate: '12/01/2026',
      lastRideDate: 'Aujourd\'hui 09:15',
      preferredPayment: 'Cash',
    },
    {
      id: 'pass-02',
      name: 'Ahmed Salem Ould Bilal',
      phone: '+222 36 98 74 12',
      rating: 4.7,
      totalRides: 24,
      spentMru: 4320,
      status: 'actif',
      joinedDate: '28/01/2026',
      lastRideDate: 'Hier 18:40',
      preferredPayment: 'Cash',
    },
    {
      id: 'pass-03',
      name: 'Mariam Diop',
      phone: '+222 22 45 67 89',
      rating: 5.0,
      totalRides: 52,
      spentMru: 11200,
      status: 'actif',
      joinedDate: '05/01/2026',
      lastRideDate: 'Aujourd\'hui 11:20',
      preferredPayment: 'Cash',
    },
    {
      id: 'pass-04',
      name: 'Sidi Mohamed Lemine',
      phone: '+222 44 33 22 11',
      rating: 3.8,
      totalRides: 9,
      spentMru: 1620,
      status: 'bloque',
      joinedDate: '15/02/2026',
      lastRideDate: 'Il y a 3 jours',
      preferredPayment: 'Cash',
    },
    {
      id: 'pass-05',
      name: 'Fatimetou Mint Mokhtar',
      phone: '+222 49 88 77 66',
      rating: 4.8,
      totalRides: 31,
      spentMru: 5580,
      status: 'actif',
      joinedDate: '10/02/2026',
      lastRideDate: 'Hier 21:05',
      preferredPayment: 'Cash',
    },
  ]);

  // Pricing State
  const [pricingSettings, setPricingSettings] = useState<PricingSettings>({
    rules: {
      economique: {
        baseFareMru: 40,
        pricePerKmMru: 12,
        pricePerMinMru: 2,
        minFareMru: 70,
        cancellationFeeMru: 30,
      },
      confort: {
        baseFareMru: 60,
        pricePerKmMru: 16,
        pricePerMinMru: 3,
        minFareMru: 100,
        cancellationFeeMru: 40,
      },
      premium: {
        baseFareMru: 100,
        pricePerKmMru: 24,
        pricePerMinMru: 5,
        minFareMru: 180,
        cancellationFeeMru: 60,
      },
      van: {
        baseFareMru: 80,
        pricePerKmMru: 20,
        pricePerMinMru: 4,
        minFareMru: 150,
        cancellationFeeMru: 50,
      },
    },
    flatRates: [
      {
        id: 'fr-01',
        from: 'Tevragh Zeina',
        to: 'Aéroport Int. Oumtounsy',
        priceMru: 450,
        category: 'Berline Confort / Premium',
      },
      {
        id: 'fr-02',
        from: 'Centre-ville / Marché Capitale',
        to: 'Plage des Pêcheurs',
        priceMru: 150,
        category: 'Économique / Confort',
      },
      {
        id: 'fr-03',
        from: 'Ksar / Carrefour Sabah',
        to: 'Université de Nouakchott',
        priceMru: 120,
        category: 'Toutes catégories',
      },
    ],
    nightMultiplier: 1.2,
    peakHourMultiplier: 1.3,
  });

  // Support Tickets State
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([
    {
      id: 'tick-01',
      ref: 'TICK-481',
      userType: 'passager',
      userName: 'Khadijetou Bâ',
      userPhone: '+222 49 11 00 77',
      subject: 'Objet oublié dans le véhicule',
      category: 'objet_perdu',
      status: 'ouvert',
      priority: 'urgente',
      createdAt: 'Aujourd\'hui 10:15',
      description: 'J\'ai oublié un sac contenant des documents dans la Toyota Corolla blanche lors de ma course ce matin.',
      rideRef: '#R-48205',
    },
    {
      id: 'tick-02',
      ref: 'TICK-478',
      userType: 'chauffeur',
      userName: 'Amadou Ould Cheikh',
      userPhone: '+222 46 55 43 21',
      subject: 'Contestation détour zone éloignée',
      category: 'paiement',
      status: 'ouvert',
      priority: 'normale',
      createdAt: 'Aujourd\'hui 08:30',
      description: 'Le passager a demandé un détour prolongé par Dar Naim sans ajustement de tarif.',
      rideRef: '#R-48199',
    },
    {
      id: 'tick-03',
      ref: 'TICK-465',
      userType: 'passager',
      userName: 'Ahmed Salem',
      userPhone: '+222 36 98 74 12',
      subject: 'Service Confort très apprécié',
      category: 'autre',
      status: 'resolu',
      priority: 'basse',
      createdAt: 'Hier 19:00',
      description: 'Remerciements pour la ponctualité et la climatisation impeccable vers l\'Aéroport.',
      adminResponse: 'Merci pour votre confiance, le chauffeur a reçu une prime de satisfaction.',
    },
  ]);

  // Notifications state
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      type: 'sos',
      title: 'Alerte SOS en direct',
      message: 'Course #R-48207 - Déclenchée par Khadija M. à Tevragh Zeina Nord.',
      timeAgo: 'Il y a 2 min',
      read: false,
      linkTab: 'tracking',
    },
    {
      id: 'notif-2',
      type: 'driver',
      title: 'Nouveau dossier chauffeur soumis',
      message: 'Amadou Ould Cheikh a envoyé ses 8 pièces justificatives (Toyota Corolla).',
      timeAgo: 'Il y a 2 h',
      read: false,
      linkTab: 'validation',
    },
    {
      id: 'notif-3',
      type: 'peak',
      title: 'Pic de demande détecté',
      message: '126 courses / heure enregistrées à 18h (zone Tevragh Zeina ×1.4).',
      timeAgo: 'Il y a 3 h',
      read: true,
      linkTab: 'overview',
    },
    {
      id: 'notif-4',
      type: 'finance',
      title: 'Volume journalier atteint',
      message: 'Le volume d\'affaires dépasse 1,54 M MRU avec 154 k MRU de commissions.',
      timeAgo: 'Hier',
      read: true,
      linkTab: 'overview',
    },
  ]);

  // Overview Data
  const [overview, setOverview] = useState<PlatformOverview>({
    ridesToday: 1284,
    ridesChangeVsLastWeek: '+8,2 %',
    volumeMru: '1,54 M',
    volumeChange: '+11,4 %',
    commissionsMru: '154 k',
    commissionsRate: '10 %',
    driversOnline: 212,
    driversActiveTotal: 640,
    driversChangeHour: 18,
    cancellationRate: '4,6 %',
    cancellationChange: '-0,8 pt',
    avgWaitTime: '3 min 40 s',
    unassignedRequests: 6,
  });

  const [hourlyData, setHourlyData] = useState<HourlyData[]>([
    { hour: '00h', rides: 12 },
    { hour: '01h', rides: 22 },
    { hour: '02h', rides: 14 },
    { hour: '03h', rides: 10 },
    { hour: '04h', rides: 6 },
    { hour: '05h', rides: 12 },
    { hour: '06h', rides: 28 },
    { hour: '07h', rides: 62 },
    { hour: '08h', rides: 98 },
    { hour: '09h', rides: 84 },
    { hour: '10h', rides: 78 },
    { hour: '11h', rides: 89 },
    { hour: '12h', rides: 110 },
    { hour: '13h', rides: 92 },
    { hour: '14h', rides: 86 },
    { hour: '15h', rides: 74 },
    { hour: '16h', rides: 91 },
    { hour: '17h', rides: 112 },
    { hour: '18h', rides: 126, isPeak: true },
    { hour: '19h', rides: 118 },
    { hour: '20h', rides: 92 },
    { hour: '21h', rides: 74 },
    { hour: '22h', rides: 56 },
    { hour: '23h', rides: 42 },
  ]);

  const [revenue14Days, setRevenue14Days] = useState<DailyRevenueData[]>([
    { date: '25/09', valueM: 1.15 },
    { date: '26/09', valueM: 1.22 },
    { date: '27/09', valueM: 1.10 },
    { date: '28/09', valueM: 1.32 },
    { date: '29/09', valueM: 1.38 },
    { date: '30/09', valueM: 1.48 },
    { date: '01/10', valueM: 1.44 },
    { date: '02/10', valueM: 1.26 },
    { date: '03/10', valueM: 1.34 },
    { date: '04/10', valueM: 1.39 },
    { date: '05/10', valueM: 1.46 },
    { date: '06/10', valueM: 1.50 },
    { date: '07/10', valueM: 1.52 },
    { date: 'Auj.', valueM: 1.54 },
  ]);

  // Drivers Data
  const [drivers, setDrivers] = useState<Driver[]>([
    {
      id: 'ch-01',
      dossierNumber: 'CH-26-0481',
      nameFr: 'Amadou Ould Cheikh',
      nameAr: 'أمادو ولد الشيخ',
      phone: '+222 46 55 43 21',
      otpVerified: true,
      submittedAt: '09:32',
      submittedTimeAgo: 'Il y a 2 h',
      nni: '0428163957',
      nniVerified: true,
      immatriculation: '4821 AB 00',
      immatriculationVerified: true,
      vehicle: 'Toyota Corolla',
      year: 2019,
      color: 'Blanc',
      category: 'Confort',
      hasClim: true,
      status: 'en_attente',
      documentsVerifiedCount: 6,
      totalDocuments: 8,
      documents: [
        { id: 'doc-1', type: 'photo_profil', title: 'Photo de profil', subtitle: 'Visage visible', status: 'conforme' },
        { id: 'doc-2', type: 'cni_recto', title: 'CNI · recto', subtitle: 'Expire 11/2031', status: 'conforme' },
        { id: 'doc-3', type: 'cni_verso', title: 'CNI · verso', subtitle: 'Ajouté à 09:30', status: 'a_verifier' },
        { id: 'doc-4', type: 'permis', title: 'Permis de conduire', subtitle: 'Cat. B · exp. 03/2030', status: 'conforme' },
        { id: 'doc-5', type: 'vignette', title: 'Vignette 2026', subtitle: 'Payée 02/2026', status: 'illisible' },
        { id: 'doc-6', type: 'carte_grise', title: 'Carte grise', subtitle: 'Au nom du titulaire', status: 'conforme' },
        { id: 'doc-7', type: 'assurance', title: 'Assurance', subtitle: 'Valide jusqu\'au 12/2027', status: 'conforme' },
        { id: 'doc-8', type: 'visite_technique', title: 'Visite technique', subtitle: 'Valide jusqu\'au 06/2027', status: 'a_verifier' },
      ],
    },
    {
      id: 'ch-02',
      dossierNumber: 'CH-26-0482',
      nameFr: 'Mohamed Diallo',
      nameAr: 'محمد ديالو',
      phone: '+222 36 21 98 44',
      otpVerified: true,
      submittedAt: '06:15',
      submittedTimeAgo: 'Il y a 5 h',
      nni: '0719348120',
      nniVerified: true,
      immatriculation: '1907 AC 00',
      immatriculationVerified: true,
      vehicle: 'Hyundai Accent',
      year: 2021,
      color: 'Gris métallisé',
      category: 'Économique',
      hasClim: true,
      status: 'en_attente',
      documentsVerifiedCount: 7,
      totalDocuments: 8,
      documents: [
        { id: 'doc-1', type: 'photo_profil', title: 'Photo de profil', subtitle: 'Visage conforme', status: 'conforme' },
        { id: 'doc-2', type: 'cni_recto', title: 'CNI · recto', subtitle: 'Expire 05/2032', status: 'conforme' },
        { id: 'doc-3', type: 'cni_verso', title: 'CNI · verso', subtitle: 'Vérifié', status: 'conforme' },
        { id: 'doc-4', type: 'permis', title: 'Permis de conduire', subtitle: 'Cat. B · exp. 08/2029', status: 'conforme' },
        { id: 'doc-5', type: 'vignette', title: 'Vignette 2026', subtitle: 'Payée', status: 'conforme' },
        { id: 'doc-6', type: 'carte_grise', title: 'Carte grise', subtitle: 'Conforme', status: 'conforme' },
        { id: 'doc-7', type: 'assurance', title: 'Assurance', subtitle: 'Valide jusqu\'au 09/2027', status: 'conforme' },
        { id: 'doc-8', type: 'visite_technique', title: 'Visite technique', subtitle: 'Scan flou à vérifier', status: 'a_verifier' },
      ],
    },
    {
      id: 'ch-03',
      dossierNumber: 'CH-26-0479',
      nameFr: 'Sidi El Moctar',
      nameAr: 'سيدي المختار',
      phone: '+222 22 88 14 02',
      otpVerified: true,
      submittedAt: 'Hier 22:40',
      submittedTimeAgo: 'Il y a 9 h',
      nni: '0184920485',
      nniVerified: false,
      immatriculation: '3355 AA 00',
      immatriculationVerified: true,
      vehicle: 'Kia Rio',
      year: 2018,
      color: 'Noir',
      category: 'Économique',
      hasClim: false,
      status: 'documents_manquants',
      documentsVerifiedCount: 4,
      totalDocuments: 8,
      documents: [
        { id: 'doc-1', type: 'photo_profil', title: 'Photo de profil', subtitle: 'À revoir (lunettes de soleil)', status: 'illisible' },
        { id: 'doc-2', type: 'cni_recto', title: 'CNI · recto', subtitle: 'Conforme', status: 'conforme' },
        { id: 'doc-3', type: 'cni_verso', title: 'CNI · verso', subtitle: 'Non soumis', status: 'manquant' },
        { id: 'doc-4', type: 'permis', title: 'Permis de conduire', subtitle: 'Cat. B', status: 'conforme' },
        { id: 'doc-5', type: 'vignette', title: 'Vignette 2026', subtitle: 'Non soumise', status: 'manquant' },
        { id: 'doc-6', type: 'carte_grise', title: 'Carte grise', subtitle: 'Au nom du frère (procuration requise)', status: 'a_verifier' },
        { id: 'doc-7', type: 'assurance', title: 'Assurance', subtitle: 'Conforme', status: 'conforme' },
        { id: 'doc-8', type: 'visite_technique', title: 'Visite technique', subtitle: 'Valide', status: 'conforme' },
      ],
    },
    {
      id: 'ch-04',
      dossierNumber: 'CH-26-0475',
      nameFr: 'Khadijetou Bâ',
      nameAr: 'خديجة با',
      phone: '+222 49 11 00 77',
      otpVerified: true,
      submittedAt: 'Hier 11:10',
      submittedTimeAgo: 'Il y a 21 h',
      nni: '0938472910',
      nniVerified: true,
      immatriculation: '7120 AB 00',
      immatriculationVerified: true,
      vehicle: 'Toyota Yaris',
      year: 2020,
      color: 'Bleu nuit',
      category: 'Économique',
      hasClim: true,
      status: 'en_attente',
      documentsVerifiedCount: 8,
      totalDocuments: 8,
      documents: [
        { id: 'doc-1', type: 'photo_profil', title: 'Photo de profil', subtitle: 'Renvoyée & nette', status: 'conforme' },
        { id: 'doc-2', type: 'cni_recto', title: 'CNI · recto', subtitle: 'Expire 08/2030', status: 'conforme' },
        { id: 'doc-3', type: 'cni_verso', title: 'CNI · verso', subtitle: 'Vérifié', status: 'conforme' },
        { id: 'doc-4', type: 'permis', title: 'Permis de conduire', subtitle: 'Cat. B valide', status: 'conforme' },
        { id: 'doc-5', type: 'vignette', title: 'Vignette 2026', subtitle: 'Payée', status: 'conforme' },
        { id: 'doc-6', type: 'carte_grise', title: 'Carte grise', subtitle: 'Conforme', status: 'conforme' },
        { id: 'doc-7', type: 'assurance', title: 'Assurance', subtitle: 'Valide 2027', status: 'conforme' },
        { id: 'doc-8', type: 'visite_technique', title: 'Visite technique', subtitle: 'Valide', status: 'conforme' },
      ],
    },
    {
      id: 'ch-05',
      dossierNumber: 'CH-26-0470',
      nameFr: 'Yacoub Sow',
      nameAr: 'يعقوب صو',
      phone: '+222 33 44 55 66',
      otpVerified: true,
      submittedAt: 'Hier 01:20',
      submittedTimeAgo: 'Il y a 31 h',
      nni: '0592817293',
      nniVerified: true,
      immatriculation: '5502 AC 00',
      immatriculationVerified: true,
      vehicle: 'Peugeot 301',
      year: 2017,
      color: 'Argent',
      category: 'Économique',
      hasClim: true,
      status: 'en_attente',
      documentsVerifiedCount: 7,
      totalDocuments: 8,
      documents: [
        { id: 'doc-1', type: 'photo_profil', title: 'Photo de profil', subtitle: 'Conforme', status: 'conforme' },
        { id: 'doc-2', type: 'cni_recto', title: 'CNI · recto', subtitle: 'Conforme', status: 'conforme' },
        { id: 'doc-3', type: 'cni_verso', title: 'CNI · verso', subtitle: 'Conforme', status: 'conforme' },
        { id: 'doc-4', type: 'permis', title: 'Permis de conduire', subtitle: 'Conforme', status: 'conforme' },
        { id: 'doc-5', type: 'vignette', title: 'Vignette 2026', subtitle: 'Conforme', status: 'conforme' },
        { id: 'doc-6', type: 'carte_grise', title: 'Carte grise', subtitle: 'Conforme', status: 'conforme' },
        { id: 'doc-7', type: 'assurance', title: 'Assurance', subtitle: 'Valide', status: 'conforme' },
        { id: 'doc-8', type: 'visite_technique', title: 'Visite technique', subtitle: 'À valider par inspecteur', status: 'a_verifier' },
      ],
    },
    {
      id: 'ch-06',
      dossierNumber: 'CH-26-0466',
      nameFr: 'El Hacen Mahmoud',
      nameAr: 'الحسن محمود',
      phone: '+222 26 77 88 99',
      otpVerified: true,
      submittedAt: '07/10 14:00',
      submittedTimeAgo: 'Il y a 1 j',
      nni: '0382910482',
      nniVerified: true,
      immatriculation: '2288 AA 00',
      immatriculationVerified: true,
      vehicle: 'Mercedes C200',
      year: 2018,
      color: 'Noir',
      category: 'Premium',
      hasClim: true,
      status: 'en_attente',
      documentsVerifiedCount: 8,
      totalDocuments: 8,
      documents: [
        { id: 'doc-1', type: 'photo_profil', title: 'Photo de profil', subtitle: 'Conforme', status: 'conforme' },
        { id: 'doc-2', type: 'cni_recto', title: 'CNI · recto', subtitle: 'Conforme', status: 'conforme' },
        { id: 'doc-3', type: 'cni_verso', title: 'CNI · verso', subtitle: 'Conforme', status: 'conforme' },
        { id: 'doc-4', type: 'permis', title: 'Permis de conduire', subtitle: 'Conforme', status: 'conforme' },
        { id: 'doc-5', type: 'vignette', title: 'Vignette 2026', subtitle: 'Conforme', status: 'conforme' },
        { id: 'doc-6', type: 'carte_grise', title: 'Carte grise', subtitle: 'Conforme', status: 'conforme' },
        { id: 'doc-7', type: 'assurance', title: 'Assurance', subtitle: 'Conforme', status: 'conforme' },
        { id: 'doc-8', type: 'visite_technique', title: 'Visite technique', subtitle: 'Conforme', status: 'conforme' },
      ],
    },
  ]);

  // Rides Data
  const [rides, setRides] = useState<Ride[]>([
    {
      id: 'ride-01',
      ref: '#R-48213',
      passengerName: 'Mariem S.',
      passengerPhone: '+222 44 12 34 56',
      driverName: 'Amadou O.C.',
      driverPhone: '+222 46 55 43 21',
      from: 'Tevragh Zeina (Ambassade USA)',
      to: 'Marché Capitale (Nouakchott)',
      category: 'Confort',
      amountMru: 1200,
      paymentMethod: 'Bankily',
      status: 'En cours',
      time: 'Il y a 4 min',
      distanceKm: 6.4,
      durationMin: 14,
      commissionMru: 120,
    },
    {
      id: 'ride-02',
      ref: '#R-48212',
      passengerName: 'Cheikh B.',
      passengerPhone: '+222 22 99 88 77',
      driverName: 'Moussa D.',
      driverPhone: '+222 36 21 98 44',
      from: 'Aéroport Oumtounsy',
      to: 'Hôtel Mauricenter (Tevragh)',
      category: 'Premium',
      amountMru: 2400,
      paymentMethod: 'Masrvi',
      status: 'Terminée',
      time: 'Il y a 18 min',
      distanceKm: 18.2,
      durationMin: 28,
      commissionMru: 240,
    },
    {
      id: 'ride-03',
      ref: '#R-48209',
      passengerName: 'Fatimetou M.',
      passengerPhone: '+222 41 55 66 77',
      driverName: null,
      from: 'Carrefour Madrid (Arafat)',
      to: 'Centre Hospitalier National',
      category: 'Économique',
      amountMru: 800,
      paymentMethod: 'Cash',
      status: 'En recherche',
      time: 'Il y a 2 min',
      distanceKm: 4.1,
      durationMin: 12,
      commissionMru: 80,
    },
    {
      id: 'ride-04',
      ref: '#R-48207',
      passengerName: 'Khadija M.',
      passengerPhone: '+222 37 88 99 00',
      driverName: 'Zeidane B.',
      driverPhone: '+222 26 77 88 99',
      from: 'Tevragh Zeina Nord',
      to: 'Carrefour BMD (Ksar)',
      category: 'Confort',
      amountMru: 1400,
      paymentMethod: 'Bankily',
      status: 'En cours',
      time: 'Il y a 7 min',
      distanceKm: 5.8,
      durationMin: 16,
      hasSosAlert: true,
      sosReason: 'Choc léger signalé à Carrefour Sabah',
      commissionMru: 140,
    },
    {
      id: 'ride-05',
      ref: '#R-48201',
      passengerName: 'Ahmed Salem',
      passengerPhone: '+222 49 00 11 22',
      driverName: 'Yacoub Sow',
      driverPhone: '+222 33 44 55 66',
      from: 'Université Nouakchott Al Aasriya',
      to: 'Sebkha Cinquième',
      category: 'Économique',
      amountMru: 900,
      paymentMethod: 'Cash',
      status: 'Terminée',
      time: 'Il y a 45 min',
      distanceKm: 7.2,
      durationMin: 19,
      commissionMru: 90,
    },
    {
      id: 'ride-06',
      ref: '#R-48195',
      passengerName: 'Bilal Ould Amar',
      passengerPhone: '+222 27 33 44 55',
      driverName: 'Sidi El Moctar',
      driverPhone: '+222 22 88 14 02',
      from: 'Port de l\'Amitié (PANPA)',
      to: 'Teyarett',
      category: 'Van / Famille',
      amountMru: 2800,
      paymentMethod: 'Bankily',
      status: 'Terminée',
      time: 'Il y a 1 h',
      distanceKm: 14.5,
      durationMin: 32,
      commissionMru: 280,
    },
    {
      id: 'ride-07',
      ref: '#R-48189',
      passengerName: 'Zeinabou Diop',
      passengerPhone: '+222 32 44 55 66',
      driverName: null,
      from: 'Dar Naim',
      to: 'Marché Capitale',
      category: 'Économique',
      amountMru: 850,
      paymentMethod: 'Cash',
      status: 'Annulée',
      time: 'Il y a 1 h 20',
      distanceKm: 6.0,
      durationMin: 15,
      commissionMru: 0,
    },
  ]);

  // Live vehicles for Tracking map
  const [vehicles, setVehicles] = useState<LiveVehicle[]>([
    {
      id: 'v-01',
      initials: 'AO',
      driverName: 'Amadou O.C.',
      plate: '4821 AB 00',
      status: 'En course',
      rating: 4.86,
      currentZone: 'Tevragh Zeina',
      destination: 'Marché Capitale',
      etaMinutes: 8,
      x: 38,
      y: 42,
    },
    {
      id: 'v-02',
      initials: 'MD',
      driverName: 'Mohamed D.',
      plate: '1907 AC 00',
      status: 'Disponible',
      rating: 4.91,
      currentZone: 'Ksar',
      x: 45,
      y: 50,
    },
    {
      id: 'v-03',
      initials: 'KB',
      driverName: 'Khadijetou B.',
      plate: '7120 AB 00',
      status: 'Disponible',
      rating: 4.78,
      currentZone: 'Tevragh Zeina',
      x: 32,
      y: 35,
    },
    {
      id: 'v-04',
      initials: 'BE',
      driverName: 'Brahim E.',
      plate: '6631 AB 00',
      status: 'En approche',
      rating: 4.95,
      currentZone: 'Arafat',
      destination: 'Passager à 3 min',
      etaMinutes: 3,
      x: 52,
      y: 72,
    },
    {
      id: 'v-05',
      initials: 'OK',
      driverName: 'Oumar K.',
      plate: '2014 AA 00',
      status: 'Disponible',
      rating: 4.70,
      currentZone: 'Sebkha',
      x: 28,
      y: 65,
    },
    {
      id: 'v-06',
      initials: 'HM',
      driverName: 'Hawa M.',
      plate: '8843 AC 00',
      status: 'En course',
      rating: 4.89,
      currentZone: 'Teyarett',
      destination: 'Tevragh Zeina',
      etaMinutes: 11,
      x: 65,
      y: 40,
    },
    {
      id: 'v-07',
      initials: 'ZB',
      driverName: 'Zeidane B. (SOS)',
      plate: '3109 AB 00',
      status: 'En course',
      rating: 4.62,
      currentZone: 'Tevragh Zeina',
      destination: 'Carrefour BMD',
      x: 46,
      y: 58,
    },
    {
      id: 'v-08',
      initials: 'SB',
      driverName: 'Sidi Baba',
      plate: '8491 AA 00',
      status: 'Disponible',
      rating: 4.88,
      currentZone: 'El Mina',
      x: 22,
      y: 78,
    },
    {
      id: 'v-09',
      initials: 'MN',
      driverName: 'Med Lemine',
      plate: '7721 AC 00',
      status: 'Disponible',
      rating: 4.93,
      currentZone: 'Dar Naim',
      x: 78,
      y: 60,
    },
    {
      id: 'v-10',
      initials: 'CH',
      driverName: 'Cheikhna H.',
      plate: '1102 AB 00',
      status: 'Disponible',
      rating: 4.81,
      currentZone: 'Tevragh Zeina',
      x: 42,
      y: 44,
    },
  ]);

  // Surge demand zones
  const [surgeZones, setSurgeZones] = useState<SurgeZone[]>([
    { name: 'Tevragh Zeina', multiplier: 1.4, ridesDemand: 42, activeCars: 28 },
    { name: 'Marché Capitale', multiplier: 1.3, ridesDemand: 38, activeCars: 22 },
    { name: 'Aéroport Oumtounsy', multiplier: 1.2, ridesDemand: 19, activeCars: 14 },
    { name: 'Carrefour BMD / Ksar', multiplier: 1.1, ridesDemand: 24, activeCars: 20 },
  ]);

  // Restore only sessions that the server confirms; otherwise start at login.
  useEffect(() => {
    let isCurrent = true;
    const clearStoredToken = () => {
      localStorage.removeItem('rapido_admin_token');
      sessionStorage.removeItem('rapido_admin_token');
    };

    if (!authToken) {
      setAuthStatus('unauthenticated');
      return;
    }

    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then(async (response) => response.ok ? response.json() : { authenticated: false })
      .then((data) => {
        if (!isCurrent) return;
        if (data.authenticated && data.user) {
          setAdminUser(data.user);
          setAuthStatus('authenticated');
        } else {
          clearStoredToken();
          setAuthToken(null);
          setAdminUser(null);
          setAuthStatus('unauthenticated');
        }
      })
      .catch(() => {
        if (!isCurrent) return;
        clearStoredToken();
        setAuthToken(null);
        setAdminUser(null);
        setAuthStatus('unauthenticated');
      });

    return () => { isCurrent = false; };
  }, []);

  // Load private dashboard notifications only after restoring a verified session.
  useEffect(() => {
    if (authStatus !== 'authenticated' || !authToken) return;

    fetch('/api/notifications', {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.notifications) setNotifications(data.notifications);
      })
      .catch(() => {});
  }, [authStatus, authToken]);

  // Handlers for driver approval/rejection
  const handleApproveDriver = async (driverId: string) => {
    try {
      await fetch(`/api/drivers/${driverId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approuve' }),
      });
    } catch (e) {}

    setDrivers((prev) =>
      prev.map((d) => (d.id === driverId ? { ...d, status: 'approuve' } : d))
    );
  };

  const handleRejectDriver = async (driverId: string, reason?: string) => {
    try {
      await fetch(`/api/drivers/${driverId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejete', note: reason }),
      });
    } catch (e) {}

    setDrivers((prev) =>
      prev.map((d) => (d.id === driverId ? { ...d, status: 'rejete', decisionNote: reason } : d))
    );
  };

  const handleRequestDocs = async (driverId: string, note?: string) => {
    try {
      await fetch(`/api/drivers/${driverId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'documents_manquants', note }),
      });
    } catch (e) {}

    setDrivers((prev) =>
      prev.map((d) => (d.id === driverId ? { ...d, status: 'documents_manquants', decisionNote: note } : d))
    );
  };

  const handleUpdateDocumentStatus = async (
    driverId: string,
    docId: string,
    status: 'conforme' | 'a_verifier' | 'illisible'
  ) => {
    try {
      await fetch(`/api/drivers/${driverId}/documents/${docId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch (e) {}

    setDrivers((prev) =>
      prev.map((driver) => {
        if (driver.id !== driverId) return driver;
        const updatedDocs = driver.documents.map((doc) =>
          doc.id === docId ? { ...doc, status } : doc
        );
        const verifiedCount = updatedDocs.filter((d) => d.status === 'conforme').length;
        return {
          ...driver,
          documents: updatedDocs,
          documentsVerifiedCount: verifiedCount,
        };
      })
    );
  };

  // SOS Resolution
  const handleResolveSos = async () => {
    try {
      await fetch('/api/tracking/sos/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rideRef: '#R-48207' }),
      });
    } catch (e) {}

    setRides((prev) => prev.map((r) => ({ ...r, hasSosAlert: false })));
  };

  // Notifications handlers
  const handleMarkAllNotifsRead = async () => {
    try {
      await fetch('/api/notifications/mark-all-read', { method: 'POST' });
    } catch (e) {}
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = async (notif: NotificationItem) => {
    try {
      await fetch(`/api/notifications/${notif.id}/read`, { method: 'PATCH' });
    } catch (e) {}

    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );

    if (notif.linkTab) {
      setCurrentTab(notif.linkTab as NavTab);
    }
  };

  // Revoke the server token and switch to the login screen immediately.
  const handleLogout = async () => {
    const tokenToRevoke = authToken;
    localStorage.removeItem('rapido_admin_token');
    sessionStorage.removeItem('rapido_admin_token');
    setAuthToken(null);
    setAdminUser(null);
    setAuthStatus('unauthenticated');
    setCurrentTab('overview');

    if (!tokenToRevoke) return;
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${tokenToRevoke}` },
      });
    } catch {
      // Client-side access is still cleared if the server cannot be reached.
    }
  };

  // Called only after the server accepts the 2FA code.
  const handleAuthSuccess = (user: AdminUser, token: string, rememberMe: boolean) => {
    localStorage.removeItem('rapido_admin_token');
    sessionStorage.removeItem('rapido_admin_token');
    (rememberMe ? localStorage : sessionStorage).setItem('rapido_admin_token', token);
    setAdminUser(user);
    setAuthToken(token);
    setAuthStatus('authenticated');
  };

  const pendingValidationCount = drivers.filter((d) => d.status === 'en_attente').length;
  const activeSosRide = rides.find((r) => r.hasSosAlert) || null;
  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  if (authStatus === 'checking') {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-auth-panel" role="status">
        <div className="ms-3 size-9 animate-spin rounded-full border-4 border-auth-orange/20 border-t-auth-orange" />
        <span className="sr-only">Vérification de la session…</span>
      </div>
    );
  }

  if (authStatus !== 'authenticated' || !adminUser) {
    return <AdminLoginPage lang={lang} onLanguageChange={setLang} onSuccess={handleAuthSuccess} />;
  }

  return (
    <div
      dir={lang === 'AR' ? 'rtl' : 'ltr'}
      className={`min-h-screen bg-[#F8FAFC] flex ${lang === 'AR' ? 'font-["Tajawal"]' : ''}`}
    >
      {/* Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        pendingValidationCount={pendingValidationCount}
        lang={lang}
        adminUser={adminUser}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          lang={lang}
          onToggleLang={() => setLang((prev) => (prev === 'FR' ? 'AR' : 'FR'))}
          hasActiveSos={!!activeSosRide}
          onOpenSos={() => setCurrentTab('tracking')}
          notifications={notifications}
          unreadNotifsCount={unreadNotifsCount}
          onMarkAllNotifsRead={handleMarkAllNotifsRead}
          onNotificationClick={handleNotificationClick}
          adminUser={adminUser}
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-y-auto">
          {/* 1. Vue d'ensemble (Dashboard - Screen 1) */}
          {currentTab === 'overview' && (
            <OverviewView
              overview={overview}
              hourly={hourlyData}
              revenue14Days={revenue14Days}
              recentRides={rides}
              pendingValidationCount={pendingValidationCount}
              onGoToValidation={() => setCurrentTab('validation')}
              onGoToRides={() => setCurrentTab('rides')}
            />
          )}

          {/* 2. Validation des dossiers chauffeurs (Screen 2) */}
          {currentTab === 'validation' && (
            <ValidationView
              drivers={drivers}
              onApproveDriver={handleApproveDriver}
              onRejectDriver={handleRejectDriver}
              onRequestDocs={handleRequestDocs}
              onUpdateDocumentStatus={handleUpdateDocumentStatus}
            />
          )}

          {/* 3. Gestion des courses (Rides Table) - DÉDIÉE aux courses */}
          {currentTab === 'rides' && (
            <RidesManagementView
              rides={rides}
              lang={lang}
              onOpenSosRide={(sos) => {
                setCurrentTab('tracking');
              }}
            />
          )}

          {/* 4. Suivi en temps réel (Flotte & Carte Nouakchott - Screen 3) */}
          {currentTab === 'tracking' && (
            <TrackingView
              vehicles={vehicles}
              surgeZones={surgeZones}
              sosRide={activeSosRide}
              onResolveSos={handleResolveSos}
            />
          )}

          {/* 5. Annuaire des chauffeurs */}
          {currentTab === 'drivers' && <DriversDirectoryView lang={lang} />}


          {/* 6. Moyens de Paiement (Activation / Désactivation Apps bancaires & Cash) */}
          {currentTab === 'payments' && (
            <PaymentsView
              paymentMethods={paymentMethods}
              onUpdatePaymentMethods={setPaymentMethods}
              lang={lang}
            />
          )}

          {/* 7. Paramètres & Gestion de la Commission Rapido VTC */}
          {currentTab === 'settings' && (
            <SettingsView
              settings={commissionSettings}
              onUpdateSettings={setCommissionSettings}
              onNavigateToPayments={() => setCurrentTab('payments')}
              onLogout={handleLogout}
              lang={lang}
            />
          )}

          {/* 8. Passagers (Répertoire des clients) */}
          {currentTab === 'passengers' && (
            <PassengersView
              passengers={passengers}
              onTogglePassengerStatus={(id) => {
                setPassengers((prev) =>
                  prev.map((p) =>
                    p.id === id ? { ...p, status: p.status === 'actif' ? 'bloque' : 'actif' } : p
                  )
                );
              }}
              lang={lang}
            />
          )}

          {/* 9. Tarification & Forfaits Fixes */}
          {currentTab === 'pricing' && (
            <PricingView
              pricing={pricingSettings}
              onUpdatePricing={setPricingSettings}
              lang={lang}
            />
          )}

          {/* 10. Support & Réclamations */}
          {currentTab === 'support' && (
            <SupportView
              tickets={supportTickets}
              onResolveTicket={(id, response) => {
                setSupportTickets((prev) =>
                  prev.map((t) =>
                    t.id === id ? { ...t, status: 'resolu', adminResponse: response } : t
                  )
                );
              }}
              lang={lang}
            />
          )}
        </main>
      </div>


    </div>
  );
}
