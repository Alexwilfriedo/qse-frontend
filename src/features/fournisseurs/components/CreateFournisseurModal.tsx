import { Button, Input, Modal, Select } from '@/components/ui';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useCreateFournisseur } from '../hooks';
import type {
  CategorieFournisseur,
  ContactFournisseur,
  CreateFournisseurRequest,
  CriticiteFournisseur,
} from '../types';
import {
  CATEGORIE_FOURNISSEUR_OPTIONS,
  CRITICITE_FOURNISSEUR_OPTIONS,
} from '../types';

interface CreateFournisseurModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EMPTY_CONTACT: ContactFournisseur = {
  nom: '',
  fonction: null,
  email: null,
  telephone: null,
};

const DEFAULT_FORM: CreateFournisseurRequest = {
  raisonSociale: '',
  domaineActivite: '',
  adresse: '',
  telephone: '',
  email: '',
  ifu: '',
  certifications: '',
  categorie: undefined,
  criticite: undefined,
  contacts: [],
};

export function CreateFournisseurModal({
  isOpen,
  onClose,
}: CreateFournisseurModalProps) {
  const [formData, setFormData] =
    useState<CreateFournisseurRequest>(DEFAULT_FORM);
  const createFournisseur = useCreateFournisseur();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createFournisseur.mutateAsync(formData);
      onClose();
    } catch {
      // Error handled by mutation
    }
  };

  const addContact = () => {
    setFormData((prev) => ({
      ...prev,
      contacts: [...(prev.contacts || []), { ...EMPTY_CONTACT }],
    }));
  };

  const updateContact = (
    index: number,
    field: keyof ContactFournisseur,
    value: string,
  ) => {
    setFormData((prev) => {
      const contacts = [...(prev.contacts || [])];
      contacts[index] = { ...contacts[index], [field]: value || null };
      return { ...prev, contacts };
    });
  };

  const removeContact = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      contacts: (prev.contacts || []).filter((_, i) => i !== index),
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Nouveau fournisseur'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Raison sociale *
          </label>
          <Input
            value={formData.raisonSociale}
            onChange={(e) =>
              setFormData({ ...formData, raisonSociale: e.target.value })
            }
            placeholder='Raison sociale du fournisseur'
            required
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Domaine d'activité
            </label>
            <Input
              value={formData.domaineActivite || ''}
              onChange={(e) =>
                setFormData({ ...formData, domaineActivite: e.target.value })
              }
              placeholder='Ex: BTP, Services...'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Email
            </label>
            <Input
              type='email'
              value={formData.email || ''}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder='contact@fournisseur.com'
            />
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Téléphone
            </label>
            <Input
              value={formData.telephone || ''}
              onChange={(e) =>
                setFormData({ ...formData, telephone: e.target.value })
              }
              placeholder='+225 00 00 00 00'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Adresse
            </label>
            <Input
              value={formData.adresse || ''}
              onChange={(e) =>
                setFormData({ ...formData, adresse: e.target.value })
              }
              placeholder='Adresse complète'
            />
          </div>
        </div>

        <div className='grid grid-cols-3 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              IFU
            </label>
            <Input
              value={formData.ifu || ''}
              onChange={(e) =>
                setFormData({ ...formData, ifu: e.target.value })
              }
              placeholder='Identifiant fiscal'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Catégorie
            </label>
            <Select
              value={formData.categorie || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  categorie:
                    (e.target.value as CategorieFournisseur) || undefined,
                })
              }
              options={[
                { value: '', label: 'Sélectionner...' },
                ...CATEGORIE_FOURNISSEUR_OPTIONS,
              ]}
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Segmentation
            </label>
            <Select
              value={formData.criticite || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  criticite:
                    (e.target.value as CriticiteFournisseur) || undefined,
                })
              }
              options={[
                { value: '', label: 'Sélectionner...' },
                ...CRITICITE_FOURNISSEUR_OPTIONS,
              ]}
            />
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Certifications
          </label>
          <Input
            value={formData.certifications || ''}
            onChange={(e) =>
              setFormData({ ...formData, certifications: e.target.value })
            }
            placeholder='ISO 9001, ISO 14001...'
          />
        </div>

        {/* Contacts */}
        <div>
          <div className='flex items-center justify-between mb-2'>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Contacts
            </label>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={addContact}>
              <Plus className='w-4 h-4 mr-1' />
              Ajouter
            </Button>
          </div>
          {(formData.contacts || []).map((contact, index) => (
            <div key={index} className='flex gap-2 mb-2 items-start'>
              <Input
                value={contact.nom}
                onChange={(e) => updateContact(index, 'nom', e.target.value)}
                placeholder='Nom *'
                className='flex-1'
                required
              />
              <Input
                value={contact.fonction || ''}
                onChange={(e) =>
                  updateContact(index, 'fonction', e.target.value)
                }
                placeholder='Fonction'
                className='flex-1'
              />
              <Input
                value={contact.email || ''}
                onChange={(e) => updateContact(index, 'email', e.target.value)}
                placeholder='Email'
                className='flex-1'
              />
              <Input
                value={contact.telephone || ''}
                onChange={(e) =>
                  updateContact(index, 'telephone', e.target.value)
                }
                placeholder='Tél'
                className='w-32'
              />
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={() => removeContact(index)}>
                <Trash2 className='w-4 h-4 text-error-500' />
              </Button>
            </div>
          ))}
        </div>

        <div className='flex justify-end gap-3 pt-4'>
          <Button type='button' variant='secondary' onClick={onClose}>
            Annuler
          </Button>
          <Button type='submit' disabled={createFournisseur.isPending}>
            {createFournisseur.isPending ? 'Création...' : 'Créer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
