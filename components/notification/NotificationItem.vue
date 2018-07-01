<template>
  <div class="c-article-border px-2 pt-1" :class="{'l-notification-bg':!notification.read}">
    <notification-item-reply-wrote :notification="notification"/>
    <notification-item-reply-pinned :notification="notification"/>
    <notification-item-emoted :notification="notification"/>
    <notification-item-commented :notification="notification"/>

    <notification-item-control :notification="notification"/>
  </div>
</template>

<script>
  import NotificationItemControl from './NotificationItemControl';
  import NotificationItemReplyWrote from './NotificationItemReplyWrote';
  import NotificationItemReplyPinned from './NotificationItemReplyPinned';
  import NotificationItemEmoted from "./NotificationItemEmoted";
  import NotificationItemCommented from "./NotificationItemCommented";

  export default {
    components: {
      NotificationItemCommented,
      NotificationItemControl,
      NotificationItemReplyWrote,
      NotificationItemReplyPinned,
      NotificationItemEmoted,
    },
    props: {
      notification: {
        type: Object,
        required: true
      }
    },
  };
</script>

<style scoped>
  .l-notification-bg {
    background-color: rgb(243, 249, 252);
  }
</style>
