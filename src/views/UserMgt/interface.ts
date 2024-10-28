export type UserData = {
  name: string;
  id: string;
  state: number;
  remark: string;
  addr: string;
  number: string;
};

export type PamgtUserData = {
  name: string;
  id: string;
  status:number;
  password: string;
  adminid:number;
};

export interface UserSearch {
  pageNum: number;
  pageSize: number;
  name: string;
}

export interface UserList {
  list: UserData[];
  total: number;
}
export interface SubProcess{
  id:number;
  address:string;
  name:string;
  type:string;
  startTime:string;
  deadline:string;
  content_text:string;
  content_document:string;
  content_picture:string;
  state:number;
  activityId:string;
  proposalId:string;
  adminid:number;
}
export enum UserType {
  Admin = 1,
 
}

export const UserTypes = [
  {
    label: '子管理员',
    value: UserType.Admin,
  },
  
];

export enum UserTypeZhCn {
  '子管理员' = UserType.Admin,
  
}
