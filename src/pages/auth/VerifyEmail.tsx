import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    // אם אין מייל, חזור לדף הרשמה
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  const handleResendEmail = async () => {
    if (!email) return;

    setResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        toast.error("שגיאה בשליחת המייל", {
          description: error.message,
        });
      } else {
        setResent(true);
        toast.success("מייל האימות נשלח מחדש!", {
          description: "בדוק את תיבת הדואר שלך",
        });
      }
    } catch (error) {
      toast.error("שגיאה בשליחת המייל");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 to-secondary/5">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            בדוק את המייל שלך
          </CardTitle>
          <CardDescription className="text-center">
            שלחנו לך קישור לאימות החשבון
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <p className="text-sm text-center">
              שלחנו מייל אימות ל:
            </p>
            <p className="text-sm font-mono text-center font-semibold break-all">
              {email}
            </p>
          </div>

          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <p>לחץ על הקישור במייל כדי לאמת את החשבון שלך</p>
            </div>
            <div className="flex gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <p>אחרי האימות תוכל להתחבר למערכת</p>
            </div>
            <div className="flex gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <p>הקישור תקף ל-24 שעות</p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-center text-muted-foreground mb-3">
              לא קיבלת את המייל?
            </p>
            <ul className="text-xs text-muted-foreground space-y-1 mb-4">
              <li>• בדוק בתיקיית הספאם</li>
              <li>• ודא שהכתובת נכונה: {email}</li>
              <li>• המתן מספר דקות ונסה שוב</li>
            </ul>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleResendEmail}
              disabled={resending || resent}
            >
              {resending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              {resent ? "נשלח מחדש ✓" : "שלח מייל אימות מחדש"}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Link to="/login" className="w-full">
            <Button variant="ghost" className="w-full">
              חזור להתחברות
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
