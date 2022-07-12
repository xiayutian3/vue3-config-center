import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "element-plus/theme-chalk/src/message.scss";
const app = createApp(App);
// 防止重复快速点击自定义全局指令
app.directive("preventReClick", {
  mounted(el: any, binding: any) {
    el.addEventListener("click", () => {
      if (!el.disabled) {
        el.disabled = true;
        setTimeout(() => {
          el.disabled = false;
        }, binding.value || 1000);
      }
    });
  },
});
app.use(store).use(router).mount("#app");
