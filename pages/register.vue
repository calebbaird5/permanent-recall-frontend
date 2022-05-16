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

    <v-btn v-if="submitting">
      <v-progress-circular
        indeterminate
        color="primary"
      ></v-progress-circular>
    </v-btn>
    <v-btn v-else :disabled="!valid" color="success" @click="register">
      Register </v-btn>

  </v-form>
</template>
<script lang="ts">
  import Vue from 'vue';
  import FormMixin from '@/mixins/form';
  import { mapMutations } from 'vuex'
  import { CommonAPI } from '../api/common';

  export default Vue.extend({
    name: 'Register',
    mixins: [FormMixin],

    data() {
      return {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordConfirm: '',
        submitting: false,
      };
    },

    computed: {
      confirmPasswordRules() {
        return [
          ...this.passwordRules,
          (v: string) => v === this.password || 'Passwords do not match',
        ];
      },
    },

    mounted() {
      this.setPageTitle('Register');
    },

    methods: {
      ...mapMutations({
        setPageTitle: 'general/setPageTitle'
      }),

      async register() {
        this.submitting = true;
        try {
          let api = new CommonAPI('users');
          let createdUser = await api.create({
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            password: this.password,
          })
        } catch(e) { console.error(e) }
        this.submitting = false;
      },
    }
  })
</script>
