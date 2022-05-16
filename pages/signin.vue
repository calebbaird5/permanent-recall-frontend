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

    <v-btn :disabled="!valid" color="success" @click="signin">
      Sign In</v-btn>
    <v-btn @click="$router.push('/register')">Register</v-btn>
  </v-form>
</template>
<script lang="ts">
  import Vue from 'vue';
  import FormMixin from '@/mixins/form';
  import { mapMutations } from 'vuex';
  import { CommonAPI } from '../api/common';

  export default Vue.extend({
    name: 'Signin',
    mixins: [FormMixin],

    data() {
      return {
        email: '',
        password: '',
        submitting: false,
      };
    },

    mounted() {
      this.setPageTitle('Signin');
    },

    methods: {
      ...mapMutations({
        setPageTitle: 'general/setPageTitle'
      }),

      async signin() {
        this.submitting = true;
        try {
          let api = new CommonAPI('users');
        } catch(e) { console.error(e) }
        this.submitting = false;
      },
    }
  })
</script>
