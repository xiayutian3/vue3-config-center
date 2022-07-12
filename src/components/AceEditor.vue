<template>
  <div>
    <div id="editor"></div>
    <!-- <el-button @click="codeFormat">格式化代码</el-button>
    <el-button @click="getCode">获取内容</el-button> -->
  </div>
</template>

<script lang="ts">
import beautify_js from "js-beautify";
import { defineComponent, nextTick, onMounted, PropType, ref } from "vue";
export default defineComponent({
  name: "AceEditor",
  props: {
    content: {
      type: String as PropType<string>, //转为ts类型
      default: "",
    },
  },
  emits: ["update:content"],
  setup(props, { emit, expose }) {
    const winHeight = ref<number>();
    const editorRef = ref();
    // let beautify: any;
    const codeFormat = () => {
      const formatCode = beautify_js(editorRef.value.getValue());
      editorRef.value.session.setValue(formatCode);

      // 1
      // beautify.beautify(editorRef.value.session);
      // ace beautify 格式化不完全 使用浏览器内置的json格式化程序

      // 2
      // var val = editorRef.value.getValue();
      // var o = JSON.parse(val); // may throw if json is malformed
      // val = JSON.stringify(o, null, 2); // 4 is the indent size
      // editorRef.value.session.setValue(val);
    };
    // 获取内容
    const getCode = () => {
      const content = editorRef.value.getValue();
      // console.log("content: ", content);
      emit("update:content", content);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      // const contentObj = eval("(" + content + ")");
    };
    //清空输入
    const setValue = () => {
      editorRef.value.setValue("");
    };
    // 获取浏览器窗口的可视区域的高度
    const getViewPortHeight = () => {
      return (
        document.documentElement.clientHeight || document.body.clientHeight
      );
    };
    winHeight.value = getViewPortHeight() - 60;
    // 设置web编辑器内容
    const setEditorContent = () => {
      // console.log(editorRef.value);
      nextTick(() => {
        editorRef.value.setValue(props.content);
      });
    };
    expose({
      codeFormat,
      getCode,
      setValue,
      setEditorContent,
    });

    onMounted(() => {
      if (window.ace) {
        let ace = window.ace;
        ace.config.set("basePath", "https://img02.glsx.com.cn/ace/1.4.14/");

        editorRef.value = ace.edit("editor");
        // beautify = ace.require("ace/ext/beautify");
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
        //监听内容变化
        editorRef.value.session.on("change", function () {
          // console.log(delta);
          getCode();
        });
        //设置web编辑器内容
        setEditorContent();
      }
    });

    return {
      codeFormat,
      getCode,
      winHeight,
    };
  },
});
</script>
<style lang="scss">
#editor {
  // width: 500px;
  // width: 100%;
  // height: 920px;
  // height: 400px;
  height: 100%;
  .ace_print-margin {
    // display: none;
  }
}
</style>
