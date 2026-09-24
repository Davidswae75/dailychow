import { defineStore } from "pinia";
import { ref } from "vue";

export type AlertType = "info" | "success" | "error" | "warning";

export type AlertPosition =
  | "top"
  | "top-left"
  | "top-right"
  | "bottom"
  | "bottom-left"
  | "bottom-right";

export interface Alert {
  id: string;
  title?: string;
  message: string;
  type: AlertType;
  position?: AlertPosition;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const useUiStore = defineStore("ui", () => {
  const alerts = ref<Alert[]>([]);
  const timeouts = new Map<string, ReturnType<typeof setTimeout>>();

  function clearAlertTimeout(id: string) {
    const t = timeouts.get(id);
    if (t) {
      clearTimeout(t);
      timeouts.delete(id);
    }
  }

  function scheduleRemoval(id: string, duration: number) {
    clearAlertTimeout(id);
    const timeout = setTimeout(() => {
      removeAlert(id);
    }, duration);
    timeouts.set(id, timeout);
  }

  function addAlert(alert: Omit<Alert, "id">) {
    const id = crypto.randomUUID();

    const newAlert: Alert = {
      id,
      position: alert.position ?? "top",
      duration: alert.duration ?? 4200,
      type: alert.type ?? "info",
      ...alert,
    };

    if(alerts.value.length >= 5) return
    console.log(alerts.value.length)
    alerts.value.push(newAlert);

    if (!newAlert.persistent) {
      scheduleRemoval(id, newAlert.duration!);
    }

    return id;
  }

  function removeAlert(id: string) {
    clearAlertTimeout(id);
    alerts.value = alerts.value.filter((a) => a.id !== id);
  }

  function clearAllAlerts() {
    timeouts.forEach((t) => clearTimeout(t));
    timeouts.clear();
    alerts.value = [];
  }

  const alert = {
    info: (
      message: string,
      options?: Partial<Omit<Alert, "id" | "message" | "type">>
    ) => addAlert({ message, type: "info", ...options }),

    success: (
      message: string,
      options?: Partial<Omit<Alert, "id" | "message" | "type">>
    ) => addAlert({ message, type: "success", ...options }),

    error: (
      message: string,
      options?: Partial<Omit<Alert, "id" | "message" | "type">>
    ) => addAlert({ message, type: "error", ...options }),

    warning: (
      message: string,
      options?: Partial<Omit<Alert, "id" | "message" | "type">>
    ) => addAlert({ message, type: "warning", ...options }),
  };

  return {
    alerts,
    alert,
    addAlert,
    removeAlert,
    clearAllAlerts,
  };
});