import { useState, useMemo, useEffect } from 'react';
import { Skeleton, GridLayout, Widget } from '@plug-siteguard/ui';
import type { GridTemplate } from '@plug-siteguard/ui';
import { ChevronLeft, ChevronRight, Square, Grid2X2, LayoutGrid, Grid3X3 } from 'lucide-react';

import { useCCTVList, useWHEPCleanup } from '@/lib/whep';
import { CCTVWHEP } from '@/components/cctvs';

/**
 * CCTV 레이아웃 템플릿 정의
 */
const GRID_TEMPLATES: Record<string, GridTemplate> = {
  '1x1': {
    id: '1x1',
    name: '1개',
    columns: 1,
    rows: 1,
    cells: [{ id: 'cell-1', colStart: 1, colSpan: 1, rowStart: 1, rowSpan: 1 }],
  },
  '2x2': {
    id: '2x2',
    name: '4개',
    columns: 2,
    rows: 2,
    cells: [
      { id: 'cell-1', colStart: 1, colSpan: 1, rowStart: 1, rowSpan: 1 },
      { id: 'cell-2', colStart: 2, colSpan: 1, rowStart: 1, rowSpan: 1 },
      { id: 'cell-3', colStart: 1, colSpan: 1, rowStart: 2, rowSpan: 1 },
      { id: 'cell-4', colStart: 2, colSpan: 1, rowStart: 2, rowSpan: 1 },
    ],
  },
  '1+5': {
    id: '1+5',
    name: '6개',
    columns: 3,
    rows: 3,
    cells: [
      // 대형 (2x2)
      { id: 'cell-1', colStart: 1, colSpan: 2, rowStart: 1, rowSpan: 2 },
      // 오른쪽 상단
      { id: 'cell-2', colStart: 3, colSpan: 1, rowStart: 1, rowSpan: 1 },
      // 오른쪽 중간
      { id: 'cell-3', colStart: 3, colSpan: 1, rowStart: 2, rowSpan: 1 },
      // 하단 왼쪽
      { id: 'cell-4', colStart: 1, colSpan: 1, rowStart: 3, rowSpan: 1 },
      // 하단 중간
      { id: 'cell-5', colStart: 2, colSpan: 1, rowStart: 3, rowSpan: 1 },
      // 하단 오른쪽
      { id: 'cell-6', colStart: 3, colSpan: 1, rowStart: 3, rowSpan: 1 },
    ],
  },
  '4x4': {
    id: '4x4',
    name: '16개',
    columns: 4,
    rows: 4,
    cells: Array.from({ length: 16 }, (_, i) => ({
      id: `cell-${i + 1}`,
      colStart: (i % 4) + 1,
      colSpan: 1,
      rowStart: Math.floor(i / 4) + 1,
      rowSpan: 1,
    })),
  },
  '8x8': {
    id: '8x8',
    name: '64개',
    columns: 8,
    rows: 8,
    cells: Array.from({ length: 64 }, (_, i) => ({
      id: `cell-${i + 1}`,
      colStart: (i % 8) + 1,
      colSpan: 1,
      rowStart: Math.floor(i / 8) + 1,
      rowSpan: 1,
    })),
  },
};

type TemplateId = '1x1' | '2x2' | '1+5' | '4x4' | '8x8';

const TEMPLATE_ICONS: Record<TemplateId, typeof Square> = {
  '1x1': Square,
  '2x2': Grid2X2,
  '1+5': LayoutGrid,
  '4x4': Grid3X3,
  '8x8': LayoutGrid,
};

export default function CctvPage() {
  const { cctvList, loading } = useCCTVList();
  const cleanup = useWHEPCleanup();
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('2x2');
  const [currentPage, setCurrentPage] = useState(0);

  // 페이지 언마운트 시 모든 WHEP 스트림 연결 정리
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  const template = GRID_TEMPLATES[selectedTemplate];
  const itemsPerPage = template.cells.length;
  const totalPages = Math.ceil(cctvList.length / itemsPerPage);

  // 현재 페이지에 표시할 CCTV 목록
  const currentCCTVs = useMemo(() => {
    const start = currentPage * itemsPerPage;
    return cctvList.slice(start, start + itemsPerPage);
  }, [cctvList, currentPage, itemsPerPage]);

  // 페이지 변경 시 범위 체크
  const handleTemplateChange = (templateId: TemplateId) => {
    setSelectedTemplate(templateId);
    const newTemplate = GRID_TEMPLATES[templateId];
    const newTotalPages = Math.ceil(cctvList.length / newTemplate.cells.length);
    if (currentPage >= newTotalPages) {
      setCurrentPage(Math.max(0, newTotalPages - 1));
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="mb-4">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-video rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 h-full flex flex-col">
      {/* 헤더 */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">CCTV 모니터링</h1>
          <p className="text-gray-600">
            전체 {cctvList.length}개 스트림
            <span className="text-xs text-gray-400 ml-2">(Ctrl + 드래그로 위치 교환)</span>
          </p>
        </div>

        {/* 컨트롤 영역 */}
        <div className="flex items-center gap-4">
          {/* 템플릿 선택 */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {(Object.keys(GRID_TEMPLATES) as TemplateId[]).map((id) => {
              const tmpl = GRID_TEMPLATES[id];
              const Icon = TEMPLATE_ICONS[id];
              return (
                <button
                  key={id}
                  onClick={() => handleTemplateChange(id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                    selectedTemplate === id
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title={tmpl.name}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tmpl.name}</span>
                </button>
              );
            })}
          </div>

          {/* 페이징 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-600 min-w-[80px] text-center">
              {currentPage + 1} / {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage >= totalPages - 1}
              className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* CCTV 그리드 */}
      <div className={`flex-1 ${selectedTemplate === '8x8' ? 'overflow-y-auto' : 'overflow-hidden'}`}>
        <GridLayout template={template} editable={true} gap={8} className="h-full">
          {template.cells.map((cell, index) => {
            const cctv = currentCCTVs[index];
            return (
              <Widget key={cctv?.id ?? `empty-${cell.id}`} id={`cctv-${index}`} border={false} contentClassName="p-0">
                {cctv ? (
                  <CCTVWHEP streamPath={cctv.id} className="w-full h-full" />
                ) : (
                  <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center text-gray-500">
                    <span className="text-sm">No Signal</span>
                  </div>
                )}
              </Widget>
            );
          })}
        </GridLayout>
      </div>
    </div>
  );
}
