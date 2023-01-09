# config-center-front

##### features 1（后端服务）

1. 创建项目配置表结构-id name remark createDate updateDate content projectId
   1. 创建项目配置controller 创建项目配置service 创建项目配置路由
   2. 接口 list项目项目配置、 add新增项目配置、 update更新项目配置 、delete删除项目配置
   3. postman测试相关接口
2. 创建user表 -id name createDate updateDate roleId acount password
   1. 创建user controller 创建user service 创建user 路由
   2. 接口 list user列表 、 add新增user 、 update更新user  、delete删除user 
   3. postman测试相关接口
3. 项目mock配置添加函数配置，能在请求的时候，通过请求header或者域名，执行返回不同的配置结果，处理动态配置的情况
4. 接口增加安全检验，添加接口签名-防止ddos攻击
5. 添加项目分类-以业务来区分
6. 创建项目分类表 -id name classify createDate updateDate
   1. 创建项目分类controller 创建项目分类service 创建项目分类路由
   2. 接口 list 项目分类列表 、 add新增项目分类 、 update更新项目分类  、delete删除项目分类
   3. postman测试相关接口

##### features 2（后端服务）

1. 创建用户权限表 -id name permission  createDate updateDate
   1. 创建用户权限 controller 创建用户权限 service 创建用户权限 路由
   2. 接口 list 用户权限列表 、 add新增用户权限 、 update更新用户权限  、delete删除用户权限
   3. postman测试相关接口



##### 配置中心（前端项目）

1. 初始化项目
   1.  配置全局axios请求，实例化，超时时间，请求地址，添加请求、响应拦截，全局错误状态捕获，请求头token，全局提示框
   2. 配置代理-proxy，与服务器交互
   3. 配置以业务管理请求地址和请求api
   4. 添加公共函数模块-localstorage封装，判断对象为空等
   5. 添加config模块，区分develop、product环境配置
2. 登陆界面
   1. 输入字符校验
   2. 密码错误提醒
   3. 非空判断提示
   4. 添加按钮函数防抖
   5. 添加修改密码界面
   6. 联调登录接口
3. 项目分类
   1. 分类列表，分类添加，分类删除，分类编辑
   2. 联调分类接口
4. 项目配置json
   1. 项目json配置 
      1. 对象（方法）转json存贮到数据库中
      2. 对象格式检验
      3. 编辑界面的编辑器 
      4. 配置完成动态路由添加
      5. 格式化配置
      6. 保存配置
      7. api联调
   2. 界面可视化配置json
      1. 新增字段，新增对应属性值
      2. 编辑完成后预览功能
      3. api联调
   3. 用户权限分配
      1. 用户配置权限界面（单选多选，取消权限）
      2. 保存配置
      3. api联调
