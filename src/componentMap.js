// src/componentMap.js
export const componentMap = {
  'home/SubHome': () => import('./views/home/SubHome.vue'),
  'Activity/Activity': () => import('./views/Activity/Activity.vue'),
  'Proposal/Proposal': () => import('./views/Proposal/Proposal.vue'),
  'home/SupHome': () => import('./views/home/SupHome.vue'),
  'UserMgt/PAMgtUser': () => import('./views/UserMgt/PAMgtUser.vue'),
  'UserMgt/NormalUser': () => import('./views/UserMgt/NormalUser.vue'),
  'UserMgt/ProfessionalUser': () => import('./views/UserMgt/ProfessionalUser.vue'),
  'Team/Team': () => import('./views/Team/Team.vue'),
};
