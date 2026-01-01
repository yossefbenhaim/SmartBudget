import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";

export function ChangePasswordDialog() {
  const [open, setOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { updatePassword } = useAuth();

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
        toast.success("הסיסמה עודכנה בהצלחה!");
        setOpen(false);
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      toast.error("שגיאה בעדכון הסיסמה");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto">
          <Lock className="ml-2 h-4 w-4" />
          שנה סיסמה
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>שנה סיסמה</DialogTitle>
          <DialogDescription>
            הזן את הסיסמה החדשה שלך. הסיסמה חייבת להכיל לפחות 6 תווים.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
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
                placeholder="הזן שוב את הסיסמה"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              עדכן סיסמה
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
