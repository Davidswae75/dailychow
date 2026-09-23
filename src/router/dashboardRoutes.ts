import Home from "@/views/app/home.vue";

const dashboardRoutes = [
    {
        path: '/dashboard/home',
        component: Home
    }
].map((d) => ({
    ...d,
    meta: {
        layout: 'dashboard'
    }
}))

export default dashboardRoutes