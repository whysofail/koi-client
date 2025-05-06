import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface News {
  id: number;
  slug: string;
  title: string;
  image: string;
  description: string;
  type: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedNewsResponse {
  current_page: number;
  data: News[];
  total: number;
  per_page: number;
  last_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
}

const fetchNewsList = async (
  page = 1,
): Promise<ApiResponse<PaginatedNewsResponse>> => {
  const { data } = await axios.get<ApiResponse<PaginatedNewsResponse>>(
    `${process.env.NEXT_PUBLIC_APPLICATION_URL}/api/news?page=${page}`,
  );
  return data;
};

export const useNewsList = (page = 1, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: ["newsList", page],
    queryFn: () => fetchNewsList(page),
    enabled: options?.enabled ?? true,
  });

const fetchNewsDetail = async (slug: string): Promise<ApiResponse<News>> => {
  const { data } = await axios.get<ApiResponse<News>>(
    `${process.env.NEXT_PUBLIC_APPLICATION_URL}/api/news?slug=${slug}`,
  );
  return data;
};

export const useNewsDetail = (slug: string, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: ["newsDetail", slug],
    queryFn: () => fetchNewsDetail(slug),
    enabled: options?.enabled ?? !!slug,
  });
