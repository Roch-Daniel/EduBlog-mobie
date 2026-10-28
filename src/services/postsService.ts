import type { IDiscipline } from "@/interfaces/IDiscipline";
import type { IPost } from "@/interfaces/IPost";
import type { IPostStatus } from "@/interfaces/IPostStatus";
import type { IPostValues } from "@/interfaces/IPostValues";

interface ApiResponse<T> {
  data: T;
}

interface PostsRequest {
  <T>(
    path: string,
    options?: {
      method?: string;
      body?: unknown;
    },
  ): Promise<T>;
}

export async function getPosts(request: PostsRequest): Promise<IPost[]> {
  const response = await request<ApiResponse<IPost[]>>("/posts", {
    method: "GET",
  });

  return response.data;
}

export async function getAllPosts(request: PostsRequest): Promise<IPost[]> {
  const response = await request<ApiResponse<IPost[]>>("/posts/all", {
    method: "GET",
  });

  return response.data;
}

export async function getPostById(
  request: PostsRequest,
  id: string,
): Promise<IPost> {
  const response = await request<ApiResponse<IPost>>(`/posts/${id}`, {
    method: "GET",
  });

  return response.data;
}

export async function getDisciplines(
  request: PostsRequest,
): Promise<IDiscipline[]> {
  const response = await request<ApiResponse<IDiscipline[]>>(
    "/catalog/disciplines",
    {
      method: "GET",
    },
  );

  return response.data;
}

export async function getPostStatuses(
  request: PostsRequest,
): Promise<IPostStatus[]> {
  const response = await request<ApiResponse<IPostStatus[]>>(
    "/catalog/status",
    {
      method: "GET",
    },
  );

  return response.data;
}

export async function createPost(
  request: PostsRequest,
  payload: IPostValues,
): Promise<IPost> {
  const response = await request<ApiResponse<IPost>>("/posts", {
    method: "POST",
    body: payload,
  });

  return response.data;
}

export async function updatePost(
  request: PostsRequest,
  id: string,
  payload: IPostValues,
): Promise<IPost> {
  const response = await request<ApiResponse<IPost>>(`/posts/${id}`, {
    method: "PUT",
    body: payload,
  });

  return response.data;
}

export async function deletePost(
  request: PostsRequest,
  id: string,
): Promise<void> {
  await request<void>(`/posts/${id}`, {
    method: "DELETE",
  });
}
