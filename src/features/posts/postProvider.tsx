import {
  createContext,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { PostService } from './post.service';
import { Post } from './post.types';

interface PostContextType {
  posts: Post[];
  loading: boolean;
  error: string | null;
  loadPosts: (page: number, lat: number, lon: number) => Promise<void>;
  refreshPosts: (lat: number, lon: number) => Promise<void>;
  getPostById: (id: string) => Promise<Post | null>;
  loadPostComments: (postId: string) => Promise<void>;
  createPost: (formData: FormData) => Promise<Post>;
  updatePost: (id: string, data: Partial<Post>) => Promise<Post>;
  deletePost: (id: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<void>;
  clearError: () => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export function usePost(): PostContextType {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePost must be used within a PostProvider');
  }
  return context;
}

interface PostProviderProps {
  children: ReactNode;
  postService?: PostService; // Allow dependency injection for testing
}

export function PostProvider({
  children,
  postService,
}: Readonly<PostProviderProps>): ReactElement {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const service = useMemo(
    () => postService ?? new PostService(),
    [postService]
  );

  const loadPosts = useCallback(
    async (page: number, lat: number, lon: number) => {
      setLoading(true);
      setError(null);
      try {
        const data = await service.getPosts(page, lat, lon);
        if (!data) throw new Error('Nenhuma postagem encontrada');

        setPosts(prev => {
          if (page === 1) return data;
          // Remove duplicates based on ID
          const existingIds = new Set(prev.map(p => p.id));
          const newPosts = data.filter(p => !existingIds.has(p.id));
          return [...prev, ...newPosts];
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [service]
  );

  const refreshPosts = useCallback(
    async (lat: number, lon: number) => {
      await loadPosts(1, lat, lon);
    },
    [loadPosts]
  );

  const getPostById = useCallback(
    async (id: string): Promise<Post | null> => {
      // First check if we already have it in state
      const existingPost = posts.find(p => p.id === id);
      if (existingPost) return existingPost;

      try {
        return await service.getPostById(id);
      } catch (err: any) {
        setError(err.message);
        return null;
      }
    },
    [posts, service]
  );

  const loadPostComments = useCallback(
    async (postId: string): Promise<void> => {
      try {
        const postWithComments = await service.getPostById(postId);
        setPosts(prev =>
          prev.map(p => (p.id === postId ? postWithComments : p))
        );
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Erro ao carregar comentários';
        setError(message);
      }
    },
    [service]
  );

  const createPost = useCallback(
    async (formData: FormData): Promise<Post> => {
      setLoading(true);
      setError(null);
      try {
        const newPost = await service.createPost(formData);
        setPosts(prev => [newPost, ...prev]);
        return newPost;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [service]
  );

  const updatePost = useCallback(
    async (id: string, data: Partial<Post>): Promise<Post> => {
      setLoading(true);
      setError(null);
      try {
        const updatedPost = await service.updatePost(id, data);
        setPosts(prev => prev.map(p => (p.id === id ? updatedPost : p)));
        return updatedPost;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [service]
  );

  const deletePost = useCallback(
    async (id: string): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        await service.deletePost(id);
        setPosts(prev => prev.filter(p => p.id !== id));
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [service]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const addComment = useCallback(
    async (postId: string, content: string): Promise<void> => {
      try {
        await service.createComment({ postagem: postId, conteudo: content });
        // Refresh the post to get updated comments
        const updatedPost = await service.getPostById(postId);
        setPosts(prev => prev.map(p => (p.id === postId ? updatedPost : p)));
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Erro ao adicionar comentário';
        setError(message);
        throw err;
      }
    },
    [service]
  );

  const value = useMemo(
    () => ({
      posts,
      loading,
      error,
      loadPosts,
      refreshPosts,
      getPostById,
      loadPostComments,
      createPost,
      updatePost,
      deletePost,
      addComment,
      clearError,
    }),
    [
      posts,
      loading,
      error,
      loadPosts,
      refreshPosts,
      getPostById,
      loadPostComments,
      createPost,
      updatePost,
      deletePost,
      addComment,
      clearError,
    ]
  );

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
}
