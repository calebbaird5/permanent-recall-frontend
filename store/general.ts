import { Module, VuexModule, Mutation } from 'vuex-module-decorators'

@Module({
  name: 'general',
  stateFactory: true,
  namespaced: true,
})

export default class GeneralModule extends VuexModule {
  pageTitle = 'Permanent Recall';

  @Mutation
  setPageTitle(value: string) {
    this.pageTitle = value;
  }

  get getPageTitle() {
    return this.pageTitle;
  }
}
