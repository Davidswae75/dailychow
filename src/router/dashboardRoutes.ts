import Foods from "@/views/app/Foods/index.vue";
import History from "@/views/app/History.vue";
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
    },
    {
        path: '/dashboard/history',
        component: History
    },
    {
        path: '/dashboard/foods',
        component: Foods
    }
].map((d) => ({
    ...d,
    meta: {
        layout: 'dashboard'
    }
}))

export default dashboardRoutes