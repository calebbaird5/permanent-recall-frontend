import { defineStore } from 'pinia'
import { CommonAPI } from '@/api/common';
import { Setting } from '~/models/setting.model';
import _ from 'lodash';

interface BooleanSetting {
	value: boolean,
	setting: Setting,
}

const defaultStrictCapitalization: BooleanSetting = {
	value: false,
	setting: {
		_id: '',
		name: 'strict-capitalization',
		value: 'false',
	},
}

const defaultStrictPunctuation: BooleanSetting = {
	value: false,
	setting: {
		_id: '',
		name: 'strict-punctuation',
		value: 'false',
	},
}

export const useSettingsStore = defineStore({
	id: 'settings-store',
	state: () => {
		return {
			strictCapitalization: _.cloneDeep(defaultStrictCapitalization),
			strictPunctuation: _.cloneDeep(defaultStrictPunctuation),
		}
	},
	actions: {
		async loadUserSettings() {
			try {
				let api = new CommonAPI('settings');
				let userSettings = await api.list() as Setting[];
				let capitalizationSetting = userSettings.find(el =>
					el.name === 'strict-capitalization');
				if (capitalizationSetting) {
					this.strictCapitalization = {
						value: capitalizationSetting.value === 'true',
						setting: capitalizationSetting,
					}
				} else {
					this.resetStrictCapitalization();
				}

				let punctuationSetting = userSettings.find(el =>
					el.name === 'strict-punctuation');
				if (punctuationSetting) {
					this.strictPunctuation = {
						value: punctuationSetting.value === 'true',
						setting: punctuationSetting,
					}
				} else {
					this.resetStrictPunctuation();
				}

			} catch (e) { console.error(e) }
		},

		resetUserSettings() {
			this.resetStrictCapitalization();
			this.resetStrictPunctuation();
		},

		setStrictCapitalization(setting: Setting) {
			this.strictCapitalization = {
				setting,
				value: setting.value === 'true',
			};
		},

		setStrictPunctuation(setting: Setting) {
			this.strictPunctuation = {
				setting,
				value: setting.value === 'true',
			};
		},

		resetStrictCapitalization() {
			this.strictCapitalization = _.cloneDeep(defaultStrictCapitalization);
		},

		resetStrictPunctuation() {
			this.strictPunctuation = _.cloneDeep(defaultStrictPunctuation);
		},
	},
	getters: {},
})
