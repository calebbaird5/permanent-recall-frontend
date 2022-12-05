import { useAuthStore } from "@/store/auth";
import type { Router } from 'vue-router';

export async function useAuthorization(currentPage: string, router: Router) {
	// const auth = useAuthStore();

	// if (!auth.loggedIn || !auth.token || !auth.user
	// 	|| (auth.expires && new Date() > new Date(auth.expires))) {
	// 	router.push(`/signin?redirect=${currentPage}`);
	// }
	// return auth;
}
