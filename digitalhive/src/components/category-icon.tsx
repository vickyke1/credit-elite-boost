import {
  Briefcase,
  Stethoscope,
  GraduationCap,
  FileText,
  CalendarDays,
  Printer,
  BookOpen,
  Sparkles,
  Palette,
  Megaphone,
  type LucideIcon,
  Package,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Briefcase,
  Stethoscope,
  GraduationCap,
  FileText,
  CalendarDays,
  Printer,
  BookOpen,
  Sparkles,
  Palette,
  Megaphone,
};

export function CategoryIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = iconMap[name] ?? Package;
  return <Icon className={className} />;
}
