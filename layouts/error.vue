<template>
  <v-app dark>
    <h1 v-if="error.statusCode === 404"> {{ pageNotFound }} </h1>
    <h1 v-else> {{ otherError }} </h1>
    <NuxtLink to="/"> Home page </NuxtLink>
  </v-app>
</template>

<script lang="ts" setup="setup">
const props = defineProps({
  error: Error,
})

const pageNotFound = ref('404 Not Found');
const otherError = ref('An error occurred');

useMeta({
  title: error.statusCode === 404 ? pageNotFound : otherError,
});
</script>

<style lang="scss" scoped>
h1 { font-size: 20px; }
</style>
