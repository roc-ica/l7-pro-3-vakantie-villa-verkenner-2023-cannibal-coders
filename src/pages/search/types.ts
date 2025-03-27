import { PropertyFilter } from '../../types/property';

export interface FilterComponentProps {
  filters: PropertyFilter;
  onChange: (newFilters: Partial<PropertyFilter>) => void;
}
