<template>
  <div class="d-flex w-100 pt-1 justify-content-between text-muted">
    <small class="ml-1 c-small-font">
      <timeago :since="notification.notifiedOn" :auto-update="60"/>
    </small>

    <div>
      <!--읽음 확인-->
      <a v-if="notification.read" @click="toggleRead()" class="text-secondary mr-3">
        <small>
          <icon name="bullseye" class="text-primary" scale="1.05"/>
        </small>
      </a>
      <a v-else @click="toggleRead()" class="text-secondary mr-3">
        <small>
          <icon name="bullseye" scale="1.05"/>
        </small>
      </a>

      <!--읽음 삭제-->
      <a @click="removeRead()" class="text-danger">
        <small>
          <icon name="trash-alt" scale="1.05"/>
        </small>
      </a>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      notification: {
        type: Object,
        required: true
      }
    },
    methods: {
      async toggleRead() {
        try {
          this.$axios.$put(`/notifications/${this.notification.id}/read/toggle`);
          this.notification.read = !this.notification.read;
        } catch (e) {
          this.$toast.error(e.response ? e.response.data.message : e);
        }
      },
      async removeRead() {
        try {
          this.$axios.$delete(`/notifications/${this.notification.id}`);
          this.$parent.$emit("readRemoved", this.notification.id);
        } catch (e) {
          this.$toast.error(e.response ? e.response.data.message : e);
        }
      }
    }
  };
</script>
