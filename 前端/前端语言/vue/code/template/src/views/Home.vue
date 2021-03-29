<template>
  <div class="home">
    <Header></Header>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Header from "@/components/home/header/index.vue";

@Component({
  name: "Home",
  components: {
    Header
  }
})
export default class Home extends Vue {}
</script>
