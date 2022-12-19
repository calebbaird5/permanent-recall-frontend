<template>
	<v-card>
		<v-tabs v-model="currentTabKey">
			<v-tab v-for="tab of tabs" :value="tab.value">{{ tab.label }}</v-tab>
		</v-tabs>
    <v-window v-model="currentTabKey">
			<v-window-item value="learn">
				<v-table>
					<tbody>
						<tr>
							<td class="label">
								Prompt: <ToggleIcon v-model="showPrompt" /> </td>
							<td class="text">
								<span v-show="showPrompt">{{ passage.prompt }}</span>
							</td>
						</tr>

						<tr>
							<td class="label">
								Reference: <ToggleIcon v-model="showReference" /> </td>
							<td class="text">
								<span v-show="showReference">{{ passage.reference }}</span>
							</td>
						</tr>

						<tr>
							<td class="label">
								Reference: <ToggleIcon v-model="showText" /> </td>
							<td class="text">
								<span v-show="showText">{{ passage.text }}</span>
							</td>
						</tr>

					</tbody>
				</v-table>
      </v-window-item>

			<v-window-item value="test">
				<PassageReviewTest :passage="passage" />
      </v-window-item>
		</v-window>
	</v-card>

</template>

<script lang="ts" setup="setup">
const {passage} = defineProps<{passage: Passage}>()
import type { Ref } from 'vue'
import { Passage } from '@/models';
import { CommonAPI } from '@/api/common';

const tabs = [
	{value: 'learn', label: 'Learn'},
	{value: 'test', label: 'Test'},
];

const currentTabKey = ref(tabs[0].value);
const showPrompt = ref(true);
const showReference = ref(false);
const showText = ref(false);

</script>

<style lang="scss" scoped>
.label {
	white-space: nowrap;
}

.text {
	width: 100%;
}
</style>
