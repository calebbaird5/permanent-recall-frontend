<template>
	<v-app dark>
		<v-navigation-drawer v-model="menuDrawer" :temporary="true" >
			<v-list>
				<v-list-item
					v-for="(item, i) in menuItems"
					@click="clickItem(item)"
					:to="item.to"
					:key="i"
					router
					exact
					>
					{{ item.title }}
				</v-list-item>
			</v-list>
		</v-navigation-drawer>

		<v-app-bar fixed app >
			<v-app-bar-nav-icon @click.stop="menuDrawer = !menuDrawer" />
			<v-toolbar-title v-text="pageTitle" />
			<v-spacer />
			<v-avatar
				v-if="auth.loggedIn && auth.user"
				color="#555"
				@click="profileDrawer = !profileDrawer"
				>
				<img v-if="auth.user.profile" src="auth.user.profile" alt="Profile" />
				<span v-else> {{ userInitials }}</span>
			</v-avatar>
		</v-app-bar>

		<v-navigation-drawer v-model="profileDrawer" location="right" :temporary="true" >
			<v-list>
				<v-list-item
					v-for="(item, i) in profileItems"
					@click="clickItem(item)"
					:to="item.to"
					:key="i"
					router
					exact
					>
					{{ item.title }}
				</v-list-item>
			</v-list>
		</v-navigation-drawer>

		<v-main>
			<v-container>
				<slot />
			</v-container>
		</v-main>
	</v-app>
</template>

<script lang="ts" setup="setup">
  import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter();

interface MenuItem {
  title: string;
  to?: string;
  private?: boolean;
  pageTitle?: string
}

const items: Ref<MenuItem[]> = ref([
	{ title: 'Dashboard', to: '/dashboard', private: true },
	{ title: 'Passages', to: '/passages', private: true },
	{ title: 'Welcome', to: '/', private: false, pageTitle: 'Permanent Recall' },
	{ title: 'Sign In', to: '/signin', private: false },
	{ title: 'Register', to: '/register', private: false },
])

const profileItems: Ref<MenuItem[]> = ref([
	{ title: 'Profile', to: '/profile' },
	{ title: 'Settings', to: '/settings' },
	{ title: 'Log Out' },
]);

const menuDrawer = ref(false);
const profileDrawer = ref(false);

const auth = useAuthStore();
const route = useRoute();

const userInitials = computed(() =>
  auth.user.firstName.toUpperCase()[0]
  + auth.user.lastName.toUpperCase()[0]);

const menuItems = computed(() => {
	console.log('auth.loggedIn', auth.loggedIn)
	return items.value.filter(el => !!auth.loggedIn === el.private)
})

const activeItem = computed(() =>
	items.find(el => el.to === route.path));

const pageTitle = computed(() => {
	if (activeItem) {
		return activeItem.pageTitle || activeItem.title
	} else {
		console.error('Could not determine the page title.');
		return 'Permanent Recall';
	}
});

function clickItem(item: MenuItem) {
	if (item.title === 'Log Out') {
		auth.logout(router);
		router.push('/');
	}
};

</script>

<style lang="scss" scoped>
.v-avatar {
	margin-right: 10px;
}
</style>

<!-- Global styles -->
<style lang="scss">
.no-text-transform {
	text-transform: none;
}
</style>
