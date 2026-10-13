import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://rapido_admin:RapidoPassword2026!@localhost:27017/rapido_vtc?authSource=admin';

let isConnected = false;

export async function connectToMongoDB() {
  if (isConnected) return;

  try {
    // Timeout court de 3 secondes pour ne pas bloquer si Docker n'est pas encore lancé
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log('[MONGODB] Connecté avec succès à MongoDB (Docker local) !');
  } catch (error) {
    console.log('[MONGODB] Docker MongoDB non détecté localement. Fonctionnement autonome en mémoire.');
  }
}
