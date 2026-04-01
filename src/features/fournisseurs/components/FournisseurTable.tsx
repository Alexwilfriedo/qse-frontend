import { Badge, Button, DataTable } from '@/components/ui';
import { Edit2, Eye, Trash2 } from 'lucide-react';
import type { Fournisseur } from '../types';

interface FournisseurTableProps {
  fournisseurs: Fournisseur[] | undefined;
  isLoading: boolean;
  onView: (fournisseur: Fournisseur) => void;
  onEdit: (fournisseur: Fournisseur) => void;
  onDelete: (fournisseur: Fournisseur) => void;
}

const statutBadgeVariant: Record<
  string,
  'success' | 'warning' | 'error' | 'info'
> = {
  HOMOLOGUE: 'success',
  SOUS_SURVEILLANCE: 'warning',
  DISQUALIFIE: 'error',
};

const statutLabels: Record<string, string> = {
  HOMOLOGUE: 'Homologu\u00e9',
  SOUS_SURVEILLANCE: 'Sous surveillance',
  DISQUALIFIE: 'Disqualifi\u00e9',
};

const categorieLabels: Record<string, string> = {
  TRAVAUX_HT: 'Travaux HT',
  FOURNITURES: 'Fournitures',
  PRESTATIONS: 'Prestations',
};

const criticiteLabels: Record<string, string> = {
  STRATEGIQUE: 'Strat\u00e9gique',
  IMPORTANT: 'Important',
  STANDARD: 'Standard',
};

const criticiteBadgeVariant: Record<string, 'error' | 'warning' | 'info'> = {
  STRATEGIQUE: 'error',
  IMPORTANT: 'warning',
  STANDARD: 'info',
};

export function FournisseurTable({
  fournisseurs,
  isLoading,
  onView,
  onEdit,
  onDelete,
}: FournisseurTableProps) {
  const columns = [
    {
      key: 'raisonSociale',
      header: 'Raison sociale',
      render: (f: Fournisseur) => (
        <button
          onClick={() => onView(f)}
          className='font-medium text-gray-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 text-left'>
          {f.raisonSociale}
        </button>
      ),
    },
    {
      key: 'domaineActivite',
      header: "Domaine d'activité",
      render: (f: Fournisseur) => (
        <span className='text-sm text-gray-600 dark:text-gray-400'>
          {f.domaineActivite || '—'}
        </span>
      ),
    },
    {
      key: 'categorie',
      header: 'Cat\u00e9gorie',
      render: (f: Fournisseur) => (
        <span className='text-sm text-gray-600 dark:text-gray-400'>
          {f.categorie ? categorieLabels[f.categorie] || f.categorie : '\u2014'}
        </span>
      ),
    },
    {
      key: 'criticite',
      header: 'Criticit\u00e9',
      render: (f: Fournisseur) =>
        f.criticite ? (
          <Badge variant={criticiteBadgeVariant[f.criticite] || 'info'}>
            {criticiteLabels[f.criticite] || f.criticite}
          </Badge>
        ) : (
          <span className='text-sm text-gray-400'>\u2014</span>
        ),
    },
    {
      key: 'statut',
      header: 'Statut',
      render: (f: Fournisseur) => (
        <Badge variant={statutBadgeVariant[f.statut] || 'info'}>
          {statutLabels[f.statut] || f.statut}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Créé le',
      render: (f: Fournisseur) => (
        <span className='text-sm text-gray-500 dark:text-gray-400'>
          {new Date(f.createdAt).toLocaleDateString('fr-FR')}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (f: Fournisseur) => (
        <div className='flex gap-1 justify-end'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onView(f)}
            title='Voir'>
            <Eye className='w-4 h-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onEdit(f)}
            title='Modifier'>
            <Edit2 className='w-4 h-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onDelete(f)}
            title='Supprimer'>
            <Trash2 className='w-4 h-4 text-error-500' />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={fournisseurs}
      isLoading={isLoading}
      keyExtractor={(f) => f.id}
      emptyMessage='Aucun fournisseur trouvé'
      skeletonRows={5}
    />
  );
}
