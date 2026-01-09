export default {
  computed: {
    $hasMobileApplication() {
      return this.$store.getters['features/hasMobileApplication'];
    },
    $hasFeature() {
      return (featureName) => this.$store.getters['features/hasFeature'](featureName);
    },
  },
};
