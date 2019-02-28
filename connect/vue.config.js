module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: `
          @import "@/assets/css/variables.scss";
          @import "@/assets/css/mixins.scss";
        `
      }
    }
  }
}
