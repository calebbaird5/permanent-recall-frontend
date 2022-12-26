<template>
  <v-row justify="center" align="center">
    <v-col>
      <v-card>
        <v-card-title class="headline">
          Welcome to Permanent Recall
        </v-card-title>
        <v-card-text>
          <p>
						<v-btn @click="router.push('/signin')">Login</v-btn>
            or
						<v-btn @click="router.push('/register')">Register</v-btn>
						to get started
					</p>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup="setup">
	import { useRouter } from 'vue-router'
const router = useRouter();
</script>
