<template>
	<v-progress-circular v-if="loading" indeterminate color="black" />
	<PassageReview v-else :passage="passage" />
</template>

<script lang="ts" setup="setup">
	definePageMeta({middleware: ['auth']});
import type { Ref } from 'vue';
import { CommonAPI } from '@/api/common';
import { Passage } from '@/models';
import { useRoute } from 'vue-router'

const passage: Ref<Passage> = ref([]);
const loading = ref(false);
const route = useRoute();

onMounted(async () => {
  loading.value = true;
  try {
    let api = new CommonAPI('passages');
    passage.value = await api.get(route.params.id);
    // passage.value = (dbPassages?.all?.map((el: Passage) => ({
    //   ...el, displayReference: false, displayText: false})));
  } catch(e) { console.error(e); }
  loading.value = false;
})
</script>

<style lang="scss" scoped>
.v-card {
  margin: 10px;
}

.v-card-title {
	padding-left: 15px;
	padding-right: 15px;
	justify-content: space-between;

	button {
		box-shadow: unset;
	}
}

@mixin separator {
	&::before {
		content: '';
		position: absolute;
		border-top: 1px solid black;
		top: 0;
		right: 25px;
		left: 25px;
	}
}

.v-card-subtitle {
	justify-content: center;
  padding-bottom: 12px;
  padding-top: 10px;
	position: relative;
	@include separator;
}

.v-card-text {
	position: relative;
	@include separator;
}
</style>
