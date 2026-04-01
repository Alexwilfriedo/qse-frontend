import { Button, Card, CardHeader, DatePicker, PageHeader } from '@/components/ui';
import { useProcess, useUpdateFip } from '@/features/cartography/hooks';
import type { UpdateFipRequest } from '@/features/cartography/processTypes';
import { ArrowLeft, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

interface FipForm {
  axesStrategiques: string;
  finalites: string;
  fournisseurs: string;
  elementsEntree: string;
  activites: string;
  elementsSortie: string;
  clients: string;
  exigencesLegales: string;
  dateValidite: string;
}

const EMPTY_FORM: FipForm = {
  axesStrategiques: '',
  finalites: '',
  fournisseurs: '',
  elementsEntree: '',
  activites: '',
  elementsSortie: '',
  clients: '',
  exigencesLegales: '',
  dateValidite: '',
};

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className='w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors'
      />
    </div>
  );
}

export default function ProcessEditFipPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: process, isLoading } = useProcess(id);
  const updateFip = useUpdateFip();

  const [form, setForm] = useState<FipForm>(EMPTY_FORM);

  useEffect(() => {
    if (process) {
      setForm({
        axesStrategiques: process.axesStrategiques ?? '',
        finalites: process.finalites ?? '',
        fournisseurs: process.fournisseurs ?? '',
        elementsEntree: process.elementsEntree ?? '',
        activites: process.activites ?? '',
        elementsSortie: process.elementsSortie ?? '',
        clients: process.clients ?? '',
        exigencesLegales: process.exigencesLegales ?? '',
        dateValidite: process.dateValidite ?? '',
      });
    }
  }, [process]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const data: UpdateFipRequest = {
      axesStrategiques: form.axesStrategiques || undefined,
      finalites: form.finalites || undefined,
      fournisseurs: form.fournisseurs || undefined,
      elementsEntree: form.elementsEntree || undefined,
      activites: form.activites || undefined,
      elementsSortie: form.elementsSortie || undefined,
      clients: form.clients || undefined,
      exigencesLegales: form.exigencesLegales || undefined,
      dateValidite: form.dateValidite || undefined,
    };

    try {
      await updateFip.mutateAsync({ id, data });
      navigate(`/cartographie/processus/${id}`);
    } catch {
      // toast géré par le hook
    }
  };

  const set = (field: keyof FipForm) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse' />
        <div className='h-96 bg-gray-200 dark:bg-gray-700 rounded animate-pulse' />
      </div>
    );
  }

  if (!process) {
    return (
      <div className='text-center py-12'>
        <p className='text-gray-500'>Processus introuvable</p>
        <Link to='/cartographie/processus' className='text-brand-600 hover:underline mt-2 inline-block'>
          Retour à la liste
        </Link>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <PageHeader
        title={`Modifier la FIP — ${process.nom}`}
        description={`${process.codification} · Version actuelle : v${process.versionNumber}`}
        actions={
          <Link
            to={`/cartographie/processus/${id}`}
            className='flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700'>
            <ArrowLeft className='w-4 h-4' />
            Retour au détail
          </Link>
        }
      />

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader title='Objectifs & Périmètre' />
          <div className='p-6 space-y-4'>
            <TextArea
              label='Axes stratégiques'
              value={form.axesStrategiques}
              onChange={set('axesStrategiques')}
              placeholder="Axes stratégiques auxquels ce processus contribue"
            />
            <TextArea
              label='Finalité(s)'
              value={form.finalites}
              onChange={set('finalites')}
              placeholder="Objectifs du processus (verbes d'action)"
            />
          </div>
        </Card>

        <Card className='mt-6'>
          <CardHeader title='Flux : Entrées → Activités → Sorties' />
          <div className='p-6 grid grid-cols-1 lg:grid-cols-2 gap-6'>
            <TextArea
              label='Fournisseurs'
              value={form.fournisseurs}
              onChange={set('fournisseurs')}
              placeholder='Qui fournit les entrées nécessaires au processus'
            />
            <TextArea
              label="Éléments d'entrée (Inputs)"
              value={form.elementsEntree}
              onChange={set('elementsEntree')}
              placeholder='Ressources, informations ou matériaux nécessaires'
            />
            <TextArea
              label='Activités'
              value={form.activites}
              onChange={set('activites')}
              placeholder='Acteurs, description, moyens humains/matériels/financiers'
              rows={4}
            />
            <TextArea
              label='Éléments de sortie (Outputs)'
              value={form.elementsSortie}
              onChange={set('elementsSortie')}
              placeholder='Produits, services, livrables générés'
            />
            <TextArea
              label='Clients'
              value={form.clients}
              onChange={set('clients')}
              placeholder='Qui reçoit les sorties du processus'
            />
          </div>
        </Card>

        <Card className='mt-6'>
          <CardHeader title='Conformité & Validité' />
          <div className='p-6 space-y-4'>
            <TextArea
              label='Exigences légales & réglementaires'
              value={form.exigencesLegales}
              onChange={set('exigencesLegales')}
              placeholder='Références réglementaires applicables au processus'
            />
            <div className='max-w-xs'>
              <DatePicker
                label='Date de validité'
                value={form.dateValidite}
                onChange={set('dateValidite')}
              />
            </div>
          </div>
        </Card>

        <div className='mt-6 flex justify-end gap-3'>
          <Link to={`/cartographie/processus/${id}`}>
            <Button type='button' variant='secondary'>
              Annuler
            </Button>
          </Link>
          <Button type='submit' disabled={updateFip.isPending}>
            <Save className='w-4 h-4 mr-2' />
            {updateFip.isPending ? 'Enregistrement...' : 'Enregistrer la FIP'}
          </Button>
        </div>
      </form>
    </div>
  );
}
