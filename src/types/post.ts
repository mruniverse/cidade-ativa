export interface Post {
  id: string;
  nome: string;          
  conteudo: string;      
  tipo: string;          
  latitude: number;
  longitude: number;
  criado_em: string;     
  imagem?: string | null;
  autor?: {
    id: string;
    username: string;
  };
}
