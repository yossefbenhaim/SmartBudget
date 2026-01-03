import { useState, useEffect } from "react";
import Joyride, { Step, CallBackProps, STATUS, ACTIONS } from "react-joyride";

interface OnboardingTourProps {
  run: boolean;
  onFinish: () => void;
}

export default function OnboardingTour({ run, onFinish }: OnboardingTourProps) {
  const [stepIndex, setStepIndex] = useState(0);

  const steps: Step[] = [
    {
      target: "body",
      content: (
        <div className="text-right" dir="rtl">
          <h2 className="text-2xl font-bold mb-4">ברוכים הבאים ל-SmartBudget! 🎉</h2>
          <p className="text-base mb-3">
            אנחנו שמחים שהצטרפת אלינו! בואו נעשה סיור קצר במערכת כדי שתבין איך
            להשתמש בה בצורה הטובה ביותר.
          </p>
          <p className="text-sm text-muted-foreground">
            הסיור יקח כ-2 דקות. לחץ על "הבא" כדי להתחיל
          </p>
        </div>
      ),
      placement: "center",
      disableBeacon: true,
    },
    {
      target: '[data-tour="balance-card"]',
      content: (
        <div className="text-right" dir="rtl">
          <h3 className="text-xl font-bold mb-2">היתרה הכוללת שלך 💰</h3>
          <p className="text-base">
            כאן תראה את מצב היתרה הנוכחי שלך - סכום כל ההכנסות פחות כל ההוצאות.
            זה עוזר לך לדעת בדיוק כמה כסף יש לך ברגע נתון.
          </p>
        </div>
      ),
      placement: "bottom",
    },
    {
      target: '[data-tour="income-card"]',
      content: (
        <div className="text-right" dir="rtl">
          <h3 className="text-xl font-bold mb-2">הכנסות החודש 📈</h3>
          <p className="text-base">
            כאן מוצג סכום כל ההכנסות שלך בחודש הנוכחי. המערכת מחשבת אוטומטית
            את כל התקבולים שהכנסת.
          </p>
        </div>
      ),
      placement: "bottom",
    },
    {
      target: '[data-tour="expenses-card"]',
      content: (
        <div className="text-right" dir="rtl">
          <h3 className="text-xl font-bold mb-2">הוצאות החודש 📉</h3>
          <p className="text-base">
            כאן מוצג סכום כל ההוצאות שלך בחודש הנוכחי. עקוב אחרי ההוצאות כדי
            לשלוט בתקציב שלך.
          </p>
        </div>
      ),
      placement: "bottom",
    },
    {
      target: '[data-tour="chart-section"]',
      content: (
        <div className="text-right" dir="rtl">
          <h3 className="text-xl font-bold mb-2">גרף השוואה 📊</h3>
          <p className="text-base mb-2">
            הגרף מציג השוואה ויזואלית בין ההכנסות להוצאות שלך לאורך זמן.
          </p>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>ירוק = הכנסות</li>
            <li>אדום = הוצאות</li>
            <li>תוכל לבחור תצוגה של 3, 6 או 12 חודשים</li>
          </ul>
        </div>
      ),
      placement: "top",
    },
    {
      target: '[data-tour="add-transaction"]',
      content: (
        <div className="text-right" dir="rtl">
          <h3 className="text-xl font-bold mb-2">הוספת תנועה חדשה ➕</h3>
          <p className="text-base mb-2">
            כאן תוסיף הכנסות והוצאות חדשות. פשוט לחץ על הכפתור ומלא את הפרטים:
          </p>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>בחר סוג: הכנסה או הוצאה</li>
            <li>הזן סכום ותיאור</li>
            <li>בחר קטגוריה</li>
            <li>בחר תאריך</li>
          </ul>
        </div>
      ),
      placement: "right",
    },
    {
      target: '[data-tour="transactions"]',
      content: (
        <div className="text-right" dir="rtl">
          <h3 className="text-xl font-bold mb-2">היסטוריית תנועות 📋</h3>
          <p className="text-base">
            כאן תראה את כל התנועות שלך - הכנסות והוצאות. תוכל לסנן, לחפש,
            ולערוך תנועות קיימות.
          </p>
        </div>
      ),
      placement: "right",
    },
    {
      target: '[data-tour="categories"]',
      content: (
        <div className="text-right" dir="rtl">
          <h3 className="text-xl font-bold mb-2">קטגוריות 🏷️</h3>
          <p className="text-base">
            נהל את הקטגוריות שלך - תוכל ליצור קטגוריות חדשות, לערוך קיימות,
            ולראות כמה הוצאת בכל קטגוריה.
          </p>
        </div>
      ),
      placement: "right",
    },
    {
      target: '[data-tour="balance"]',
      content: (
        <div className="text-right" dir="rtl">
          <h3 className="text-xl font-bold mb-2">יתרה מפורטת 💳</h3>
          <p className="text-base">
            תצוגה מפורטת של היתרה שלך עם גרפים וסטטיסטיקות. כאן תוכל לנתח את
            המצב הכלכלי שלך לעומק.
          </p>
        </div>
      ),
      placement: "right",
    },
    {
      target: "body",
      content: (
        <div className="text-right" dir="rtl">
          <h2 className="text-2xl font-bold mb-4">זהו! אתה מוכן להתחיל! 🚀</h2>
          <p className="text-base mb-3">
            עכשיו אתה מכיר את כל התכונות העיקריות של SmartBudget.
          </p>
          <p className="text-base mb-3">
            התחל להוסיף את התנועות שלך ועקוב אחרי התקציב בקלות!
          </p>
          <p className="text-sm text-muted-foreground">
            💡 טיפ: תוכל לגשת למדריך זה שוב מדף הפרופיל
          </p>
        </div>
      ),
      placement: "center",
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, action, index, type } = data;

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      onFinish();
    }

    // Handle step changes
    if (type === "step:after") {
      if (action === ACTIONS.NEXT) {
        setStepIndex(index + 1);
      } else if (action === ACTIONS.PREV) {
        setStepIndex(index - 1);
      }
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      stepIndex={stepIndex}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: "#2563eb",
          textColor: "#1f2937",
          backgroundColor: "#ffffff",
          arrowColor: "#ffffff",
          overlayColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: 12,
          padding: 24,
        },
        tooltipContent: {
          padding: "0 4px",
        },
        buttonNext: {
          backgroundColor: "#2563eb",
          borderRadius: 8,
          padding: "10px 20px",
          fontSize: "14px",
          fontWeight: 600,
        },
        buttonBack: {
          color: "#6b7280",
          marginRight: 10,
          fontSize: "14px",
        },
        buttonSkip: {
          color: "#6b7280",
          fontSize: "14px",
        },
      }}
      locale={{
        back: "חזור",
        close: "סגור",
        last: "סיים",
        next: "הבא",
        open: "פתח",
        skip: "דלג",
      }}
      floaterProps={{
        disableAnimation: false,
      }}
    />
  );
}
