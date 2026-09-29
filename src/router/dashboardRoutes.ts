import Home from "@/views/app/home.vue";
import Pick from "@/views/app/Pick.vue";
import Planner from "@/views/app/Planner.vue";
import Preferences from "@/views/app/Preferences.vue";

const dashboardRoutes = [
    {
        path: '/dashboard/home',
        component: Home
    }, 
    {
        path: '/dashboard/planner',
        component: Planner
    },
    {
        path: '/dashboard/pick',
        component: Pick
    },
    {
        path: '/dashboard/preferences',
        component: Preferences
    }
].map((d) => ({
    ...d,
    meta: {
        layout: 'dashboard'
    }
}))

export default dashboardRoutes