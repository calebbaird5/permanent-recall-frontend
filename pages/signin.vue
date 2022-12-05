<template>
  <v-form v-model="valid">
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

    <v-btn v-if="submitting" color="success">
      <v-progress-circular indeterminate color="black" /> </v-btn>
    <v-btn v-else :disabled="!valid" color="success" @click="signin">
      Sign In</v-btn>

    <v-btn @click="router.push('/register')">Register</v-btn>
  </v-form>
</template>

<script lang="ts" setup="setup">
	import { ref, computed } from 'vue'
import type { Ref } from 'vue'

import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();

import { useRouter, useRoute } from 'vue-router'
import { CommonAPI } from '../api/common';
const route = useRoute();
const router = useRouter();

const email = ref('');
const password = ref('');
const submitting = ref(false);

const { valid, passwordRules, emailRules } = useFormValidation();

async function signin() {
  submitting.value = true;
  try {
    let api = new CommonAPI('auth/login');
    let result = await api.create({
      email: email.value,
      password: password.value,
    });
		console.log('result',result)

		let d = new Date();
		d.setTime(d.getTime() + result.expiresIn);
    authStore.login(result.user, result.token, d);

    let redirect  = '/dashboard';
    if (route.query.redirect && !Array.isArray(route.query.redirect)) {
      redirect = route.query.redirect as string;
    }
    router.push(redirect);
  } catch(e) { console.error(e) }
  submitting.value = false;
};
</script>
