import { Module, VuexModule, Mutation } from 'vuex-module-decorators'

@Module({
  name: 'auth',
  stateFactory: true,
  namespaced: true,
})

export default class AuthModule extends VuexModule {
  token = '';

  @Mutation
  setToken(value: string) {
    this.token = value;
  }
}
