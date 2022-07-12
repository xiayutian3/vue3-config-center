<template>
  <!-- 编辑资料弹框 -->
  <el-dialog
    :model-value="editUerMessageModalVisible"
    title="编辑资料"
    append-to-body
    @close="dialogClose"
    width="450px"
    top="8vh"
  >
    <el-form :model="form" ref="ruleFormRef" label-width="100px" :rules="rules">
      <el-form-item label="昵称" prop="userName">
        <el-input
          v-model="form.userName"
          autocomplete="off"
          placeholder="请输入昵称"
        />
      </el-form-item>
      <el-form-item label="原密码" prop="oldPassword">
        <el-input
          type="password"
          show-password
          v-model="form.oldPassword"
          placeholder="请输入原密码"
        />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input
          type="password"
          v-model="form.newPassword"
          show-password
          placeholder="请输入新密码"
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmedPwd">
        <el-input
          type="password"
          v-model="form.confirmedPwd"
          show-password
          placeholder="请再次确认新密码"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button v-preventReClick @click="cancel">取消</el-button>
        <el-button type="primary" v-preventReClick @click="sure(ruleFormRef)"
          >确认</el-button
        >
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { reactive, defineEmits, ref } from "vue";
import { userEdit } from "@/api/login";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
const emits = defineEmits(["update:modelValue"]);
const ruleFormRef = ref<FormInstance>();
const form = reactive({
  newPassword: "",
  oldPassword: "",
  confirmedPwd: "",
  userName:
    sessionStorage.getItem("userInfo") &&
    JSON.parse(sessionStorage.getItem("userInfo") || "").name,
});
const validateConfirmedPwd = (rule: any, value: any, callback: any) => {
  if (value && value !== form.newPassword) {
    callback(new Error("两次输入密码不一致!"));
  } else {
    callback();
  }
};
const validatePass = (rule: any, value: any, callback: any) => {
  let reg = new RegExp(
    "[`~!@#$^&*=|{}':;./%',\\[\\]<>?~！@#￥……&*——|{}【】‘；：”“'。，、？ ]"
  );
  if (value && !reg.test(value)) {
    callback(new Error("密码需包含特殊字符"));
  } else {
    callback();
  }
};
const rules = reactive<FormRules>({
  oldPassword: [{ required: false, message: "请输入原密码", trigger: "blur" }],
  newPassword: [
    { required: false, message: "请输入新密码", trigger: "blur" },
    { validator: validatePass, trigger: "blur" },
  ],
  confirmedPwd: [
    { required: false, message: "请再次确认新密码", trigger: "blur" },
    { validator: validateConfirmedPwd, trigger: "blur" },
  ],
});
const cancel = () => {
  emits("update:modelValue", false);
};
const dialogClose = () => {
  emits("update:modelValue", false);
};
const sure = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid: any) => {
    if (valid) {
      let id =
        (sessionStorage.getItem("userInfo") &&
          parseInt(
            JSON.parse(sessionStorage.getItem("userInfo") || "").id as string
          )) ||
        undefined;
      let params = {
        password: form.newPassword || undefined,
        oldPassword: form.oldPassword || undefined,
        name: form.userName,
        id,
      };
      let { code, message } = await userEdit(params);
      if (code === 200) {
        ElMessage.success("操作成功");
        if (form.newPassword && form.oldPassword) {
          sessionStorage.clear();
        } else {
          let userInfo = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
          userInfo.name = params.name;
          sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
        }
        emits("update:modelValue", false);
        setTimeout(() => {
          window.location.reload();
        }, 300);
      } else {
        ElMessage.info(message);
      }
    }
  });
};

const editUerMessageModalVisible = ref(false);
</script>
<style lang="scss" scoped></style>
