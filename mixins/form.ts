import Vue from 'vue';

export default Vue.extend({
  data: () => ({
    valid: false,
    required: [
      (v: string) => !!v || 'This Field is requird',
    ],
    passwordRules: [
      (v: string) => !!v || 'Password is required',
      (v: string) => v.length >= 8 || 'Password must have at least 8 characters',
      (v: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(v) || 'Password must contain 1 UPPER case letter (A-Z), 1 lowercase letter, 1 special character !@#$%^&*, 1 number 0 - 9',
    ],
    emailRules: [
      (v: string) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
    ],
  })
})
