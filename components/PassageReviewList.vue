<template>
	<v-progress-circular v-if="loading" indeterminate color="black" />
	<v-row
		v-else
		v-for="(passage, i) in passages"
		:key="passage._id || i"
		justify="center"
		align="center"
		>
		<v-col @click="router.push(`/passages/${passage._id}/review`)">
			<v-card>
				<v-card-title> {{ passage.prompt }} </v-card-title>
			</v-card>
		</v-col>
	</v-row>
</template>

<script lang="ts" setup="setup">
	import { CommonAPI } from '@/api/common';
import { Passage } from '@/models';

const passages: Ref<Passage[]> = ref([]);
const loading = ref(false);

onMounted(loadPassages);

import { useRouter } from 'vue-router'
const router = useRouter();

async function loadPassages() {
  loading.value = true;
  try {
    let api = new CommonAPI('passages/reviewList');
    let dbPassages = await api.list();
    passages.value.push(...dbPassages?.all?.map((el: Passage) => ({
      ...el, displayReference: false, displayText: false})));
  } catch(e) { console.error(e); }
  loading.value = false;
}

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
