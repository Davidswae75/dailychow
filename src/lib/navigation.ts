/** The dashboard's destinations, shared by the sidebar and the mobile bottom bar. */
import type { Component } from "vue";
import { Archive, CalendarDays, Clock, LayoutDashboard, Settings, Sparkles } from "@lucide/vue";

export interface NavItem {
  name: string;
  to: string;
  icon: Component;
  /** Shown in the mobile bottom bar (Preferences sits behind the avatar instead) */
  mobile: boolean;
}

export const navItems: NavItem[] = [
  { name: "Home", to: "/dashboard/home", icon: LayoutDashboard, mobile: true },
  { name: "Pick", to: "/dashboard/pick", icon: Sparkles, mobile: true },
  { name: "Foods", to: "/dashboard/foods", icon: Archive, mobile: true },
  { name: "Planner", to: "/dashboard/planner", icon: CalendarDays, mobile: true },
  { name: "History", to: "/dashboard/history", icon: Clock, mobile: true },
  { name: "Preferences", to: "/dashboard/preferences", icon: Settings, mobile: false },
];

/** A nav item is active on its own page and on pages nested under it. */
export const isActivePath = (current: string, to: string) => current === to || current.startsWith(`${to}/`);
