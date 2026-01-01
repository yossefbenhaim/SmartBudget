import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { Loader2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(email, password);

      if (error) {
        // בדיקה אם השגיאה היא בגלל אימות מייל
        if (error.message.includes("Email not confirmed")) {
          toast.error("המייל לא אומת", {
            description: "בדוק את המייל שלך ולחץ על קישור האימות",
          });
          navigate("/verify-email", { state: { email } });
        } else {
          toast.error("שגיאה בהתחברות", {
            description: error.message,
          });
        }
      } else {
        toast.success("התחברת בהצלחה!");
        navigate("/");
      }
    } catch (error) {
      toast.error("שגיאה בהתחברות");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            התחברות
          </CardTitle>
          <CardDescription className="text-center">
            הזן את המייל והסיסמה שלך כדי להתחבר
          </CardDescription>
        </CardHeader>
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
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">סיסמה</Label>
                <Link
                  to="/reset-password"
                  className="text-sm text-primary hover:underline"
                >
                  שכחת סיסמה?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              התחבר
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              עדיין אין לך חשבון?{" "}
              <Link to="/register" className="text-primary hover:underline font-medium">
                הירשם כעת
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
