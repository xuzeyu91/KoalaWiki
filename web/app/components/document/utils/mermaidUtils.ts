import mermaid from 'mermaid';

/**
 * 初始化Mermaid图表配置
 * @param isDarkMode 是否为暗黑模式
 */
export const initializeMermaid = (isDarkMode: boolean) => {
  mermaid.initialize({
    startOnLoad: false, // 手动控制渲染
    theme: isDarkMode ? 'dark' : 'default',
    securityLevel: 'loose',
    flowchart: { 
      htmlLabels: true,
      curve: 'basis',
      useMaxWidth: true
    },
    sequence: {
      showSequenceNumbers: true,
      actorMargin: 80,
      useMaxWidth: true
    },
    gantt: {
      axisFormat: '%Y-%m-%d',
      titleTopMargin: 25,
      barHeight: 20,
      barGap: 4
    },
    er: {
      useMaxWidth: true
    },
    journey: {
      useMaxWidth: true
    },
    pie: {
      useMaxWidth: true
    }
  });
};

/**
 * 渲染页面上的所有Mermaid图表
 * @returns 一个Promise，表示渲染操作的完成
 */
export const renderMermaidDiagrams = async (): Promise<boolean> => {
  try {
    // 给渲染一些时间以确保DOM已更新
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 查找所有mermaid图表并渲染
    const diagrams = document.querySelectorAll('.mermaid');
    if (diagrams.length > 0) {
      await mermaid.run({
        querySelector: '.mermaid',
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error('渲染图表时出错:', error);
    return false;
  }
}; 