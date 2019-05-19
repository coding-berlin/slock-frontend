import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    showLocations: false
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    toggleLocations(state) {
      state.showLocations = !state.showLocations;
    },
    logout(state) {
      state.user = {};
    }
  },
  actions: {}
});
