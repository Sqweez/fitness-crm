export const state = () => ({
  inGymClients: [],
  sleepingClients: [],
  birthdayClients: [],
  todayGuests: [],
});
export const getters = {
  inGymClients: state => state.inGymClients,
  sleepingClients: state => state.sleepingClients,
  birthdayClients: state => state.birthdayClients,
  todayGuests: state => state.todayGuests,
};
export const mutations = {
  setInGymClients (state, clients) {
    state.inGymClients = clients;
  },
  setTodayGuestsClients (state, clients) {
    state.todayGuests = clients;
  },
  setBirthdayClients (state, clients) {
    state.birthdayClients = clients;
  },
  setSleepingClients (state, clients) {
    state.sleepingClients = clients;
  }
};
export const actions = {
  async getInGymClients ({ commit }) {
    const { data } = await this.$axios.$get('v1/dashboard/in-gym-clients');
    commit('setInGymClients', data);
  },
  async getTodayGuests ({ commit }) {
    const { data } = await this.$axios.$get('v1/dashboard/guests');
    commit('setTodayGuestsClients', data);
  },
  async getBirthdayClients ({ commit }) {
    const { data } = await this.$axios.$get('v1/dashboard/birthday');
    commit('setBirthdayClients', data);
  },
  async getSleepingClients ({ commit }, date) {
    const { data } = await this.$axios.get(`v1/dashboard/sleeping?date=${date}`);
    commit('setSleepingClients', data);
  }
};
