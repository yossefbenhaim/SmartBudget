import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Loader2, Lock } from "lucide-react";

export default function UpdatePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

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
