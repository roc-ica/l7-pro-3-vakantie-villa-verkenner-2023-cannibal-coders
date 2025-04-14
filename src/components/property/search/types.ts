import { PropertyFilter } from '../../../types/property';

export interface FilterComponentProps {
  filters: PropertyFilter;
  onChange: (newFilters: Partial<PropertyFilter>) => void;
  className?: string;
}

export interface CollapsibleSectionProps extends FilterComponentProps {
  title: string;
  icon: React.ElementType;
  defaultExpanded?: boolean;
}
