
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { formatPercentile, getScoreColorClass } from '@/utils/dataProcessing';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { useLanguage } from '@/contexts/LanguageContext';

interface StatusCardProps {
  title: string;
  value: number | string;
  isPercentile?: boolean;
  change?: { value: number; isImprovement: boolean };
  icon: React.ReactNode;
  tooltip?: string;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  title,
  value,
  isPercentile = false,
  change,
  icon,
  tooltip
}) => {
  const { t, language } = useLanguage();
  const formattedValue = isPercentile ? formatPercentile(value as number) : value;
  const colorClass = isPercentile ? getScoreColorClass(value as number) : '';
  
  return (
    <Card className="glass overflow-hidden">
      <CardContent className="p-3 sm:p-6">
        <div className="flex justify-between items-start">
          <div className="w-full max-w-[80%]">
            <div className="flex items-center gap-1 flex-wrap">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                {title}
              </p>
              {tooltip && <InfoTooltip text={tooltip} size="sm" />}
            </div>
            <h4 className={`text-lg sm:text-2xl font-bold mt-1 ${colorClass} truncate`}>
              {formattedValue}
              {isPercentile && <span className="hidden sm:inline"> {t("percentile")}</span>}
              {isPercentile && <span className="sm:hidden"> {t("percentile").substring(0, 4)}</span>}
            </h4>
            
            {change && (
              <div className="flex items-center mt-1 sm:mt-2 flex-wrap">
                {change.isImprovement ? (
                  <div className="flex items-center text-emerald-600 text-xs sm:text-sm">
                    <ArrowUp className={`h-3 w-3 ${language === 'ar' ? 'ml-1' : 'mr-1'} flex-shrink-0`} />
                    <span>{change.value}%</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600 text-xs sm:text-sm">
                    <ArrowDown className={`h-3 w-3 ${language === 'ar' ? 'ml-1' : 'mr-1'} flex-shrink-0`} />
                    <span>{change.value}%</span>
                  </div>
                )}
                <span className="text-muted-foreground text-xs ml-1.5 hidden sm:inline">
                  {t("from last month")}
                </span>
              </div>
            )}
          </div>
          
          <div className="p-1.5 sm:p-2 rounded-md bg-primary/10 text-primary flex-shrink-0 ml-2">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
