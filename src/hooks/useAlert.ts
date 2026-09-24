import { useUiStore, type Alert, type AlertPosition, type AlertType } from "@/store/ui";

// Re-export types for backwards compatibility
export type { Alert, AlertPosition, AlertType };

/**
 * Backwards-compatible hook that delegates to the Pinia ui store.
 * All alerts now use the shared Pinia state (useUiStore).
 */
export function useAlert() {
  const ui = useUiStore();

  return {
    // reactive list of current alerts
    alertArray: ui.alerts,

    // methods
    alert: ui.alert,
    addAlert: ui.addAlert,
    removeAlert: ui.removeAlert,
    clearAll: ui.clearAllAlerts,
  };
}