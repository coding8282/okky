<template>
  <div class="c-article-border px-2 pt-1" :class="{'l-notification-bg':!notification.read}">
    <notification-item-reply-wrote :notification="notification"/>
    <notification-item-reply-pinned :notification="notification"/>

    <notification-item-control :notification="notification"/>
  </div>
</template>

<script>
  import NotificationItemControl from './NotificationItemControl';
  import NotificationItemReplyWrote from './NotificationItemReplyWrote';
  import NotificationItemReplyPinned from './NotificationItemReplyPinned';

  export default {
    components: {
      NotificationItemControl,
      NotificationItemReplyWrote,
      NotificationItemReplyPinned,
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
