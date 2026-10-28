import type { IPost } from "../interfaces/IPost";

interface ApiResponse<T> {
  data: T;
}

interface PostsRequest {
  <T>(
    path: string,
    options?: {
      method?: string;
      signal?: AbortSignal;
    },
  ): Promise<T>;
}

export async function getPosts(
  request: PostsRequest,
  signal?: AbortSignal,
): Promise<IPost[]> {
  const response = await request<ApiResponse<IPost[]>>("/posts", {
    method: "GET",
    signal,
  });

  return response.data;
}

export interface PostSearchParams {
  query?: string;
  discipline?: string;
  author?: string;
}

export interface PostDiscipline {
  _id: string;
  label: string;
  order?: number;
  isActive?: boolean;
}

export async function searchPosts(
  request: PostsRequest,
  filters: PostSearchParams,
  signal?: AbortSignal,
): Promise<IPost[]> {
  const params = new URLSearchParams();

  if (filters.query?.trim()) params.set("q", filters.query.trim());
  if (filters.discipline) params.set("discipline", filters.discipline);
  if (filters.author) params.set("author", filters.author);

  if (!params.size) return getPosts(request, signal);

  const response = await request<ApiResponse<IPost[]>>(
    `/posts/search?${params.toString()}`,
    { method: "GET", signal },
  );

  return response.data;
}

export async function getPostById(
  request: PostsRequest,
  id: string,
  signal?: AbortSignal,
): Promise<IPost> {
  const response = await request<ApiResponse<IPost>>(
    `/posts/${encodeURIComponent(id)}`,
    { method: "GET", signal },
  );

  return response.data;
}

export async function getPostDisciplines(
  request: PostsRequest,
  signal?: AbortSignal,
): Promise<PostDiscipline[]> {
  const response = await request<ApiResponse<PostDiscipline[]>>(
    "/catalog/disciplines",
    { method: "GET", signal },
  );

  return response.data
    .filter((discipline) => discipline.isActive !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function getAllPosts(request: PostsRequest): Promise<IPost[]> {
  const response = await request<ApiResponse<IPost[]>>("/posts/all", {
    method: "GET",
  });

  return response.data;
}
