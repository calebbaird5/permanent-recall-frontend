<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" fixed app >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar fixed app >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="pageTitle" />
    </v-app-bar>

    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    data: () => ({
      drawer: false,
      items: [
        {title: 'Welcome', to: '/'},
        {title: 'signin', to: '/signin'},
        {title: 'register', to: '/register'},
      ],
      right: true,
      rightDrawer: false,
    }),

    computed: {
      pageTitle() {
        return this.$store.state.general.pageTitle;
      }
    }
  })
</script>
