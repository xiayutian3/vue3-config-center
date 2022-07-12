/**
 * 存放公共的类型声明文件
 */

export interface HttpResponse {
  code?: number;
  data?: any;
  message?: string | Record<string, any>; // 定义 字符串，对象类型
  [propname: string]: any;
}

//项目分类
export interface ProjectItem {
  id?: number;
  name: string;
  addr: string;
  remark: string;
  [property: string]: any;
}

//项目分类里api
export interface ProjectApi {
  id?: number;
  projectId: number;
  method: string;
  url: string;
  baseUrl?: string;
  remark: string;
  content: string;
  createDate?: Date;
  updateDate?: Date;
}

//项目条件判断
export interface ConditionItem {
  id?: number;
  name: string;
  content: string;
  createDate?: Date;
  updateDate?: Date;
}

//用户相关信息
export interface UserMessage {
  id?: number;
  roleId?: number;
  name?: string;
  account?: string;
  password: string;
  createDate?: Date;
  updateDate?: Date;
}
