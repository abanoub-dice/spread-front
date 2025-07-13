import { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import type { ActionItem } from '../types';
import ActionItemCard from './ActionItemCard';

interface ActionItemsListProps {
  items: ActionItem[];
  completed?: boolean;
  onEdit?: (item: ActionItem) => void;
  listLabel: string;
}

export default function ActionItemsList({
  items,
  completed = false,
  onEdit,
  listLabel,
}: ActionItemsListProps) {
  const [animatingId, setAnimatingId] = useState<number | null>(null);

  const handleCheck = (id: number) => {
    setAnimatingId(id);
    setTimeout(() => {
      setAnimatingId(null);
    }, 500);
  };

  return (
    <Box flex={1} p={2} borderRadius={3} border={1} borderColor="divider">
      <Typography
        variant="h2"
        mb={2}
        sx={{
          position: 'relative',
          display: 'inline-block',
        }}
      >
        {listLabel}
      </Typography>
      <Stack spacing={2}>
        {items.map(item => (
          <ActionItemCard
            key={item.id}
            item={item}
            completed={completed}
            onCheck={handleCheck}
            animation={animatingId === null || animatingId === item.id}
            {...(!completed && onEdit ? { onEdit } : {})}
          />
        ))}
      </Stack>
    </Box>
  );
}
