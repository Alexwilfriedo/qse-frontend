import { Button, Input, Modal, Select } from '@/components/ui';
import { useState } from 'react';
import type { Role } from '../adminApi';

interface CreateGuestModalProps {
  roles: Role[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    roleIds: string[];
    expiresAt: string;
  }) => void;
  isLoading: boolean;
}

export function CreateGuestModal({
  roles,
  isOpen,
  onClose,
  onSave,
  isLoading,
}: CreateGuestModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [expiresInDays, setExpiresInDays] = useState('7');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expiresAt = new Date(
      Date.now() + parseInt(expiresInDays) * 24 * 60 * 60 * 1000,
    ).toISOString();
    onSave({
      email,
      password,
      firstName,
      lastName,
      roleIds: selectedRoleId ? [selectedRoleId] : [],
      expiresAt,
    });
  };

  const roleOptions = roles.map((r) => ({
    value: r.id,
    label: r.name,
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Créer un accès invité'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='grid grid-cols-2 gap-3'>
          <Input
            label='Prénom'
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <Input
            label='Nom'
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <Input
          label='Email'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label='Mot de passe'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Select
          label='Role'
          value={selectedRoleId}
          onChange={(e) => setSelectedRoleId(e.target.value)}
          options={roleOptions}
          placeholder='Selectionner un role'
        />
        <Select
          label="Duree d'acces"
          value={expiresInDays}
          onChange={(e) => setExpiresInDays(e.target.value)}
          options={[
            { value: '1', label: '1 jour' },
            { value: '3', label: '3 jours' },
            { value: '7', label: '7 jours' },
            { value: '14', label: '14 jours' },
            { value: '30', label: '30 jours' },
            { value: '90', label: '90 jours' },
          ]}
        />
        <div className='flex justify-end gap-3 pt-2'>
          <Button variant='secondary' onClick={onClose} type='button'>
            Annuler
          </Button>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? 'Création...' : 'Créer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
