import { useAuthStore } from "@/stores/auth";

export default defineNuxtRouteMiddleware(async (to) => {
	const app = useNuxtApp();
	const auth = useAuthStore(app.$pinia);
	if (!auth.loggedIn || !auth.token || !auth.user
		|| new Date() > auth.expires) {
		return navigateTo(`/signin?redirect=${to.path}`)
	}
})
