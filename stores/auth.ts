import { defineStore } from 'pinia'
import { User } from '@/models/user.model';
import { useSettingsStore } from '@/stores/settings'

export const useAuthStore = defineStore({
	id: 'auth-store',
	state: () => {
		return {
			token: '',
			loggedIn: false,
			user: null as User | null,
			expires: new Date(0),
		}
	},
	actions: {
		login(user: User, token: string, expires: Date) {
			this.user = user;
			this.token = token;
			this.expires = expires;
			this.loggedIn = true;
			const settings = useSettingsStore();
			settings.loadUserSettings();
		},

		logout() {
			this.user = null;
			this.token = '';
			this.expires = new Date(0);
			this.loggedIn = false;
			const settings = useSettingsStore();
			settings.resetUserSettings();
		},

		setUser(user: User) {
			this.user = user;
		}
	},
	getters: {},
})
