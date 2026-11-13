export const actions = {
  async getClubProfile (context, clubId) {
    const { data } = await this.$axios.$get(`v1/clubs/${clubId}`);
    return data;
  },
  async editClubProfile (context, { clubId, fields }) {
    const { data } = await this.$axios.$patch(`v1/clubs/${clubId}`, fields);
    return data;
  },
  async uploadClubCover (context, { clubId, cover }) {
    const body = new FormData();
    body.append('_method', 'PATCH');
    body.append('cover', cover);
    const { data } = await this.$axios.$post(`v1/clubs/${clubId}`, body);
    return data;
  },
};
