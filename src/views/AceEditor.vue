<template>
  <div>
    <div id="editor">{{ editorContent }}</div>
    <button @click="codeFormat">格式化代码</button>
    <button @click="getCode">获取内容</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
export default defineComponent({
  name: "AceEditor",
  props: {
    editorContent: {
      type: String,
      default: "{name: 'jack', age: '20'}",
    },
  },
  setup() {
    const editorRef = ref();
    let beautify: any;
    const codeFormat = () => {
      beautify.beautify(editorRef.value.session);
    };

    onMounted(() => {
      if (window.ace) {
        let ace = window.ace;
        ace.config.set("basePath", "https://img02.glsx.com.cn/ace/1.4.14/");

        editorRef.value = ace.edit("editor");
        beautify = ace.require("ace/ext/beautify");
        editorRef.value.setTheme("ace/theme/one_dark");
        editorRef.value.session.setMode("ace/mode/javascript");
        editorRef.value.setFontSize(18);
        editorRef.value.session.setUseWorker(false);

        //菜单提示
        ace.require("ace/ext/language_tools");
        editorRef.value.setOptions({
          enableBasicAutocompletion: true,
          enableSnippets: true,
          enableLiveAutocompletion: true,
        });
      }
    });

    // 获取内容
    const getCode = () => {
      const content = editorRef.value.getValue();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const contentObj = eval("(" + content + ")");
    };
    return {
      codeFormat,
      getCode,
    };
  },
});
</script>
<style lang="scss">
#editor {
  // width: 500px;
  width: 100%;
  height: 400px;
  .ace_print-margin {
    // display: none;
  }
}
</style>
