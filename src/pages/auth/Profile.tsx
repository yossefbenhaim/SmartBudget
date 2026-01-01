import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChangePasswordDialog } from "@/components/auth/ChangePasswordDialog";
import { UserCircle, Mail, Calendar } from "lucide-react";
import { format } from "date-fns";
import { he } from "date-fns/locale";

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const createdAt = user.created_at ? new Date(user.created_at) : null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
          <UserCircle className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">הפרופיל שלי</h1>
          <p className="text-muted-foreground">נהל את פרטי החשבון שלך</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>פרטי משתמש</CardTitle>
          <CardDescription>המידע שלך ב-SmartBudget</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              מייל
            </Label>
            <Input
              id="email"
              type="email"
              value={user.email || ""}
              disabled
              dir="ltr"
              className="text-left"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
              מזהה משתמש
            </Label>
            <Input
              value={user.id}
              disabled
              dir="ltr"
              className="text-left font-mono text-xs"
            />
          </div>

          {createdAt && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                תאריך הצטרפות
              </Label>
              <Input
                value={format(createdAt, "PPP", { locale: he })}
                disabled
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>אבטחה</CardTitle>
          <CardDescription>נהל את הגדרות האבטחה שלך</CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePasswordDialog />
        </CardContent>
      </Card>
    </div>
  );
}
