import request from "@/api/request";
// import qs from "qs";
import { ProjectItem } from "@/type/index";

const serverUrl = {
  list: "/project/list",
  add: "/project/add",
  edit: "/project/edit",
  del: "/project/delete",
};

// export const register = (params:any) => {
//   return request.post(serverUrl.register, params)
// }
// export const getExistsemail = (params:any) => {
//   return request.get(serverUrl.existsemail + '?' + qs.stringify(params))
// }
export const getProjectList = () => {
  return request.get(serverUrl.list);
};
export const projectAdd = (params: ProjectItem) => {
  return request.post(serverUrl.add, params);
};
export const projectEdit = (params: ProjectItem) => {
  return request.post(serverUrl.edit, params);
};
export const projectDel = (params: { id: number }) => {
  return request.post(serverUrl.del, params);
};
