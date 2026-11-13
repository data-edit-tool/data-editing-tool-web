import { ICode } from './interface';

export interface IUserWorkspaceManagementDetail {
  all_projects: IUserWorkspaceManagementAvailableList[];
  all_projects_by_user_id: IUserWorkspaceManagementAvailableList[];
  workspace_name: string;
  is_viewer: boolean;
}

export interface IUserWorkspaceManagementAvailableList {
  project_id: string;
  project_name: string;
  post_status: string;
  data_type: ICode;
  tool_type: ICode;
  client_ctg_id: string;
  is_multiple_work: boolean;
  created: string;
}

export interface IUserWorkspaceManagementGuide {
  guides: IUserWorkspaceManagementGuideList[];
}

export interface IUserWorkspaceManagementGuideList {
  guide_file_url: string;
}
