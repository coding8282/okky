<template>
  <div>
    <AppEvent />
    <NavHeader/>
    <nuxt class="container my-3"/>
    <AppFooter/>
    <AppButton/>
  </div>
</template>

<script>
import AppFooter from "@/components/AppFooter";
import AppEvent from "@/components/AppEvent";
import AppButton from "@/components/AppButton";
import NavHeader from "@/components/nav/NavHeader";

export default {
  components: {
    AppEvent,
    AppFooter,
    AppButton,
    NavHeader
  }
};
</script>