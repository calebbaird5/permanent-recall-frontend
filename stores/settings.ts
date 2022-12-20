import { defineStore } from 'pinia'
import { CommonAPI } from '@/api/common';
import { Setting } from '~~/models/setting.model';

interface BooleanSetting {
	value: boolean,
	setting: Setting,
}

export const useSettingsStore = defineStore({
	id: 'settings-store',
	state: () => {
		return {
			strictCapitalization: {
				value: false,
				setting: {
					_id: '',
					name: 'strict-capitalization',
					value: 'false',
				},
			} as BooleanSetting,
			strictPunctuation: {
				value: false,
				setting: {
					_id: '',
					name: 'strict-punctuation',
					value: 'false',
				},
			} as BooleanSetting,
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
				}

				let punctuationSetting = userSettings.find(el =>
					el.name === 'strict-punctuation');
				if (punctuationSetting) {
					this.strictPunctuation = {
						value: punctuationSetting.value === 'true',
						setting: punctuationSetting,
					}
				}

			} catch (e) { console.error(e) }
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
	},
	getters: {},
})
