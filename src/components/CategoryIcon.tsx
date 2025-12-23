import {
  Wallet,
  Gift,
  TrendingUp,
  ShoppingCart,
  Car,
  Home,
  Music,
  FileText,
  Heart,
  ShoppingBag,
  GraduationCap,
  MoreHorizontal,
  Coffee,
  Plane,
  Smartphone,
  Wifi,
  Zap,
  Droplet,
  Briefcase,
  CreditCard,
  DollarSign,
  Euro,
  PiggyBank,
  Receipt,
  Building,
  Bus,
  Bike,
  Utensils,
  Baby,
  Dog,
  CircleDot,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Wallet,
  Gift,
  TrendingUp,
  ShoppingCart,
  Car,
  Home,
  Music,
  FileText,
  Heart,
  ShoppingBag,
  GraduationCap,
  MoreHorizontal,
  Coffee,
  Plane,
  Smartphone,
  Wifi,
  Zap,
  Droplet,
  Briefcase,
  CreditCard,
  DollarSign,
  Euro,
  PiggyBank,
  Receipt,
  Building,
  Bus,
  Bike,
  Utensils,
  Baby,
  Dog,
  CircleDot,
};

interface CategoryIconProps {
  iconName: string;
  className?: string;
}

export function CategoryIcon({ iconName, className = "h-4 w-4" }: CategoryIconProps) {
  const IconComponent = iconMap[iconName] || CircleDot;
  return <IconComponent className={className} />;
}

export const availableIcons = Object.keys(iconMap).filter(name => name !== "CircleDot");