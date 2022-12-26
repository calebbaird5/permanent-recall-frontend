<template>
  <v-row justify="center" align="center">
    <v-col cols="12" align="center">
			<!-- TODO Figure out why the props editing and passage are required -->
			<UpsertPassage
				class="create"
				@passageCreated="addPassage"
				:editing="false"
				:passage="null"
				:allowImport="false"
				/>
    </v-col>
		<v-col cols="12">
			<v-card-title> Today's Review List </v-card-title>
			<v-divider />
			<PassageReviewList :key="key" />
		</v-col>
  </v-row>
</template>

<script lang="ts" setup="setup">
  definePageMeta({middleware: 'auth'});

// I couldn't figure out how to get a template ref to work so I'm just
// forcing the component to re-render by changing the key.
const key = ref(0);
function addPassage(passage: Passage) {
	key.value++;
}
</script>
