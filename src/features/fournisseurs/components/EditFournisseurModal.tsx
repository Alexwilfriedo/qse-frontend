import { Button, Input, Modal, Select } from '@/components/ui';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useUpdateFournisseur } from '../hooks';
import type {
  CategorieFournisseur,
  ContactFournisseur,
  CriticiteFournisseur,
  Fournisseur,
  UpdateFournisseurRequest,
} from '../types';
import {
  CATEGORIE_FOURNISSEUR_OPTIONS,
  CRITICITE_FOURNISSEUR_OPTIONS,
} from '../types';

interface EditFournisseurModalProps {
  isOpen: boolean;
  onClose: () => void;
  fournisseur: Fournisseur | null;
}

export function EditFournisseurModal({
  isOpen,
  onClose,
  fournisseur,
}: EditFournisseurModalProps) {
  const [formData, setFormData] = useState<UpdateFournisseurRequest>({
    raisonSociale: '',
  });
  const updateFournisseur = useUpdateFournisseur();

  useEffect(() => {
    if (fournisseur) {
      setFormData({
        raisonSociale: fournisseur.raisonSociale,
        domaineActivite: fournisseur.domaineActivite || '',
        adresse: fournisseur.adresse || '',
        telephone: fournisseur.telephone || '',
        email: fournisseur.email || '',
        ifu: fournisseur.ifu || '',
        certifications: fournisseur.certifications || '',
        categorie: fournisseur.categorie || undefined,
        criticite: fournisseur.criticite || undefined,
        contacts: fournisseur.contacts || [],
      });
    }
  }, [fournisseur]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fournisseur) return;
    try {
      await updateFournisseur.mutateAsync({
        id: fournisseur.id,
        data: formData,
      });
      onClose();
    } catch {
      // Error handled by mutation
    }
  };

  const addContact = () => {
    setFormData((prev) => ({
      ...prev,
      contacts: [
        ...(prev.contacts || []),
        { nom: '', fonction: null, email: null, telephone: null },
      ],
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='Modifier le fournisseur'
      preserveState>
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
          <Button type='submit' disabled={updateFournisseur.isPending}>
            {updateFournisseur.isPending ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
