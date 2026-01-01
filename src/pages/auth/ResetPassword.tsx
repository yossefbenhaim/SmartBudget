import { useState } from "react";
import { Link } from "react-router-dom";
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
import { Loader2, ArrowRight } from "lucide-react";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await resetPassword(email);

      if (error) {
        toast.error("שגיאה בשליחת המייל", {
          description: error.message,
        });
      } else {
        toast.success("מייל לאיפוס סיסמה נשלח בהצלחה!");
        setSent(true);
      }
    } catch (error) {
      toast.error("שגיאה בשליחת המייל");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            איפוס סיסמה
          </CardTitle>
          <CardDescription className="text-center">
            {sent
              ? "בדוק את המייל שלך להוראות לאיפוס הסיסמה"
              : "הזן את המייל שלך ונשלח לך קישור לאיפוס סיסמה"}
          </CardDescription>
        </CardHeader>
        {!sent ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">מייל</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  dir="ltr"
                  className="text-left"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                שלח קישור לאיפוס סיסמה
              </Button>
              <Link
                to="/login"
                className="text-sm text-center text-muted-foreground hover:text-primary flex items-center justify-center gap-1"
              >
                <ArrowRight className="h-4 w-4" />
                חזור להתחברות
              </Link>
            </CardFooter>
          </form>
        ) : (
          <CardFooter className="flex flex-col gap-4">
            <p className="text-sm text-center text-muted-foreground">
              לא קיבלת מייל? בדוק את תיבת הספאם או{" "}
              <button
                onClick={() => setSent(false)}
                className="text-primary hover:underline font-medium"
              >
                נסה שוב
              </button>
            </p>
            <Link to="/login" className="w-full">
              <Button variant="outline" className="w-full">
                חזור להתחברות
              </Button>
            </Link>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
