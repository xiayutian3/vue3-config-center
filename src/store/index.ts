import { createStore } from "vuex";

export default createStore({
  state: {
    editItem: "",
    envOption: "",
    userInfo: "",
  },
  getters: {},
  mutations: {
    // 用户登录信息
    SET_USERINFO(state, data) {
      state.userInfo = data;
    },
    // 编辑参数
    SET_EDITITEM(state, data) {
      state.editItem = data;
    },
    // 环境选择
    SET_ENVOPTION(state, data) {
      state.envOption = data;
    },
  },
  actions: {
    // 用户登录信息
    setUserInfo({ commit }, data) {
      commit("SET_USERINFO", data);
    },
    // 编辑参数
    setEditItem({ commit }, data) {
      commit("SET_EDITITEM", data);
    },
    // 环境选择
    setEnvOption({ commit }, data) {
      commit("SET_ENVOPTION", data);
    },
  },
  modules: {},
});
