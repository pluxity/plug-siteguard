import { useState, useMemo } from 'react';
import { GridLayout, Widget, GridTemplate, Skeleton } from '@plug-siteguard/ui';
import { ChevronLeft, ChevronRight, Grid2X2, Grid3X3, LayoutGrid, Maximize2 } from 'lucide-react';

import { useCCTVList } from '../../lib/webrtc';
import { default as WEBRTCCCTV } from '../dashboard/components/CCTV-WebRTC';

/**
 * CCTV 레이아웃 템플릿 정의
 * 순서: 16개 → 9개 → 4개 → 1+3 → 1개
 */
const CCTV_TEMPLATES: Record<string, GridTemplate & { label: string; icon: typeof Grid2X2; count: number }> = {
  '4x4': {
    id: '4x4',
    name: '4x4',
    label: '16개',
    icon: LayoutGrid,
    count: 16,
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
  '3x3': {
    id: '3x3',
    name: '3x3',
    label: '9개',
    icon: Grid3X3,
    count: 9,
    columns: 3,
    rows: 3,
    cells: Array.from({ length: 9 }, (_, i) => ({
      id: `cell-${i + 1}`,
      colStart: (i % 3) + 1,
      colSpan: 1,
      rowStart: Math.floor(i / 3) + 1,
      rowSpan: 1,
    })),
  },
  '2x2': {
    id: '2x2',
    name: '2x2',
    label: '4개',
    icon: Grid2X2,
    count: 4,
    columns: 2,
    rows: 2,
    cells: [
      { id: 'cell-1', colStart: 1, colSpan: 1, rowStart: 1, rowSpan: 1 },
      { id: 'cell-2', colStart: 2, colSpan: 1, rowStart: 1, rowSpan: 1 },
      { id: 'cell-3', colStart: 1, colSpan: 1, rowStart: 2, rowSpan: 1 },
      { id: 'cell-4', colStart: 2, colSpan: 1, rowStart: 2, rowSpan: 1 },
    ],
  },
  '1+3': {
    id: '1+3',
    name: '1+3',
    label: '1+3',
    icon: LayoutGrid,
    count: 4,
    columns: 4,
    rows: 3,
    cells: [
      { id: 'cell-main', colStart: 1, colSpan: 3, rowStart: 1, rowSpan: 3 },
      { id: 'cell-1', colStart: 4, colSpan: 1, rowStart: 1, rowSpan: 1 },
      { id: 'cell-2', colStart: 4, colSpan: 1, rowStart: 2, rowSpan: 1 },
      { id: 'cell-3', colStart: 4, colSpan: 1, rowStart: 3, rowSpan: 1 },
    ],
  },
  '1x1': {
    id: '1x1',
    name: '1x1',
    label: '1개',
    icon: Maximize2,
    count: 1,
    columns: 1,
    rows: 1,
    cells: [
      { id: 'cell-1', colStart: 1, colSpan: 1, rowStart: 1, rowSpan: 1 },
    ],
  },
};

export default function CctvPage() {
  const { cctvList, loading } = useCCTVList();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('2x2');
  const [currentPage, setCurrentPage] = useState(0);

  const template = CCTV_TEMPLATES[selectedTemplate];
  const itemsPerPage = template.count;
  const totalPages = Math.ceil(cctvList.length / itemsPerPage);

  // 현재 페이지에 표시할 CCTV 목록
  const currentCCTVs = useMemo(() => {
    const start = currentPage * itemsPerPage;
    return cctvList.slice(start, start + itemsPerPage);
  }, [cctvList, currentPage, itemsPerPage]);

  // 페이지 변경 시 범위 체크
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const newTemplate = CCTV_TEMPLATES[templateId];
    const newTotalPages = Math.ceil(cctvList.length / newTemplate.count);
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
          <p className="text-gray-600">전체 {cctvList.length}개 스트림</p>
        </div>

        {/* 컨트롤 영역 */}
        <div className="flex items-center gap-4">
          {/* 템플릿 선택 */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {Object.entries(CCTV_TEMPLATES).map(([id, tmpl]) => {
              const Icon = tmpl.icon;
              return (
                <button
                  key={id}
                  onClick={() => handleTemplateChange(id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                    selectedTemplate === id
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title={tmpl.label}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tmpl.label}</span>
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
      <GridLayout
        template={template}
        editable={true}
        gap={16}
        className="flex-1 !overflow-hidden"
      >
        {template.cells.map((cell, index) => {
          const cctv = currentCCTVs[index];

          return (
            <Widget
              key={cell.id}
              id={cctv?.id || cell.id}
              className="bg-gray-900"
              border={false}
              contentClassName="p-0 h-full flex items-center justify-center"
            >
              {cctv ? (
                <WEBRTCCCTV streamId={cctv.id} className="w-full h-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <span className="text-sm">No Signal</span>
                </div>
              )}
            </Widget>
          );
        })}
      </GridLayout>

      {/* 하단 안내 */}
      <div className="mt-4 text-center text-sm text-gray-500">
        <span className="bg-gray-100 px-2 py-1 rounded">Ctrl</span> + 드래그로 CCTV 위치 교환
      </div>
    </div>
  );
}
