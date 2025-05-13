
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { FilterX, Search, SlidersHorizontal } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PatientFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeFilters: Record<string, boolean>;
  onFilterChange: (key: string, value: boolean) => void;
  onResetFilters: () => void;
}

export const PatientFilters: React.FC<PatientFiltersProps> = ({
  searchTerm,
  onSearchChange,
  activeFilters,
  onFilterChange,
  onResetFilters
}) => {
  const { t, language } = useLanguage();
  const adhdSubtypes = ['Inattentive', 'Hyperactive-Impulsive', 'Combined'];
  const ageRanges = ['6-8', '9-12', '13-17'];
  
  const hasActiveFilters = Object.values(activeFilters).some(value => value);
  
  return (
    <div className={`flex items-center mb-6 gap-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
      <div className="relative flex-1">
        <Search className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
        <Input
          placeholder={t('searchPatientsByName')}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`${language === 'ar' ? 'pr-9 text-right' : 'pl-9'}`}
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        />
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={`h-10 gap-1.5 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
            <SlidersHorizontal className="h-4 w-4" />
            <span>{t('filters')}</span>
            {hasActiveFilters && (
              <span className="flex h-2 w-2 bg-primary rounded-full" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={language === 'ar' ? 'start' : 'end'} className={`w-56 ${language === 'ar' ? 'text-right' : ''}`}>
          <DropdownMenuLabel>{t('adhdSubtypes')}</DropdownMenuLabel>
          {adhdSubtypes.map(subtype => (
            <DropdownMenuCheckboxItem
              key={subtype}
              checked={activeFilters[`subtype-${subtype}`] || false}
              onCheckedChange={(checked) => onFilterChange(`subtype-${subtype}`, !!checked)}
              className={language === 'ar' ? 'flex-row-reverse justify-between' : ''}
            >
              {t(subtype.toLowerCase())}
            </DropdownMenuCheckboxItem>
          ))}
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel>{t('ageRange')}</DropdownMenuLabel>
          {ageRanges.map(range => (
            <DropdownMenuCheckboxItem
              key={range}
              checked={activeFilters[`age-${range}`] || false}
              onCheckedChange={(checked) => onFilterChange(`age-${range}`, !!checked)}
              className={language === 'ar' ? 'flex-row-reverse justify-between' : ''}
            >
              {range} {t('years')}
            </DropdownMenuCheckboxItem>
          ))}
          
          <DropdownMenuSeparator />
          <div className="p-2">
            <Button
              variant="ghost"
              size="sm"
              className={`w-full justify-start font-normal ${language === 'ar' ? 'flex-row-reverse' : ''}`}
              onClick={onResetFilters}
              disabled={!hasActiveFilters}
            >
              <FilterX className={`h-4 w-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
              {t('resetFilters')}
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
