import React from 'react';
import { Box, Text } from 'ink';
import { Layout } from '../index';

interface LayoutSelectorProps {
  currentLayout: Layout;
  onLayoutChange: (layout: Layout) => void;
}

/**
 * Layout selector component with keyboard shortcuts
 * Allows switching between visual modes
 *
 * @see docs/ARCHITECTURE.md#Visual_Layouts
 */
export function LayoutSelector({
  currentLayout,
  onLayoutChange,
}: LayoutSelectorProps): JSX.Element {
  return (
    <Box flexDirection="column" borderStyle="round" borderColor="cyan" paddingX={1}>
      <Text bold color="cyan">
        Layout: {currentLayout.toUpperCase()}
      </Text>
      <Text dimColor fontSize="small">
        Press (1) Command Deck | (2) Neural | (3) Temporal | (4) Quantum
      </Text>
    </Box>
  );
}
