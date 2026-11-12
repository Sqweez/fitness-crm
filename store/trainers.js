const requestBody = (fields, photo) => {
  if (!photo) {
    return fields;
  }
  const body = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    body.append(key, typeof value === 'boolean' ? Number(value) : value);
  });
  body.append('photo', photo);
  return body;
};

export const state = () => ({ trainers: [] });

export const getters = {
  TRAINERS: state => [...state.trainers].sort((a, b) =>
    a.sort_order - b.sort_order || a.id.localeCompare(b.id, undefined, { numeric: true })
  ),
};

export const mutations = {
  setTrainers (state, trainers) {
    state.trainers = trainers;
  },
  saveTrainer (state, trainer) {
    const index = state.trainers.findIndex(item => item.id === trainer.id);
    if (index === -1) {
      state.trainers.push(trainer);
    } else {
      state.trainers.splice(index, 1, trainer);
    }
  },
  deleteTrainer (state, id) {
    state.trainers = state.trainers.filter(trainer => trainer.id !== id);
  },
};

export const actions = {
  async getTrainers ({ commit }) {
    const { data } = await this.$axios.$get('v1/trainers');
    commit('setTrainers', data);
  },
  async getTrainer (context, id) {
    const { data } = await this.$axios.$get(`v1/trainers/${id}`);
    return data;
  },
  async createTrainer ({ commit }, { fields, photo }) {
    const { data } = await this.$axios.$post('v1/trainers', requestBody(fields, photo));
    commit('saveTrainer', data);
  },
  async editTrainer ({ commit }, { id, fields, photo }) {
    const url = `v1/trainers/${id}`;
    const { data } = photo
      ? await this.$axios.$post(url, requestBody({ ...fields, _method: 'PATCH' }, photo))
      : await this.$axios.$patch(url, fields);
    commit('saveTrainer', data);
  },
  async deleteTrainer ({ commit }, id) {
    await this.$axios.$delete(`v1/trainers/${id}`);
    commit('deleteTrainer', id);
  },
};
