import { createStore } from 'vuex'

export interface IGlobalState {}

const store = createStore<IGlobalState>({
    getters: {},
    mutations: {},
    actions: {},
    modules: {},
    plugins: []
})
export default store
