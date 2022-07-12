<template>
  <div class="add-api">
    <div class="lf-content">
      <AceEditor
        class="ace_editor"
        ref="editorDom"
        v-model:content="editorContent"
      />
    </div>
    <div class="rt-content">
      <h3 class="info">接口信息</h3>
      <div class="option">
        <div class="name">method</div>
        <div class="wrap">
          <el-select
            v-model="method"
            class="m-2"
            placeholder="Select type method"
          >
            <el-option
              v-for="item in methodsOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
      <div class="option">
        <div class="name">url</div>
        <div class="wrap">
          <el-input v-model="url" placeholder="请输入url">
            <template #prepend>/</template>
          </el-input>
        </div>
      </div>
      <div class="option">
        <div class="name">描述</div>
        <div class="wrap">
          <el-input v-model="remark" placeholder="请输入描述"> </el-input>
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
            :disabled="disabled"
            v-preventReClick
            @click="saveCodeFn"
            >保存代码</el-button
          >
          <el-button
            type="warning"
            v-preventReClick
            @click="$router.replace('/project')"
            >回到首页</el-button
          >
          <!-- <el-button type="danger" @click="clearCodeFn">清空代码</el-button> -->
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
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import { projectApiAdd, projectApiEdit } from "@/api/projectApi";
import { ProjectApi } from "@/type";

export default defineComponent({
  name: "AddApi",
  setup() {
    //获取路由对象
    const route = useRoute();
    const router = useRouter();
    const editorDom = ref();
    const editorContent = ref("");
    const remark = ref("");
    const url = ref("");
    const method = ref("");
    const methodsOptions = [
      {
        value: "get",
        label: "get",
      },
      {
        value: "post",
        label: "post",
      },
      {
        value: "put",
        label: "put",
      },
      {
        value: "delete",
        label: "delete",
      },
      {
        value: "patch",
        label: "patch",
      },
    ];
    //获取路由参数(新增的情况)
    let routerQuery = route.query;
    let queryKeysLength = Object.keys(routerQuery).length;

    //获取路由参数(编辑的情况)
    let storageEditItem =
      window.sessionStorage.getItem("editApiItem") &&
      JSON.parse(window.sessionStorage.getItem("editApiItem") || "");
    let routerParams = storageEditItem || {};
    let keysLength = Object.keys(routerParams).length;
    if (keysLength > 0) {
      //编辑
      editorContent.value = routerParams.content as string;
      remark.value = routerParams.remark as string;
      url.value = routerParams.url as string;
      method.value = routerParams.method as string;
    }
    const userInfo =
      window.sessionStorage.getItem("userInfo") &&
      JSON.parse(window.sessionStorage.getItem("userInfo") || "");
    // 是否管理员
    const isAdmin = userInfo && userInfo.roleId === 1 ? true : false;
    const disabled = ref(
      storageEditItem && storageEditItem.projectId === 1 && !isAdmin
        ? true
        : false
    );
    // 格式化代码
    const beautifulCodeFn = () => {
      editorDom.value?.codeFormat();
    };
    //保存代码
    const saveCodeFn = async () => {
      if (!url.value || !method.value || !editorContent.value) {
        return ElMessage({
          message: "请把信息补充完整url，method，content",
          type: "error",
        });
      }
      // 校验代码的有效性
      try {
        //  eslint-disable-next-line @typescript-eslint/no-unused-vars
        const contentObj = eval("(" + editorContent.value + ")");
        console.log("contentObj: ", contentObj);
        //发起请求
        if (queryKeysLength > 0) {
          //新增
          let params = {
            projectId: routerQuery.projectId as unknown as number,
            baseUrl: routerQuery.baseUrl as unknown as string,
            method: method.value,
            url: url.value,
            remark: remark.value,
            content: editorContent.value,
          };
          let { code } = await projectApiAdd(params);
          if (code === 200) {
            requestAnimationFrame(() => {
              // router.push({
              //   name: "apilist",
              //   query: {
              //     projectId: routerQuery.projectId,
              //     baseUrl: routerQuery.baseUrl,
              //   },
              // });
              router.go(-1);
            });
            ElMessage({
              type: "success",
              message: "保存成功",
            });
          }
        } else {
          //编辑
          let params = {
            ...routerParams,
            content: editorContent.value,
            method: method.value,
            url: url.value,
            remark: remark.value,
          } as ProjectApi;
          let { code } = await projectApiEdit(params);
          if (code === 200) {
            requestAnimationFrame(() => {
              // router.push({
              //   name: "apilist",
              //   query: {
              //     projectId: routerParams.projectId,
              //     baseUrl: routerParams.baseUrl,
              //   },
              // });
              router.go(-1);
            });
            ElMessage({
              type: "success",
              message: "保存成功",
            });
          }
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
    onBeforeRouteLeave(() => {
      sessionStorage.removeItem("editApiItem");
    });
    // watch(editorContent, (newVal, prevCount) => {
    //   console.log("newVal: ", newVal);
    //   // console.log("prevCount: ", prevCount);
    // });
    return {
      methodsOptions,
      method,
      remark,
      url,
      editorContent,
      editorDom,
      beautifulCodeFn,
      saveCodeFn,
      clearCodeFn,
      disabled,
    };
  },
  components: {
    AceEditor,
  },
});
</script>

<style lang="scss">
.add-api {
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
