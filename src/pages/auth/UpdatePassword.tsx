import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Lock, AlertCircle } from "lucide-react";

export default function UpdatePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasValidToken, setHasValidToken] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const { updatePassword, session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for error in URL hash
    const hash = location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const error = params.get('error');
    const errorDescription = params.get('error_description');
    const accessToken = params.get('access_token');

    if (error) {
      setHasValidToken(false);
      if (error === 'access_denied' && params.get('error_code') === 'otp_expired') {
        setErrorMessage('קישור איפוס הסיסמה פג תוקף. אנא בקש קישור חדש.');
      } else {
        setErrorMessage(errorDescription ? decodeURIComponent(errorDescription.replace(/\+/g, ' ')) : 'הקישור אינו תקין. אנא בקש קישור חדש.');
      }
    } else if (accessToken || session) {
      // Has access token in URL or valid session
      setHasValidToken(true);
    } else {
      // No error, no token in URL, and no session - wait for session to load
      const timer = setTimeout(() => {
        if (!session) {
          setHasValidToken(false);
          setErrorMessage('לא נמצא טוקן תקף. אנא בקש קישור חדש לאיפוס סיסמה.');
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [location, session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("הסיסמאות לא תואמות");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("הסיסמה חייבת להכיל לפחות 6 תווים");
      return;
    }

    // Verify session exists before attempting password update
    if (!session) {
      toast.error("שגיאה באימות", {
        description: "לא נמצא טוקן אימות. אנא נסה לבקש קישור חדש.",
      });
      setHasValidToken(false);
      setErrorMessage('הטוקן אינו זמין. אנא בקש קישור חדש לאיפוס סיסמה.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await updatePassword(newPassword);

      if (error) {
        toast.error("שגיאה בעדכון הסיסמה", {
          description: error.message,
        });
      } else {
        toast.success("הסיסמה עודכנה בהצלחה!", {
          description: "עכשיו תוכל להתחבר עם הסיסמה החדשה",
        });
        navigate("/login");
      }
    } catch (error) {
      toast.error("שגיאה בעדכון הסיסמה");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking token
  if (hasValidToken === null) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 to-secondary/5">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-sm text-muted-foreground">בודק את תקינות הקישור...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error state if token is invalid
  if (hasValidToken === false) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 to-secondary/5">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              הקישור אינו תקף
            </CardTitle>
            <CardDescription className="text-center">
              {errorMessage}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col gap-3">
            <Button
              variant="default"
              className="w-full"
              onClick={() => navigate('/reset-password')}
            >
              בקש קישור חדש
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/login')}
            >
              חזור להתחברות
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Show password update form if token is valid
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 to-secondary/5">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            הגדר סיסמה חדשה
          </CardTitle>
          <CardDescription className="text-center">
            הזן את הסיסמה החדשה שלך
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">סיסמה חדשה</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={loading}
                dir="ltr"
                className="text-left"
                placeholder="לפחות 6 תווים"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">אימות סיסמה</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                dir="ltr"
                className="text-left"
                placeholder="הזן שוב את הסיסמה החדשה"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              עדכן סיסמה
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
