import { useReferenceItems } from '@/features/configuration/hooks';
import {
  DEFAULT_ENTITY_TYPE_OPTIONS,
  getEntityTypeLabel,
  type EntityType,
} from '../types';

export function useEntityTypeOptions() {
  const query = useReferenceItems('entity-types', true);

  const configuredOptions =
    query.data?.map((item) => ({
      value: item.code,
      label: item.label,
    })) ?? [];

  const options =
    configuredOptions.length > 0 ? configuredOptions : DEFAULT_ENTITY_TYPE_OPTIONS;

  const getLabel = (type: EntityType) =>
    configuredOptions.find((option) => option.value === type)?.label ??
    getEntityTypeLabel(type);

  return {
    ...query,
    options,
    getLabel,
  };
}
