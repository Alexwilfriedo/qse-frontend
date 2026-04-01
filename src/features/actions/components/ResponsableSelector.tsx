import { Select } from '@/components/ui';
import { adminApi } from '@/features/admin/adminApi';
import { useQuery } from '@tanstack/react-query';

interface ResponsableSelectorProps {
  value: string;
  onChange: (userId: string, userName: string) => void;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function ResponsableSelector({
  value,
  onChange,
  label = 'Responsable',
  required = false,
  disabled = false,
  placeholder = 'Sélectionner un responsable',
}: ResponsableSelectorProps) {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: adminApi.getUsers,
    staleTime: 5 * 60 * 1000,
  });

  const activeUsers = users.filter((u) => u.active);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value;
    const user = activeUsers.find((u) => u.id === userId);
    const userName = user ? `${user.firstName} ${user.lastName}` : '';
    onChange(userId, userName);
  };

  const options = activeUsers.map((user) => ({
    value: user.id,
    label: `${user.firstName} ${user.lastName} (${user.email})`,
  }));

  return (
    <Select
      label={label}
      required={required}
      disabled={disabled || isLoading}
      placeholder={isLoading ? 'Chargement...' : placeholder}
      searchable
      clearable
      options={options}
      value={value}
      onChange={handleChange}
    />
  );
}
