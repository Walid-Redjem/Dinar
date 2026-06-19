# Dinar — How to run & deploy

## Run locally

```bash
cd dinar-react
pnpm install        # or: npm install
pnpm dev            # opens http://localhost:5173
```

## Add Firebase

1. Install Firebase SDK:
```bash
pnpm add firebase
```

2. Create `src/firebase.ts`:
```ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "dinar-8b9ca.firebaseapp.com",
  projectId: "dinar-8b9ca",
  storageBucket: "dinar-8b9ca.appspot.com",
  messagingSenderId: "696543534966",
  appId: "YOUR_APP_ID"
};

export const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
```

3. In `PhoneVerification.tsx`, replace the fake `setTimeout` with real Firebase phone auth:
```ts
import { auth } from "../../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
```

## Build & deploy to Firebase

```bash
pnpm build          # creates dist/ folder
firebase init       # select Hosting, set public dir to: dist
firebase deploy
```

Your site: https://dinar-8b9ca.web.app
