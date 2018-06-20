<template>
  <fab v-if="isAuthenticated"
    position="bottom-right"
    bg-color="purple"
    main-icon="mouse"
    icon-size="small"
    :actions="fabActions"
    @profile="profile"
    @myArticles="myArticles">
  </fab>      
</template>

<script>
import fab from "vue-fab";

export default {
  components: {
    fab
  },
  data() {
    return {
      fabActions: [
        {
          name: "profile",
          icon: "contacts"
        },
        {
          name: "myArticles",
          icon: "list_alt"
        }
      ]
    };
  },
  methods: {
    profile() {
      this.$router.push(`/member/${this.authenticatedId}/profile`);
    },
    myArticles() {
      this.$router.push(`/member/me/articles`);
    }
  }
};
</script>