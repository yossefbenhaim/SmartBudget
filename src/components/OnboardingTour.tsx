import { useState, useEffect, useMemo } from "react";
import Joyride, { Step, CallBackProps, STATUS, ACTIONS } from "react-joyride";
import { useMobileMenu } from "@/contexts/MobileMenuContext";

interface OnboardingTourProps {
  run: boolean;
  onFinish: () => void;
}

export default function OnboardingTour({ run, onFinish }: OnboardingTourProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const { isOpen: menuIsOpen, openMenu, closeMenu, setTourActive } = useMobileMenu();

  // Update tour active state
  useEffect(() => {
    setTourActive(run);
    return () => {
      setTourActive(false);
    };
  }, [run, setTourActive]);

  // Fix tour overlay to not block interactions
  useEffect(() => {
    if (run) {
      const fixTourOverlay = () => {
        // Find tour overlay by its characteristics - specifically looking for the one with mix-blend-mode: hard-light
        const allDivs = document.querySelectorAll('div');
        allDivs.forEach((div) => {
          const divEl = div as HTMLElement;
          const style = divEl.style;
          const computed = getComputedStyle(divEl);
          
          // Check if it matches the tour overlay: position absolute, z-index 999998 or 30, rgba background, mix-blend-mode hard-light
          const hasMixBlend = computed.mixBlendMode === 'hard-light' || style.mixBlendMode === 'hard-light';
          const hasRgbaBg = (style.backgroundColor || computed.backgroundColor).includes('rgba');
          const hasZIndex = computed.zIndex === '999998' || computed.zIndex === '30' || 
                           style.zIndex === '999998' || style.zIndex === '30' ||
                           style.cssText.includes('z-index: 999998') || style.cssText.includes('z-index: 30');
          const isAbsolute = computed.position === 'absolute' || style.position === 'absolute';
          const hasInset = style.cssText.includes('inset: 0px') || computed.inset === '0px';
          
          // If it matches the tour overlay pattern
          if (isAbsolute && hasZIndex && (hasRgbaBg || hasMixBlend || hasInset)) {
            divEl.style.setProperty('z-index', '30', 'important');
            divEl.style.setProperty('pointer-events', 'none', 'important');
          }
        });
      };

      fixTourOverlay();
      // Use requestAnimationFrame for better performance
      let rafId: number;
      const scheduleFix = () => {
        fixTourOverlay();
        rafId = requestAnimationFrame(scheduleFix);
      };
      rafId = requestAnimationFrame(scheduleFix);
      
      return () => {
        cancelAnimationFrame(rafId);
      };
    }
  }, [run]);

  // Ensure mobile menu overlay doesn't block tour when active
  useEffect(() => {
    if (run && isMobile && menuIsOpen) {
      const adjustMenuStyles = () => {
        // Adjust mobile menu overlay and content
        const menuOverlay = document.querySelector('[data-radix-dialog-overlay]');
        const menuContent = document.querySelector('[data-radix-dialog-content]');
        
        if (menuOverlay) {
          const overlayEl = menuOverlay as HTMLElement;
          overlayEl.style.setProperty('z-index', '40', 'important');
          overlayEl.style.setProperty('pointer-events', 'none', 'important');
        }
        if (menuContent) {
          const contentEl = menuContent as HTMLElement;
          contentEl.style.setProperty('z-index', '40', 'important');
          contentEl.style.setProperty('pointer-events', 'auto', 'important');
        }

        // Adjust tour overlay - make it not block interactions
        const tourOverlays = document.querySelectorAll('[style*="z-index: 999998"], [style*="z-index: 30"]');
        tourOverlays.forEach((overlay) => {
          const overlayEl = overlay as HTMLElement;
          // Check if it's the tour overlay (has mix-blend-mode: hard-light)
          if (overlayEl.style.mixBlendMode === 'hard-light' || 
              getComputedStyle(overlayEl).mixBlendMode === 'hard-light') {
            overlayEl.style.setProperty('z-index', '30', 'important');
            overlayEl.style.setProperty('pointer-events', 'none', 'important');
          }
        });

        // Also find by position absolute and background-color rgba
        const allOverlays = document.querySelectorAll('[style*="position: absolute"]');
        allOverlays.forEach((overlay) => {
          const overlayEl = overlay as HTMLElement;
          const bgColor = overlayEl.style.backgroundColor || getComputedStyle(overlayEl).backgroundColor;
          const zIndex = overlayEl.style.zIndex || getComputedStyle(overlayEl).zIndex;
          // If it's the tour overlay (rgba background and high z-index)
          if (bgColor.includes('rgba') && (zIndex === '999998' || zIndex === '30')) {
            overlayEl.style.setProperty('z-index', '30', 'important');
            overlayEl.style.setProperty('pointer-events', 'none', 'important');
          }
        });
      };

      // Adjust immediately
      adjustMenuStyles();

      // Watch for changes
      const observer = new MutationObserver(() => {
        adjustMenuStyles();
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
      });

      // Also check periodically
      const interval = setInterval(adjustMenuStyles, 100);

      return () => {
        observer.disconnect();
        clearInterval(interval);
        // Restore styles
        const menuOverlay = document.querySelector('[data-radix-dialog-overlay]');
        const menuContent = document.querySelector('[data-radix-dialog-content]');
        
        if (menuOverlay) {
          (menuOverlay as HTMLElement).style.removeProperty('z-index');
          (menuOverlay as HTMLElement).style.removeProperty('pointer-events');
        }
        if (menuContent) {
          (menuContent as HTMLElement).style.removeProperty('z-index');
          (menuContent as HTMLElement).style.removeProperty('pointer-events');
        }
      };
    }
  }, [run, isMobile, menuIsOpen]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Open mobile menu automatically before steps that need it (steps 5-8, indices 5-8)
  useEffect(() => {
    if (run && isMobile) {
      // Open menu before step 5 (at the end of step 4, index 4)
      if (stepIndex === 4) {
        // Open menu with a small delay to ensure smooth transition
        setTimeout(() => {
          if (!menuIsOpen) {
            openMenu();
          }
        }, 500);
      }
      // Keep menu open during steps 5-8 (indices 5-8)
      else if (stepIndex >= 5 && stepIndex <= 8) {
        // Ensure menu stays open - check periodically in case user closes it
        if (!menuIsOpen) {
          openMenu();
        }
      }
      // Close menu after step 8 (index 9) or when tour finishes
      else if (stepIndex > 8 && menuIsOpen) {
        closeMenu();
      }
    }
  }, [run, isMobile, stepIndex, menuIsOpen, openMenu, closeMenu]);

  const steps: Step[] = useMemo(() => [
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
      target: isMobile ? '[data-tour="balance-mobile"]' : '[data-tour="add-transaction"]',
      content: (
        <div className="text-right" dir="rtl">
          {isMobile ? (
            <>
              <h3 className="text-xl font-bold mb-2">יתרה והשקעות 💰</h3>
              <p className="text-base">
                כאן תוכל לראות ניתוח מפורט של היתרה שלך, הכנסות והוצאות לפי קטגוריות,
                והמלצות השקעה מותאמות אישית.
              </p>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      ),
      placement: isMobile ? "left" : "bottom",
    },
    {
      target: isMobile ? '[data-tour="add-transaction-mobile"]' : '[data-tour="transactions"]',
      content: (
        <div className="text-right" dir="rtl">
          {isMobile ? (
            <>
              <h3 className="text-xl font-bold mb-2">הוספת תנועה ➕</h3>
              <p className="text-base">
                כאן תוסיף הכנסות והוצאות חדשות. לחץ כאן ומלא את הפרטים.
              </p>
            </>
          ) : (
            <>
              <h3 className="text-xl font-bold mb-2">היסטוריית תנועות 📋</h3>
              <p className="text-base">
                כאן תראה את כל התנועות שלך - הכנסות והוצאות. תוכל לסנן, לחפש,
                ולערוך תנועות קיימות.
              </p>
            </>
          )}
        </div>
      ),
      placement: isMobile ? "left" : "bottom",
    },
    {
      target: isMobile ? '[data-tour="transactions-mobile"]' : '[data-tour="categories"]',
      content: (
        <div className="text-right" dir="rtl">
          {isMobile ? (
            <>
              <h3 className="text-xl font-bold mb-2">תנועות 📋</h3>
              <p className="text-base">
                היסטוריה מלאה של כל ההכנסות וההוצאות שלך.
              </p>
            </>
          ) : (
            <>
              <h3 className="text-xl font-bold mb-2">קטגוריות 🏷️</h3>
              <p className="text-base">
                נהל את הקטגוריות שלך - תוכל ליצור קטגוריות חדשות, לערוך קיימות,
                ולראות כמה הוצאת בכל קטגוריה.
              </p>
            </>
          )}
        </div>
      ),
      placement: isMobile ? "left" : "bottom",
    },
    {
      target: isMobile ? '[data-tour="categories-mobile"]' : '[data-tour="balance"]',
      content: (
        <div className="text-right" dir="rtl">
          {isMobile ? (
            <>
              <h3 className="text-xl font-bold mb-2">קטגוריות 🏷️</h3>
              <p className="text-base">
                נהל את הקטגוריות שלך וראה סטטיסטיקות לפי קטגוריה.
              </p>
            </>
          ) : (
            <>
              <h3 className="text-xl font-bold mb-2">יתרה מפורטת 💳</h3>
              <p className="text-base">
                תצוגה מפורטת של היתרה שלך עם גרפים וסטטיסטיקות. כאן תוכל לנתח את
                המצב הכלכלי שלך לעומק.
              </p>
            </>
          )}
        </div>
      ),
      placement: isMobile ? "left" : "bottom",
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
  ], [isMobile]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, action, index, type } = data;

    console.log('Joyride callback:', { status, action, index, type, step: steps[index] });

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      // Close mobile menu when tour finishes
      if (isMobile) {
        closeMenu();
      }
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

    // For mobile: ensure menu is open and elements are visible before targeting them
    if (isMobile && type === "step:before" && index >= 5 && index <= 8) {
      // Ensure menu is open before showing step
      openMenu();
      // Wait a bit for menu animation to complete
      setTimeout(() => {
        const target = document.querySelector(steps[index].target as string);
        if (target) {
          // Scroll element into view if needed
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }

    // Debug: check if mobile menu items exist
    if (isMobile && index >= 5) {
      console.log('Checking mobile menu items...');
      console.log('balance-mobile:', document.querySelector('[data-tour="balance-mobile"]'));
      console.log('add-transaction-mobile:', document.querySelector('[data-tour="add-transaction-mobile"]'));
      console.log('transactions-mobile:', document.querySelector('[data-tour="transactions-mobile"]'));
      console.log('categories-mobile:', document.querySelector('[data-tour="categories-mobile"]'));
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
      disableScrolling={false}
      disableOverlayClose={true}
      scrollToFirstStep={true}
      styles={{
        options: {
          primaryColor: "#2563eb",
          textColor: "#1f2937",
          backgroundColor: "#ffffff",
          arrowColor: "#ffffff",
          overlayColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1000000,
        },
        spotlight: {
          zIndex: 999999,
        },
        overlay: {
          zIndex: 30,
          pointerEvents: 'none',
        },
        tooltip: {
          borderRadius: 12,
          padding: 24,
          zIndex: 1000001,
        },
        tooltipContainer: {
          zIndex: 1000001,
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
