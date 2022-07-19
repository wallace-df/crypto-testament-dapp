import { createApp } from "vue";
import { createWebHistory, createRouter } from "vue-router";

import App from "./vue/App.vue";
import AdminPage from "./vue/components/AdminPage.vue";
import UserPage from "./vue/components/UserPage.vue";
import NotFoundPage from "./vue/components/NotFoundPage.vue";

//import Wallet from "./js/wallet.js";

async function load() {
//    await Wallet.connect();

    const routes = [
        { path: "", component: UserPage },
        { path: "/admin", component: AdminPage },
        { path: "/404", component: NotFoundPage },
        { path: "/:pathMatch(.*)", redirect: "/404" },
    ];
    
    const router = createRouter({
        history: createWebHistory(),
        routes
    });

    const app = createApp(App);
    app.use(router);
    app.mount("#app")
}

load();
