import React from 'react';
import { Box, Text } from 'ink';

interface RegistryStatusProps {
  isConnected: boolean;
}

/**
 * Registry connection status indicator
 * Shows current connectivity state to registry service
 *
 * @see docs/ARCHITECTURE.md#Registry_Connection
 */
export function RegistryStatus({ isConnected }: RegistryStatusProps): JSX.Element {
  const statusIcon = isConnected ? '🟢' : '🔴';
  const statusText = isConnected ? 'Connected' : 'Disconnected';
  const statusColor = isConnected ? 'green' : 'red';

  return (
    <Box marginY={1}>
      <Text color={statusColor}>
        {statusIcon} Registry: {statusText}
      </Text>
    </Box>
  );
}
