import {__hardcoded} from "../utils/helpers";

export const state = () => ({
  users: [],
  user: null,
})

export const getters = {
  USERS: s => s.users,
  USERS_ECONOMY_FILTER: s => {
    const filteredUsers = s.users.filter(user => {
      return user.roles.some(role => __hardcoded([1, 2, 3]).includes(role.id));
    })
    return [
      {
        id: -1,
        name: 'Все'
      },
      ...filteredUsers,
    ];
  },
  USERS_FILTER: s => [{id: -1, name: 'Все'}, ...s.users],
  TRAINERS: s => s.users.filter(s => s.is_trainer),
  TRAINERS_SELECT: s => club_id => [
    {id: null, name: '- БЕЗ ТРЕНЕРА - '},
    ...s.users.filter(s => {
      return s.is_trainer && s.club.map(c => c.id).includes(club_id);
    })],
  USER: s => s.user,
}

export const mutations = {
  setUsers (state, users) {
    state.users = users;
  },
  createUser (state, user) {
    state.users.push(user);
  },
  setUser (state, user) {
    state.user = user;
  },
  deleteUser (state, id) {
    state.users = state.users.filter(u => u.id !== id);
  },
  updateUser (state, user) {
    state.users = state.users.map(u => {
      if (u.id == user.id) {
        u = {...user};
      }
      return u;
    })
  },
  updateCurrentUser (state, user) {
    state.user = {...user};
  }
}

export const actions = {
  async getUsers ({ commit }, query = {}) {
    const { data } = await this.$axios.$get(`v1/users?${new URLSearchParams(query)}`);
    commit('setUsers', data);
  },
  async createUser ({ commit }, user) {
    const data = await this.$axios.$post('v1/users', user);
    commit('createUser', data.user);
  },
  async getUser ({ commit }, id) {
    const { data } = await this.$axios.$get(`v1/users/${id}`);
    commit('setUser', data);
  },
  async deleteUser ({ commit }, id) {
    await this.$axios.delete(`v1/users/${id}`);
    commit('deleteUser', id);
  },
  async updateUser({ commit }, payload) {
    const data = await this.$axios.$patch(`v1/users/${payload.id}`, payload);
    commit('updateUser', data.user);
  },
  async uploadPhoto ({ commit }, { id, file }) {
    const data = await this.$axios.$post(`v1/users/upload/${id}`, file);
    commit('updateCurrentUser', data.user);
  }
}
