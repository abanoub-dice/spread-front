import { Box, Button, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { Add as AddIcon } from '@mui/icons-material';
import { FactoryVisitModal } from './components/FactoryVisitModal';
import { FactoryVisitSkeleton } from './components/FactoryVisitSkeleton';
import { FactoryVisitForm } from './components/FactoryVisitForm';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '~/utils/api/axiosInstance';
import type { FactoryVisit } from './types';
import { DropdownField } from '~/components/form/DropdownField';
import dayjs from '~/utils/date/dayjs';

export default function FactoryVisits() {
  const { id } = useParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVisitId, setSelectedVisitId] = useState<string>('');

  const { data: factoryVisits, isLoading } = useQuery<FactoryVisit[]>({
    queryKey: ['factory-visits'],
    queryFn: async () => {
      const response = await axiosInstance.get(`/v1/projects/${id}/factory-visits`);
      return response.data;
    },
  });

  const { dropdownOptions, defaultSelectedId } = useMemo(() => {
    if (!factoryVisits?.length) {
      return { dropdownOptions: [], defaultSelectedId: '' };
    }

    const options = factoryVisits.map(visit => ({
      label: `${visit.factoryName} - ${dayjs(visit.date).format('MM/DD/YYYY')}`,
      value: visit.id.toString()
    }));

    return {
      dropdownOptions: options,
      defaultSelectedId: options[0].value
    };
  }, [factoryVisits]);

  const selectedVisit = factoryVisits?.find(visit => visit.id.toString() === (selectedVisitId || defaultSelectedId));

  return (
    <Box>
      <Box mb={2} display="flex" justifyContent="space-between">
        <Typography variant="h1">Factory Visits</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setModalOpen(true)}
          sx={{ textTransform: 'capitalize' }}
        >
          Add Factory Visit
        </Button>
      </Box>

      {!isLoading && factoryVisits && factoryVisits.length > 0 && (
        <Box mb={3} width="50%">
          <DropdownField
            label="Select Factory Visit"
            name="factoryVisit"
            options={dropdownOptions}
            value={selectedVisitId || defaultSelectedId}
            onChange={(e) => setSelectedVisitId(e.target.value)}
            placeholder="All Factory Visits"
          />
        </Box>
      )}

      <FactoryVisitModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        projectId={Number(id)}
      />

      {isLoading ? (
        <Box display="flex" flexDirection="column" gap={2}>
          <FactoryVisitSkeleton />
        </Box>
      ) : factoryVisits?.length === 0 ? (
        <Typography variant="body1" color="text.secondary" textAlign="center" py={4}>
          No factory visits created yet
        </Typography>
      ) : (selectedVisitId || defaultSelectedId) ? (
        <Box display="flex" flexDirection="column" gap={2}>
          {selectedVisit && (
            <FactoryVisitForm key={selectedVisit.id} visit={selectedVisit} projectId={Number(id)} />
          )}
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" gap={2}>
          {factoryVisits?.map(visit => (
            <FactoryVisitForm key={visit.id} visit={visit} projectId={Number(id)} />
          ))}
        </Box>
      )}
    </Box>
  );
}

export function meta() {
  return [
    { title: 'Factory Visits' },
    { name: 'description', content: 'Track the factory visits' },
  ];
}
