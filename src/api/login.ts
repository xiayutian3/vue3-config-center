import request from "@/api/request";
// import qs from "qs";
import { UserMessage } from "@/type/index";
const serverUrl = {
  login: "/login",
  register: "/register",
  edit: "/updateUserInfo",
  del: "/delUser",
};

// export const register = (params:any) => {
//   return request.post(serverUrl.register, params)
// }
// export const getExistsemail = (params:any) => {
//   return request.get(serverUrl.existsemail + '?' + qs.stringify(params))
// }
export const login = (params: UserMessage) => {
  return request.post(serverUrl.login, params);
};
export const register = (params: UserMessage) => {
  return request.post(serverUrl.register, params);
};
export const userEdit = (params: UserMessage) => {
  return request.post(serverUrl.edit, params);
};
export const userDel = (params: { id: number }) => {
  return request.post(serverUrl.del, params);
};
