<template>
<v-form v-model="valid">
  <v-text-field
    v-model="firstName"
    :rules="required"
    label="First Name"
    required
    />

  <v-text-field
    v-model="lastName"
    :rules="required"
    label="Last Name"
    required
    />

  <v-text-field
    v-model="email"
    :rules="emailRules"
    label="Email"
    required
    />

  <v-text-field
    type="password"
    v-model="password"
    label="Password"
    :rules="passwordRules"
    required
    />

  <v-text-field
    type="password"
    v-model="passwordConfirm"
    label="Confirm Password"
    :rules="confirmPasswordRules"
    required
    />

  <v-btn v-if="submitting" color="success">
    <v-progress-circular indeterminate color="black" /> </v-btn>
  <v-btn v-else :disabled="!valid" color="success" @click="register">
    Register </v-btn>
</v-form>
</template>
<script lang="ts" setup="setup">
	import { CommonAPI } from '../api/common';
import { useRouter, useRoute } from 'vue-router'
const route = useRoute();
const router = useRouter();

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
const submitting = ref(false);

const { valid, passwordRules, emailRules, required } = useFormValidation();
const confirmPasswordRules = computed(() => [
  ...passwordRules.value,
  (v: string) => v === password.value || 'Passwords do not match',
]);

import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore();
async function register() {
  submitting.value = true;

  try {
    let api = new CommonAPI('auth/register');
    let result = await api.create({
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
    });

    auth.login(result.user, result.token, new Date(result.expires));
    let redirect  = '/dashboard';
    if (route.query.redirect && !Array.isArray(route.query.redirect)) {
      redirect = route.query.redirect as string;
    }
    router.push(redirect);
  } catch(e) { console.error(e) }
  submitting.value = false;
}
</script>
