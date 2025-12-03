export type User = {
  id: string;
  username: string;
  email: string;
  criado_em: string;
  is_staff: boolean;
  isGuest?: boolean;
};
