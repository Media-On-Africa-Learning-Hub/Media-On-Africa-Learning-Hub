import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBlgBSTYVkxhyygpeDA4A3ix_Xy2mzcdjs",
  authDomain: "data-pulse-learning-hub.firebaseapp.com",
  projectId: "data-pulse-learning-hub",
  storageBucket: "data-pulse-learning-hub.firebasestorage.app",
  messagingSenderId: "866854237457",
  appId: "1:866854237457:web:3bc31e3e1d84e841aa48b0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with offline persistence explicitly enabled
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

window.db = db;

