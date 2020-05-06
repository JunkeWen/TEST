<template>
  <div id="app">
    
  </div>
</template>
<script>
import "muse-ui-loading/dist/muse-ui-loading.css"; 
import Loading from "muse-ui-loading";
import Static from '../../utils/static.js'

export default {
  name: "MainPage",
  components: {
  },
  data: () => {
    return {
    };
  },
  methods: {},
  mounted: function() {
    const loading = Loading();
      // this.$root.api.api.closeWin({'name':Static.mainPageParams.name});
  }
};
</script>
<style scoped lang="scss">
</style>