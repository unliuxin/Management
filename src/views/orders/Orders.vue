<template></template>

<script>
export default {
  name: "Orders",

  data() {
    return {

    };
  },
  created() {
      this.getdatalists()
  },
  methods: {
      getdatalists(){
          this.$http.get()
      }
  },
};
</script>


<style scoped>
</style>