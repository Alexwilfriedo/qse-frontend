import { Button, DatePicker, Input, Modal, Select } from '@/components/ui';
import { useUsers } from '@/features/admin/hooks/useUsers';
import { useEntityTree } from '@/features/cartography/hooks';
import { getEntityTypeLabel, type EntityTreeNode } from '@/features/cartography/types';
import { ImagePlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import type {
  Auditor,
  AuditorLevel,
  CreateAuditorRequest,
  Domaine,
  UpdateAuditorRequest,
} from '../types';

const LEVEL_OPTIONS = [
  { value: 'JUNIOR', label: 'Junior' },
  { value: 'CONFIRME', label: 'Confirmé' },
  { value: 'LEAD', label: 'Lead' },
];

const DOMAINE_OPTIONS: { value: Domaine; label: string }[] = [
  { value: 'QUALITE', label: 'Qualité' },
  { value: 'SECURITE', label: 'Sécurité' },
  { value: 'ENVIRONNEMENT', label: 'Environnement' },
];

const NORME_OPTIONS = ['ISO 9001', 'ISO 14001', 'ISO 45001'];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    data: CreateAuditorRequest | UpdateAuditorRequest,
    photoFile?: File | null,
  ) => void;
  isPending: boolean;
  auditor?: Auditor | null;
}

export function CreateAuditorModal({
  isOpen,
  onClose,
  onSave,
  isPending,
  auditor,
}: Props) {
  const { data: users } = useUsers();
  const { data: entityTree } = useEntityTree();
  const [userId, setUserId] = useState('');
  const [auditorCode, setAuditorCode] = useState('');
  const [matricule, setMatricule] = useState('');
  const [directionService, setDirectionService] = useState('');
  const [professionalPhone, setProfessionalPhone] = useState('');
  const [level, setLevel] = useState<AuditorLevel>('JUNIOR');
  const [domaines, setDomaines] = useState<Domaine[]>([]);
  const [normes, setNormes] = useState<string[]>([]);
  const [dateDerniereFormationAuditInterne, setDateDerniereFormationAuditInterne] =
    useState('');
  const [certificationsExternes, setCertificationsExternes] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const isEditMode = !!auditor;

  const selectedUser = users?.find((user) => user.id === userId);
  const directionServiceOptions = [
    { value: '', label: 'Sélectionner une direction / un service' },
    ...flattenEntityTree(entityTree ?? [])
      .filter((entity) =>
        ['DIRECTION', 'SERVICE', 'DEPARTEMENT'].includes(entity.type),
      )
      .sort((a, b) => a.nom.localeCompare(b.nom, 'fr'))
      .map((entity) => ({
        value: entity.nom,
        label: `${entity.nom} (${getEntityTypeLabel(entity.type)})`,
      })),
  ];

  const reset = () => {
    setUserId(auditor?.userId ?? '');
    setAuditorCode(auditor?.auditorCode ?? '');
    setMatricule(auditor?.matricule ?? '');
    setDirectionService(auditor?.directionService ?? '');
    setProfessionalPhone(auditor?.professionalPhone ?? '');
    setLevel(auditor?.level ?? 'JUNIOR');
    setDomaines(auditor?.perimetreDomaines ?? []);
    setNormes(auditor?.perimetreNormes ?? []);
    setDateDerniereFormationAuditInterne(
      auditor?.dateDerniereFormationAuditInterne ?? '',
    );
    setCertificationsExternes(auditor?.certificationsExternes ?? '');
    setPhotoFile(null);
  };

  useEffect(() => {
    if (isOpen) {
      setUserId(auditor?.userId ?? '');
      setAuditorCode(auditor?.auditorCode ?? '');
      setMatricule(auditor?.matricule ?? '');
      setDirectionService(auditor?.directionService ?? '');
      setProfessionalPhone(auditor?.professionalPhone ?? '');
      setLevel(auditor?.level ?? 'JUNIOR');
      setDomaines(auditor?.perimetreDomaines ?? []);
      setNormes(auditor?.perimetreNormes ?? []);
      setDateDerniereFormationAuditInterne(
        auditor?.dateDerniereFormationAuditInterne ?? '',
      );
      setCertificationsExternes(auditor?.certificationsExternes ?? '');
      setPhotoFile(null);
    }
  }, [auditor, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      auditorCode,
      matricule: matricule || undefined,
      directionService: directionService || undefined,
      professionalPhone: professionalPhone || undefined,
      level,
      perimetreDomaines: domaines.length > 0 ? domaines : undefined,
      perimetreNormes: normes.length > 0 ? normes : undefined,
      dateDerniereFormationAuditInterne:
        dateDerniereFormationAuditInterne || undefined,
      certificationsExternes: certificationsExternes || undefined,
    };

    if (isEditMode) {
      onSave(payload, photoFile);
    } else {
      onSave({
        userId,
        ...payload,
      }, photoFile);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const toggleDomaine = (d: Domaine) => {
    setDomaines((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d],
    );
  };

  const toggleNorme = (n: string) => {
    setNormes((prev) =>
      prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n],
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? "Modifier l'auditeur" : 'Nouvel auditeur'}
      size='lg'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <UserSelect value={userId} onChange={setUserId} disabled={isEditMode} />

        {selectedUser && (
          <div className='grid grid-cols-2 gap-4'>
            <Input
              label='Nom et prénoms'
              value={`${selectedUser.firstName} ${selectedUser.lastName}`}
              readOnly
            />
            <Input label='E-mail' value={selectedUser.email} readOnly />
          </div>
        )}

        <div className='rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4'>
          <label className='mb-2 block text-sm font-medium text-gray-700'>
            Photo de l&apos;auditeur
          </label>
          <label className='flex cursor-pointer items-center gap-3 rounded-lg border border-white bg-white px-4 py-3 text-sm text-gray-700 shadow-sm transition-colors hover:bg-gray-50'>
            <ImagePlus className='h-4 w-4 text-gray-500' />
            <span>
              {photoFile
                ? photoFile.name
                : auditor?.hasPhoto
                  ? 'Remplacer la photo existante'
                  : 'Choisir une photo'}
            </span>
            <input
              type='file'
              accept='image/*'
              className='hidden'
              onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
            />
          </label>
          {auditor?.hasPhoto && !photoFile ? (
            <p className='mt-2 text-xs text-gray-500'>Une photo est déjà enregistrée.</p>
          ) : null}
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <Input
            label='ID Auditeur'
            placeholder='Ex: AUD-001'
            value={auditorCode}
            onChange={(e) => setAuditorCode(e.target.value.toUpperCase())}
            required
          />
          <Input
            label="N° matricule de l'auditeur"
            placeholder='Matricule'
            value={matricule}
            onChange={(e) => setMatricule(e.target.value)}
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <Select
            label='Direction / Service'
            options={directionServiceOptions}
            value={directionService}
            onChange={(e) => setDirectionService(e.target.value)}
            searchable
          />
          <Input
            label='Téléphone professionnel'
            value={professionalPhone}
            onChange={(e) => setProfessionalPhone(e.target.value)}
          />
        </div>

        <Select
          label="Statut d'auditeur"
          required
          options={LEVEL_OPTIONS}
          value={level}
          onChange={(e) => setLevel(e.target.value as AuditorLevel)}
        />

        <div>
          <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Périmètre domaines
          </label>
          <div className='flex gap-2'>
            {DOMAINE_OPTIONS.map((d) => (
              <button
                key={d.value}
                type='button'
                onClick={() => toggleDomaine(d.value)}
                className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${
                  domaines.includes(d.value)
                    ? 'bg-brand-500 text-white border-brand-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}>
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Périmètre normes
          </label>
          <div className='flex gap-2'>
            {NORME_OPTIONS.map((n) => (
              <button
                key={n}
                type='button'
                onClick={() => toggleNorme(n)}
                className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${
                  normes.includes(n)
                    ? 'bg-brand-500 text-white border-brand-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}>
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <DatePicker
            label='Date de la dernière formation "Audit Interne"'
            value={dateDerniereFormationAuditInterne}
            onChange={setDateDerniereFormationAuditInterne}
          />
          <Input
            label='Certifications externes'
            placeholder='Ex: Certifié IRCA, ICA'
            value={certificationsExternes}
            onChange={(e) => setCertificationsExternes(e.target.value)}
          />
        </div>

        <div className='flex justify-end gap-3 pt-2'>
          <Button variant='secondary' type='button' onClick={handleClose}>
            Annuler
          </Button>
          <Button type='submit' disabled={isPending || !userId || !auditorCode}>
            {isPending
              ? isEditMode
                ? 'Enregistrement...'
                : 'Création...'
              : isEditMode
                ? 'Enregistrer'
                : 'Créer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function flattenEntityTree(nodes: EntityTreeNode[]): EntityTreeNode[] {
  return nodes.flatMap((node) => [node, ...flattenEntityTree(node.children)]);
}

function UserSelect({
  value,
  onChange,
  disabled = false,
}: {
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
}) {
  const { data: users } = useUsers();

  const userOptions =
    users?.map((u) => ({
      value: u.id,
      label: `${u.firstName} ${u.lastName}`,
      description: u.email,
    })) ?? [];

  return (
    <Select
      label='Utilisateur'
      required
      searchable
      placeholder='Rechercher un utilisateur...'
      options={userOptions}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
  );
}
