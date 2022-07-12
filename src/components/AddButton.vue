<template>
  <el-button
    size="large"
    class="add-btn"
    type="primary"
    :disabled="isDisabled"
    :icon="Plus"
    circle
  />
</template>

<script lang="ts" setup>
import { Plus } from "@element-plus/icons-vue";
import { defineProps } from "vue";
const props = defineProps(["isDisabled"]);
</script>

<style lang="scss">
.add-btn {
  position: fixed;
  bottom: 100px;
  right: 150px;
}
</style>
