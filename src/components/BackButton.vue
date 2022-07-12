<template>
  <div class="back-btn">
    <el-button type="success" :icon="Back">
      <!-- <Back /> -->
    </el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Back } from "@element-plus/icons-vue";
export default defineComponent({
  name: "BackButton",
  // components: { Back },
  setup() {
    return {
      Back,
    };
  },
});
</script>
<!-- <script lang="ts" setup>
import { Back } from "@element-plus/icons-vue";
</script> -->
<style lang="scss">
.back-btn {
  position: fixed;
  top: 80px;
  left: 100px;
}
</style>
