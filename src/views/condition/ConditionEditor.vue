<template>
  <div class="condition-editor">
    <div class="lf-content">
      <AceEditor
        class="ace_editor"
        ref="editorDom"
        v-model:content="editorContent"
      />
    </div>
    <div class="rt-content">
      <h3 class="info">项目环境判断条件</h3>
      <div class="option">
        <div class="name">要插入的ip</div>
        <div class="wrap">
          <el-input v-model="editorIp" placeholder="请输入ip"> </el-input>
        </div>
      </div>
      <div class="option">
        <div class="name">要添加的环境</div>
        <div class="wrap">
          <el-select v-model="editorEnv" class="m-2" placeholder="请选择名称">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
      <div class="option">
        <div class="name">操作</div>
        <div class="wrap">
          <el-button type="primary" v-preventReClick @click="addToEditor"
            >添加到编辑器</el-button
          >
        </div>
      </div>
      <div class="option">
        <div class="name">名称</div>
        <div class="wrap">
          <el-input v-model="editorName" placeholder="请输入名称"> </el-input>
        </div>
      </div>
      <div class="option">
        <div class="name">操作</div>
        <div class="wrap">
          <el-button type="primary" v-preventReClick @click="beautifulCodeFn"
            >美化代码</el-button
          >
          <el-button
            type="info"
            v-preventReClick
            :disabled="disabled"
            @click="saveCodeFn"
            >保存代码</el-button
          >
          <!-- <el-button type="danger" @click="clearCodeFn">清空代码</el-button> -->
          <el-button
            type="warning"
            v-preventReClick
            @click="$router.replace('/project')"
            >回到首页</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import AceEditor from "@/components/AceEditor.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import "element-plus/theme-chalk/el-message.css";
import "element-plus/theme-chalk/el-message-box.css";
import { useRouter, onBeforeRouteLeave } from "vue-router";
import { conditionEdit } from "@/api/condition";
import { ConditionItem } from "@/type";

export default defineComponent({
  name: "AddApi",
  // props: {
  //   options: {
  //     type: Array as PropType<{ label: string; value: string }[]>,
  //     default: () => [],
  //   },
  // },
  setup() {
    //获取路由对象
    const router = useRouter();

    const editorDom = ref();
    const editorContent = ref("");
    const editorName = ref("");
    const editorIp = ref("");
    const editorEnv = ref("");
    const options = ref<{ label: string; value: string }[]>([]);
    options.value = JSON.parse(sessionStorage.getItem("envOption") || "[]");

    //获取路由参数(编辑的情况)
    let storageEditItem =
      window.sessionStorage.getItem("conditionItem") &&
      JSON.parse(window.sessionStorage.getItem("conditionItem") || "");
    let routerParams = storageEditItem || {};
    let keysLength = Object.keys(routerParams).length;
    if (keysLength > 0) {
      //编辑
      editorContent.value = routerParams.content as string;
      editorName.value = routerParams.name as string;
    }
    const userInfo =
      window.sessionStorage.getItem("userInfo") &&
      JSON.parse(window.sessionStorage.getItem("userInfo") || "");
    // 是否管理员
    const isAdmin = userInfo && userInfo.roleId === 1 ? true : false;
    const disabled = ref(storageEditItem.id === 1 && !isAdmin ? true : false);
    // 格式化代码
    const beautifulCodeFn = () => {
      editorDom.value?.codeFormat();
    };
    //保存代码
    const saveCodeFn = async () => {
      if (!editorContent.value) {
        return ElMessage({
          message: "请把内容补充完整",
          type: "error",
        });
      }
      // 校验代码的有效性
      try {
        //  eslint-disable-next-line @typescript-eslint/no-unused-vars
        const contentObj = eval("(" + editorContent.value + ")");
        // console.log("contentObj: ", contentObj);
        //发起请求
        //编辑
        let params = {
          ...routerParams,
          id: parseInt(routerParams.id as string),
          content: editorContent.value,
          name: editorName.value,
        } as ConditionItem;
        // console.log("params: ", params);
        let { code } = await conditionEdit(params);
        if (code === 200) {
          requestAnimationFrame(() => {
            // router.push({
            //   name: "project",
            // });
            router.go(-1);
          });
          ElMessage({
            type: "success",
            message: "保存成功",
          });
        }
      } catch (error) {
        // console.log(window.aceError);
        ElMessage({
          message: error as string,
          type: "error",
        });
      }
    };
    //清空代码
    const clearCodeFn = () => {
      ElMessageBox.confirm("您确定要删除吗?", "Warning", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          editorDom.value?.setValue();
          ElMessage({
            type: "success",
            message: "删除成功",
          });
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "取消删除",
          });
        });
    };

    //添加到编辑器内容区
    const addToEditor = () => {
      const contentObj = eval("(" + editorContent.value + ")");
      editorContent.value = JSON.stringify({
        ...contentObj,
        [editorIp.value]: editorEnv.value,
      });
      editorDom.value.setEditorContent();
    };
    onBeforeRouteLeave(() => {
      sessionStorage.removeItem("conditionItem");
    });
    // watch(editorContent, (newVal, prevCount) => {
    //   console.log("newVal: ", newVal);
    //   // console.log("prevCount: ", prevCount);
    // });
    return {
      editorContent,
      editorName,
      editorDom,
      editorIp,
      beautifulCodeFn,
      saveCodeFn,
      clearCodeFn,
      addToEditor,
      editorEnv,
      options,
      disabled,
    };
  },
  components: {
    AceEditor,
  },
});
</script>

<style lang="scss">
.condition-editor {
  display: flex;
  height: 100%;
  .lf-content {
    flex: 1;
    background: #282c34;
    .ace_editor {
      height: 100%;
    }
  }
  .rt-content {
    width: 350px;
    padding: 20px;
    box-sizing: border-box;
    background: #67c23a;
    .info {
      color: #fff;
      margin-bottom: 40px;
      text-align: center;
    }
    .option {
      margin-bottom: 20px;
      .name {
        margin-bottom: 5px;
      }
      .wrap {
        .m-2 {
          width: 100%;
        }
      }
    }
  }
}
</style>
