import { ref, computed } from 'vue'


export function useFormValidation() {
  const valid = ref(false);
  const required = ref([
    (v: string) => !!v || 'This Field is requird'
  ]);

  const passwordRules = ref([
    (v: string) => !!v || 'Password is required',
    (v: string) => v.length >= 8 || 'Password must have at least 8 characters',
    (v: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(v) || 'Password must contain 1 UPPER case letter (A-Z), 1 lowercase letter, 1 special character !@#$%^&*, 1 number 0 - 9',
  ]);

  const emailRules = ref([
    (v: string) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
  ]);

  return {
    valid,
    required,
    passwordRules,
    emailRules,
  }
}
