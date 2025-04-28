import { message } from 'antd';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
  isSuccess:boolean;
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

    // 根据响应类型返回
    if (response.headers.get("content-type") === "text/markdown") {
      const data = await response.text();

      // @ts-ignore
      return { data, success: true }
    } else {
      const data = await response.json();
      return { data, success: true,isSuccess:true };
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '请求异常';
    message.error(errorMessage);
    return { success: false, error: errorMessage };
  }
}

export { fetchApi };
export type { ApiResponse }; 