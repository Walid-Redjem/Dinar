import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    setChecking(true);
    setAllowed(false);

    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/");
        setChecking(false);
        return;
      }

      try {
        const snap = await getDoc(doc(db, "users", user.uid));

        if (!snap.exists()) {
          navigate("/signup");
          setChecking(false);
          return;
        }

        const { idUploaded, isAdmin } = snap.data();

        if (isAdmin) {
          navigate("/admin");
          setChecking(false);
          return;
        }

        const onVerify = location.pathname === "/verify-identity";

        if (!idUploaded && !onVerify) {
          navigate("/verify-identity");
          setChecking(false);
          return;
        }

        if (idUploaded && onVerify) {
          navigate("/dashboard");
          setChecking(false);
          return;
        }

        setAllowed(true);
        setChecking(false);
      } catch (err) {
        console.error("ProtectedRoute auth check failed:", err);
        setAllowed(true);
        setChecking(false);
      }
    });

    return () => unsub();
  }, [navigate, location.pathname]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!allowed) return null;

  return <>{children}</>;
}
