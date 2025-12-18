import { Injectable, Logger } from '@nestjs/common';
import { WorkflowState } from './LangGraphInterface';

/**
 * State Manager - State persistence and history for workflows
 */
@Injectable()
export class StateManager {
  private readonly logger = new Logger(StateManager.name);
  private stateStore = new Map<string, WorkflowState[]>(); // workflowId -> state history
  private currentStates = new Map<string, WorkflowState>(); // workflowId -> current state

  /**
   * Save workflow state
   */
  async saveState(workflowId: string, state: WorkflowState): Promise<void> {
    try {
      // Save to current states
      this.currentStates.set(workflowId, { ...state });

      // Add to history
      if (!this.stateStore.has(workflowId)) {
        this.stateStore.set(workflowId, []);
      }

      const history = this.stateStore.get(workflowId)!;
      history.push({
        ...state,
        _timestamp: new Date(),
      });

      // Keep only last 100 states in history
      if (history.length > 100) {
        this.stateStore.set(workflowId, history.slice(-100));
      }

      this.logger.debug(`State saved for workflow ${workflowId}`);
    } catch (error) {
      this.logger.error(`Failed to save state for workflow ${workflowId}:`, error);
      throw error;
    }
  }

  /**
   * Get current workflow state
   */
  async getState(workflowId: string): Promise<WorkflowState | null> {
    const state = this.currentStates.get(workflowId);
    return state ? { ...state } : null;
  }

  /**
   * Get workflow state history
   */
  async getStateHistory(workflowId: string): Promise<WorkflowState[]> {
    const history = this.stateStore.get(workflowId) || [];
    return [...history];
  }

  /**
   * Get state at specific version
   */
  async getStateVersion(workflowId: string, version: number): Promise<WorkflowState | null> {
    const history = this.stateStore.get(workflowId);
    
    if (!history || version < 0 || version >= history.length) {
      return null;
    }

    return { ...history[version] };
  }

  /**
   * Create state snapshot
   */
  async createSnapshot(workflowId: string, name: string): Promise<void> {
    const state = this.currentStates.get(workflowId);

    if (!state) {
      throw new Error(`No state found for workflow ${workflowId}`);
    }

    const snapshot = {
      ...state,
      _snapshotName: name,
      _snapshotTimestamp: new Date(),
    };

    // Save snapshot
    if (!this.stateStore.has(`${workflowId}:snapshots`)) {
      this.stateStore.set(`${workflowId}:snapshots`, []);
    }

    const snapshots = this.stateStore.get(`${workflowId}:snapshots`)!;
    snapshots.push(snapshot);

    this.logger.log(`Snapshot '${name}' created for workflow ${workflowId}`);
  }

  /**
   * Restore state from snapshot
   */
  async restoreSnapshot(workflowId: string, name: string): Promise<WorkflowState> {
    const snapshots = this.stateStore.get(`${workflowId}:snapshots`) || [];
    const snapshot = snapshots.find((s) => s._snapshotName === name);

    if (!snapshot) {
      throw new Error(`Snapshot '${name}' not found for workflow ${workflowId}`);
    }

    // Restore state
    const { _snapshotName, _snapshotTimestamp, ...state } = snapshot;
    this.currentStates.set(workflowId, state);

    this.logger.log(`Snapshot '${name}' restored for workflow ${workflowId}`);

    return { ...state };
  }

  /**
   * Clear workflow state
   */
  async clearState(workflowId: string): Promise<void> {
    this.currentStates.delete(workflowId);
    this.stateStore.delete(workflowId);
    this.stateStore.delete(`${workflowId}:snapshots`);

    this.logger.log(`State cleared for workflow ${workflowId}`);
  }

  /**
   * Get all workflow IDs with state
   */
  async getAllWorkflowIds(): Promise<string[]> {
    return Array.from(this.currentStates.keys());
  }

  /**
   * Get state statistics
   */
  async getStats(workflowId: string): Promise<{
    currentStateSize: number;
    historyLength: number;
    snapshotCount: number;
  }> {
    const currentState = this.currentStates.get(workflowId);
    const history = this.stateStore.get(workflowId) || [];
    const snapshots = this.stateStore.get(`${workflowId}:snapshots`) || [];

    return {
      currentStateSize: currentState ? JSON.stringify(currentState).length : 0,
      historyLength: history.length,
      snapshotCount: snapshots.length,
    };
  }
}
