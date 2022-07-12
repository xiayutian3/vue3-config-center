<template>
  <div class="add-project">
    <BackButton v-preventReClick @click="goBack" />
    <h3>项目环境配置添加</h3>
    <section>
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        :size="formSize"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="moduleUrl(url)" prop="addr">
          <el-input v-model="ruleForm.addr">
            <template #prepend>/</template>
          </el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="ruleForm.remark" type="textarea" />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            v-preventReClick
            :disabled="disabled"
            @click="submitForm(ruleFormRef)"
            >{{ keysLength > 0 ? "编辑" : "创建" }}</el-button
          >
          <el-button
            v-preventReClick
            :disabled="disabled"
            @click="resetForm(ruleFormRef)"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import BackButton from "@/components/BackButton.vue";
import "element-plus/theme-chalk/el-message.css";
import { onBeforeRouteLeave, useRouter } from "vue-router";
// import { ProjectItem } from "@/type/index";
import { projectAdd, projectEdit } from "@/api/project";

export default defineComponent({
  name: "AddProject",
  setup() {
    //获取路由对象
    const router = useRouter();
    // const route = useRoute();

    const formSize = ref("default");
    const ruleFormRef = ref<FormInstance>();
    const ruleForm = reactive({
      name: "",
      addr: "",
      remark: "",
    });

    // 获取编辑数据
    let storageEditItem =
      window.sessionStorage.getItem("editProjectItem") &&
      JSON.parse(window.sessionStorage.getItem("editProjectItem") || "");
    let routerParams = storageEditItem || {};
    let keysLength = Object.keys(routerParams).length;
    if (keysLength > 0) {
      //编辑
      ruleForm.name = routerParams.name as string;
      ruleForm.addr = routerParams.addr as string;
      ruleForm.remark = routerParams.remark as string;
    }
    const userInfo =
      window.sessionStorage.getItem("userInfo") &&
      JSON.parse(window.sessionStorage.getItem("userInfo") || "");
    // 是否管理员
    const isAdmin = userInfo && userInfo.roleId === 1 ? true : false;
    const disabled =
      storageEditItem && storageEditItem.id === 1 && !isAdmin ? true : false;
    const rules = reactive<FormRules>({
      name: [{ required: true, message: "请输入名字", trigger: "blur" }],
      addr: { required: true, message: "请输入addr", trigger: "blur" },
      remark: { required: true, message: "请输入描述", trigger: "blur" },
    });
    const submitForm = async (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      await formEl.validate(async (valid) => {
        if (valid) {
          // console.log("submit!");
          //发起请求(新增或编辑)
          let message;
          let statusCode;
          if (keysLength > 0) {
            //编辑
            let params = {
              ...routerParams,
              ...ruleForm,
              id: parseInt(routerParams.id as string),
            };
            let { code } = await projectEdit(params);
            statusCode = code;
            message = code === 200 ? "编辑成功" : "编辑失败，请稍后再试";
          } else {
            //新增
            let { code } = await projectAdd(ruleForm);
            statusCode = code;
            message = code === 200 ? "添加成功" : "添加失败，请稍后再试";
          }
          if (statusCode === 200) {
            ElMessage({
              type: "success",
              message,
            });
            requestAnimationFrame(() => {
              // router.push({ name: "project" });
              router.go(-1);
            });
          } else {
            ElMessage({
              type: "info",
              message,
            });
          }
        }
      });
    };
    const resetForm = (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      formEl.resetFields();
    };
    const goBack = () => {
      router.go(-1);
    };
    onBeforeRouteLeave(() => {
      sessionStorage.removeItem("editProjectItem");
    });
    return {
      formSize,
      ruleFormRef,
      ruleForm,
      rules,
      submitForm,
      resetForm,
      goBack,
      keysLength,
      disabled,
    };
  },
  components: {
    BackButton,
  },
});
</script>
<style lang="scss">
.add-project {
  // display: flex;
  // flex-direction: column;
  // justify-content: center;
  margin: 0 auto;
  width: 1000px;
  text-align: center;
  h3 {
    margin-top: 40px;
    margin-bottom: 30px;
  }
}
</style>
