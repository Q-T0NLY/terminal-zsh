import React, { useState } from 'react';
import { Box, Text } from 'ink';
import { RegistryStatus } from './components/RegistryStatus';
import { LayoutSelector } from './components/LayoutSelector';

export enum Layout {
  COMMAND_DECK = 'command-deck',
  NEURAL_MATRIX = 'neural-matrix',
  TEMPORAL_FABRIC = 'temporal-fabric',
  QUANTUM_FIELD = 'quantum-field',
}

interface AppState {
  currentLayout: Layout;
  isLoading: boolean;
  registryConnected: boolean;
}

/**
 * Main Ink/React TUI application for Hyper Registry
 * Provides multiple switchable visual layouts for registry operations
 *
 * @module index
 * @see docs/ARCHITECTURE.md#TUI_Layouts
 */
export function App(): JSX.Element {
  const [state, setState] = useState<AppState>({
    currentLayout: Layout.COMMAND_DECK,
    isLoading: true,
    registryConnected: false,
  });

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="cyan">
          🌌 Hyper Registry TUI {process.env.npm_package_version}
        </Text>
      </Box>

      <LayoutSelector
        currentLayout={state.currentLayout}
        onLayoutChange={(layout) =>
          setState((s) => ({ ...s, currentLayout: layout }))
        }
      />

      <RegistryStatus isConnected={state.registryConnected} />

      {/* Layout renderers - dynamically switch based on state.currentLayout */}
      {state.currentLayout === Layout.COMMAND_DECK && (
        <CommandDeckLayout />
      )}
      {state.currentLayout === Layout.NEURAL_MATRIX && (
        <NeuralMatrixLayout />
      )}
      {state.currentLayout === Layout.TEMPORAL_FABRIC && (
        <TemporalFabricLayout />
      )}
      {state.currentLayout === Layout.QUANTUM_FIELD && (
        <QuantumFieldLayout />
      )}
    </Box>
  );
}

/**
 * Command Deck Layout - Primary command/control interface
 * Lists artifacts, namespaces, and provides quick search/filter
 */
function CommandDeckLayout(): JSX.Element {
  return (
    <Box flexDirection="column" marginTop={1}>
      <Text bold color="green">
        📋 Command Deck
      </Text>
      <Text dimColor>Placeholder: Command interface coming soon</Text>
    </Box>
  );
}

/**
 * Neural Matrix Layout - Graph visualization of artifacts/dependencies
 * Shows relationships and dependency networks
 */
function NeuralMatrixLayout(): JSX.Element {
  return (
    <Box flexDirection="column" marginTop={1}>
      <Text bold color="magenta">
        🧠 Neural Matrix
      </Text>
      <Text dimColor>Placeholder: Graph visualization coming soon</Text>
    </Box>
  );
}

/**
 * Temporal Fabric Layout - Timeline/history view
 * Shows operation history, changes, and audit trail
 */
function TemporalFabricLayout(): JSX.Element {
  return (
    <Box flexDirection="column" marginTop={1}>
      <Text bold color="yellow">
        ⏳ Temporal Fabric
      </Text>
      <Text dimColor>Placeholder: Timeline view coming soon</Text>
    </Box>
  );
}

/**
 * Quantum Field Layout - Real-time metrics and system state
 * Shows performance, resource usage, and system health
 */
function QuantumFieldLayout(): JSX.Element {
  return (
    <Box flexDirection="column" marginTop={1}>
      <Text bold color="blue">
        ⚛️ Quantum Field
      </Text>
      <Text dimColor>Placeholder: Metrics dashboard coming soon</Text>
    </Box>
  );
}

export default App;
