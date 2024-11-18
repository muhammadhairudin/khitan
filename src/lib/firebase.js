import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: "AIzaSyBKEKkMNfm3bgi3Jq-2sc-qZTwL-wynJU4",
  authDomain: "khitan-6.firebaseapp.com",
  databaseURL: "https://khitan-6-default-rtdb.firebaseio.com",
  projectId: "khitan-6",
  storageBucket: "khitan-6.firebasestorage.app",
  messagingSenderId: "47799133426",
  appId: "1:47799133426:web:4192ce528580eada515c6b",
  measurementId: "G-JKL874SZS5"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Services
const db = getFirestore(app)
const storage = getStorage(app)
const analytics = getAnalytics(app)

// Export services
export { db, storage, analytics } 