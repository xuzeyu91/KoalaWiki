'use client'

import { Suspense } from 'react';
import { getWarehouseOverview } from '../../services';
import { RepositoryView } from './RepositoryView';
import { ServerLoadingErrorState } from '../../components/document/ServerComponents';

// 这是服务器组件，用于获取数据
export default async function RepositoryPage({ params }: { params: { owner: string, name: string } }) {
  try {
    const response = await getWarehouseOverview(params.owner, params.name);
    
    // 如果获取数据失败，显示错误信息
    if (!response.success || !response.data) {
      return (
        <ServerLoadingErrorState
          loading={false}
          error={'抱歉，仓库不存在'}
          owner={params.owner}
          name={params.name}
        />
      );
    }

    // 将数据传递给客户端组件进行渲染
    return (
      <Suspense fallback={<ServerLoadingErrorState loading={true} owner={params.owner} name={params.name} />}>
        <RepositoryView
          owner={params.owner}
          name={params.name}
          document={response.data}
        />
      </Suspense>
    );
  } catch (error) {
    return (
      <ServerLoadingErrorState
        loading={false}
        error={'抱歉，获取仓库信息时发生错误'}
        owner={params.owner}
        name={params.name}
      />
    );
  }
}
