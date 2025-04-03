import React from 'react';
import {
  Dices,
  BoxIcon,
  PenLineIcon,
  LightbulbIcon,
  LineChartIcon,
  ShoppingBagIcon,
  PlaneTakeoffIcon,
  GraduationCapIcon,
  TerminalSquareIcon,
} from 'lucide-react';
import { cn } from '~/utils';

const categoryIconMap: Record<string, React.ElementType> = {
  misc: BoxIcon,
  roleplay: Dices,
  write: PenLineIcon,
  idea: LightbulbIcon,
  shop: ShoppingBagIcon,
  finance: LineChartIcon,
  code: TerminalSquareIcon,
  travel: PlaneTakeoffIcon,
  teach_or_explain: GraduationCapIcon,
  branding: PlaneTakeoffIcon,
  copywriting: LightbulbIcon,
  email_marketing: BoxIcon,
  social_media: BoxIcon,
  content_strategy: GraduationCapIcon,
  seo: PenLineIcon,
  ads: Dices,
  customer_research: GraduationCapIcon,
  product_marketing: ShoppingBagIcon,
  marketing_analytics: LineChartIcon,
};

const categoryColorMap: Record<string, string> = {
  code: 'text-red-500',
  misc: 'text-blue-300',
  shop: 'text-purple-400',
  idea: 'text-yellow-300',
  write: 'text-purple-400',
  travel: 'text-yellow-300',
  finance: 'text-orange-400',
  roleplay: 'text-orange-400',
  teach_or_explain: 'text-blue-300',
  branding: 'text-yellow-500',
  copywriting: 'text-purple-500',
  email_marketing: 'text-pink-400',
  social_media: 'text-blue-400',
  content_strategy: 'text-green-400',
  seo: 'text-indigo-400',
  ads: 'text-red-400',
  customer_research: 'text-teal-400',
  product_marketing: 'text-orange-300',
  marketing_analytics: 'text-green-500',
};

export default function CategoryIcon({
  category,
  className = '',
}: {
  category: string;
  className?: string;
}) {
  const IconComponent = categoryIconMap[category];
  const colorClass = categoryColorMap[category] + ' ' + className;
  if (!IconComponent) {
    return null;
  }
  return <IconComponent className={cn(colorClass, className)} aria-hidden="true" />;
}
