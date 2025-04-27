import { message } from 'antd';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

/**
 * Base API request handler with error handling
 */
async function fetchApi<T>(
  url: string, 
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `请求失败: ${response.status}`;
      
      message.error(errorMessage);
      return { success: false, error: errorMessage };
    }

    const data = await response.json();
    return { data, success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '请求异常';
    message.error(errorMessage);
    return { success: false, error: errorMessage };
  }
}

export { fetchApi };
export type { ApiResponse }; 