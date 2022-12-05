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

    <template v-if="changePassword">
      <v-text-field
        type="password"
        v-model="password"
        label="New Password"
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
    </template>

    <v-btn @click="changePassword = !changePassword">
      Change Password </v-btn>

    <v-btn
      :loading="submitting"
      :disabled="!valid"
      color="success"
      @click="updateUser"
    > Update Profile </v-btn>
  </v-form>
</template>
<script lang="ts" setup="setup">
  import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { CommonAPI } from '@/api/common';
import { Passage } from '@/models';
const route = useRoute();
const router = useRouter();
import { UpdateUser } from '@/models';
// import { useAuthStore } from '@/store/auth'

// useAuthorization('/dashbaord', router)

const changePassword = ref(false);
const submitting = ref(false);
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
const { valid, passwordRules, emailRules } = useFormValidation();
// const auth = useAuthStore();

// onMounted(async () => {
//   firstName.value = auth.user.firstName;
//   lastName.value = auth.user.lastName;
//   email.value = auth.user.email;
// });

const confirmPasswordRules = computed(() => [
  ...passwordRules.value,
  (v: string) => v === this.password || 'Passwords do not match',
]);

async function updateUser() {
  submitting.value = true;
  try {
    let api = new CommonAPI('users');
    let data: UpdateUser = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
    }
    if (changePassword && password) {
      data.password = password;
    }
    let updatedUser = await api.update(user._id, data);
		// authStore.setUser(updatedUser);

  } catch(e) { console.error(e) }
  submitting.value = false;
}
</script>
