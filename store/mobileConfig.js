export const actions = {
  async getConfig () {
    const { data } = await this.$axios.$get('v1/mobile/config');
    return data;
  },
  async updateConfig (context, fields) {
    const { data } = await this.$axios.$patch('v1/mobile/config', fields);
    return data;
  },
};
