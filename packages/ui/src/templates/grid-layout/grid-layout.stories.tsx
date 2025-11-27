import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { GridLayout } from "./grid-layout.component"
import { GridTemplate } from "./grid-layout.types"
import { Widget } from "../../molecules/widget"
import { Badge } from "../../atoms/badge"
import { Button } from "../../atoms/button"
import {
  TrendingUp,
  TrendingDown,
  Users,
  MapPin,
  Calendar,
  AlertCircle,
  Activity,
  GripVertical,
} from "lucide-react"

const meta: Meta<typeof GridLayout> = {
  title: "Templates/GridLayout",
  component: GridLayout,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "위젯 기반의 그리드 레이아웃 템플릿입니다. 12컬럼 그리드 시스템을 사용하여 Widget 컴포넌트를 자유롭게 배치할 수 있습니다. 대시보드, 테이블 페이지 등 모든 메인 콘텐츠 레이아웃에 사용됩니다.",
      },
    },
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof GridLayout>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "기본 위젯 그리드 레이아웃입니다. 12컬럼 그리드에 다양한 크기의 위젯을 배치합니다.",
      },
    },
  },
  render: () => (
    <div className="h-screen bg-gray-100">
      <GridLayout className="p-6" columns={12} gap={16}>
        {/* 상단 통계 위젯 4개 (각 3컬럼) */}
        <Widget colSpan={3} title="총 시설">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">12</p>
              <p className="text-xs text-gray-500 mt-1">운영중</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Widget>

        <Widget colSpan={3} title="이용객">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">55</p>
              <p className="text-xs text-gray-500 mt-1">명 / 오늘</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Widget>

        <Widget colSpan={3} title="경기 일정">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">153</p>
              <p className="text-xs text-gray-500 mt-1">이번 주</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Widget>

        <Widget colSpan={3} title="알림">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">12</p>
              <p className="text-xs text-gray-500 mt-1">미확인</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Widget>

        {/* 중앙 큰 위젯 (8컬럼) + 사이드 위젯 (4컬럼) */}
        <Widget colSpan={8} rowSpan={2} title="지도 보기" contentClassName="p-0 h-[400px]">
          <div className="h-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 mx-auto mb-2 text-green-700" />
              <p className="text-gray-600">3D 지도 영역</p>
            </div>
          </div>
        </Widget>

        <Widget colSpan={4} title="일일 현황">
          <div className="space-y-3">
            {[
              { name: "중앙공원", status: "정상", count: 12 },
              { name: "율동공원", status: "정상", count: 8 },
              { name: "한강공원", status: "점검중", count: 5 },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-2">
                  <Badge variant={item.status === "정상" ? "default" : "secondary"} className="text-xs">
                    {item.status}
                  </Badge>
                  <span className="text-sm">{item.name}</span>
                </div>
                <span className="text-sm text-gray-500">{item.count}명</span>
              </div>
            ))}
          </div>
        </Widget>

        <Widget colSpan={4} title="경기 일정">
          <div className="space-y-3">
            {[
              { event: "축구 경기", location: "중앙공원", time: "14:00" },
              { event: "야구 경기", location: "율동공원", time: "16:00" },
              { event: "테니스 대회", location: "한강공원", time: "18:00" },
            ].map((item, i) => (
              <div key={i} className="py-2 border-b last:border-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.event}</span>
                  <span className="text-xs text-gray-500">{item.time}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{item.location}</p>
              </div>
            ))}
          </div>
        </Widget>

        {/* 하단 테이블 위젯 (전체 12컬럼) */}
        <Widget colSpan={12} title="최근 알람">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium text-gray-600">시간</th>
                  <th className="text-left py-2 font-medium text-gray-600">장소</th>
                  <th className="text-left py-2 font-medium text-gray-600">내용</th>
                  <th className="text-left py-2 font-medium text-gray-600">상태</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { time: "17:30", location: "중앙공원", content: "센서 이상 감지", status: "확인중" },
                  { time: "16:45", location: "율동공원", content: "온도 경고", status: "처리완료" },
                  { time: "15:20", location: "한강공원", content: "습도 경고", status: "처리완료" },
                ].map((item, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-3 text-gray-500">{item.time}</td>
                    <td className="py-3">{item.location}</td>
                    <td className="py-3">{item.content}</td>
                    <td className="py-3">
                      <Badge variant={item.status === "확인중" ? "outline" : "secondary"}>
                        {item.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Widget>
      </GridLayout>
    </div>
  ),
}

export const SimpleGrid: Story = {
  parameters: {
    docs: {
      description: {
        story: "간단한 6컬럼 그리드 레이아웃입니다.",
      },
    },
  },
  render: () => (
    <div className="h-screen bg-gray-100">
      <GridLayout className="p-6" columns={6} gap={16}>
        <Widget colSpan={2} title="위젯 A">
          <div className="h-[100px] flex items-center justify-center text-gray-500">
            콘텐츠 A
          </div>
        </Widget>
        <Widget colSpan={2} title="위젯 B">
          <div className="h-[100px] flex items-center justify-center text-gray-500">
            콘텐츠 B
          </div>
        </Widget>
        <Widget colSpan={2} title="위젯 C">
          <div className="h-[100px] flex items-center justify-center text-gray-500">
            콘텐츠 C
          </div>
        </Widget>
        <Widget colSpan={6} title="전체 너비 위젯">
          <div className="h-[200px] bg-gray-50 rounded flex items-center justify-center text-gray-500">
            전체 너비 콘텐츠
          </div>
        </Widget>
      </GridLayout>
    </div>
  ),
}

export const DashboardStyle: Story = {
  parameters: {
    docs: {
      description: {
        story: "대시보드 스타일의 위젯 레이아웃입니다.",
      },
    },
  },
  render: () => (
    <div className="h-screen bg-gray-100">
      <GridLayout className="p-6" columns={12} gap={20}>
        {/* KPI 카드 */}
        {[
          { title: "총 매출", value: "₩45.2M", change: "+12.5%", up: true, icon: Activity },
          { title: "주문 건수", value: "1,234", change: "+8.2%", up: true, icon: Users },
          { title: "평균 단가", value: "₩36,600", change: "-3.1%", up: false, icon: TrendingDown },
          { title: "전환율", value: "3.24%", change: "+0.5%", up: true, icon: TrendingUp },
        ].map((kpi, i) => {
          const Icon = kpi.icon
          return (
            <Widget key={i} colSpan={3}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">{kpi.title}</p>
                  <p className="text-2xl font-bold mt-1">{kpi.value}</p>
                  <div className={`flex items-center gap-1 mt-2 text-xs ${kpi.up ? "text-green-600" : "text-red-600"}`}>
                    {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {kpi.change}
                  </div>
                </div>
                <Icon className="w-8 h-8 text-gray-300" />
              </div>
            </Widget>
          )
        })}

        {/* 차트 영역 */}
        <Widget colSpan={8} title="매출 추이" contentClassName="h-[300px] p-0">
          <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
            <p className="text-gray-500">Line Chart</p>
          </div>
        </Widget>

        <Widget colSpan={4} title="카테고리별" contentClassName="h-[300px] p-0">
          <div className="h-full bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
            <p className="text-gray-500">Pie Chart</p>
          </div>
        </Widget>
      </GridLayout>
    </div>
  ),
}

export const WithoutTitle: Story = {
  parameters: {
    docs: {
      description: {
        story: "타이틀 없는 위젯 레이아웃입니다.",
      },
    },
  },
  render: () => (
    <div className="h-screen bg-gray-100">
      <GridLayout className="p-6" columns={4} gap={16}>
        <Widget colSpan={1}>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">128</p>
            <p className="text-sm text-gray-500 mt-1">방문자</p>
          </div>
        </Widget>
        <Widget colSpan={1}>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">45</p>
            <p className="text-sm text-gray-500 mt-1">주문</p>
          </div>
        </Widget>
        <Widget colSpan={1}>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">₩2.4M</p>
            <p className="text-sm text-gray-500 mt-1">매출</p>
          </div>
        </Widget>
        <Widget colSpan={1}>
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600">3.2%</p>
            <p className="text-sm text-gray-500 mt-1">전환율</p>
          </div>
        </Widget>
        <Widget colSpan={4}>
          <div className="h-[300px] bg-gray-50 rounded flex items-center justify-center text-gray-500">
            메인 콘텐츠
          </div>
        </Widget>
      </GridLayout>
    </div>
  ),
}

/**
 * 스토리북용 템플릿 정의 (실제 사용 시에는 app에서 정의)
 */
const DEMO_TEMPLATES: Record<string, GridTemplate> = {
  "2x2": {
    id: "2x2",
    name: "2x2 Grid",
    columns: 2,
    rows: 2,
    cells: [
      { id: "cell-1", colStart: 1, colSpan: 1, rowStart: 1, rowSpan: 1 },
      { id: "cell-2", colStart: 2, colSpan: 1, rowStart: 1, rowSpan: 1 },
      { id: "cell-3", colStart: 1, colSpan: 1, rowStart: 2, rowSpan: 1 },
      { id: "cell-4", colStart: 2, colSpan: 1, rowStart: 2, rowSpan: 1 },
    ],
  },
  "1-2": {
    id: "1-2",
    name: "Top 1, Bottom 2",
    columns: 2,
    rows: 2,
    cells: [
      { id: "cell-1", colStart: 1, colSpan: 2, rowStart: 1, rowSpan: 1 },
      { id: "cell-2", colStart: 1, colSpan: 1, rowStart: 2, rowSpan: 1 },
      { id: "cell-3", colStart: 2, colSpan: 1, rowStart: 2, rowSpan: 1 },
    ],
  },
  "sidebar": {
    id: "sidebar",
    name: "Sidebar Layout",
    columns: 3,
    rows: 1,
    cells: [
      { id: "cell-sidebar", colStart: 1, colSpan: 1, rowStart: 1, rowSpan: 1 },
      { id: "cell-main", colStart: 2, colSpan: 2, rowStart: 1, rowSpan: 1 },
    ],
  },
}

/**
 * 템플릿 시스템 데모 컴포넌트
 */
const TemplateDemo = () => {
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string>("2x2")
  const selectedTemplate = DEMO_TEMPLATES[selectedTemplateId]

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      <div className="p-4 bg-white border-b flex items-center gap-4">
        <span className="text-sm font-medium">템플릿 선택:</span>
        <div className="flex gap-2">
          {Object.entries(DEMO_TEMPLATES).map(([id, template]) => (
            <Button
              key={id}
              variant={selectedTemplateId === id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTemplateId(id)}
            >
              {template.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-6">
        <GridLayout template={selectedTemplate} gap={16} className="h-full">
          <Widget id="widget-1" title="위젯 1" className="bg-blue-50">
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Users className="w-8 h-8 mx-auto text-blue-600" />
                <p className="mt-2 text-sm text-blue-700">사용자 통계</p>
              </div>
            </div>
          </Widget>
          <Widget id="widget-2" title="위젯 2" className="bg-green-50">
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-8 h-8 mx-auto text-green-600" />
                <p className="mt-2 text-sm text-green-700">위치 정보</p>
              </div>
            </div>
          </Widget>
          <Widget id="widget-3" title="위젯 3" className="bg-yellow-50">
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Calendar className="w-8 h-8 mx-auto text-yellow-600" />
                <p className="mt-2 text-sm text-yellow-700">일정 관리</p>
              </div>
            </div>
          </Widget>
          <Widget id="widget-4" title="위젯 4" className="bg-purple-50">
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Activity className="w-8 h-8 mx-auto text-purple-600" />
                <p className="mt-2 text-sm text-purple-700">활동 로그</p>
              </div>
            </div>
          </Widget>
        </GridLayout>
      </div>
    </div>
  )
}

export const TemplateSystem: Story = {
  parameters: {
    docs: {
      description: {
        story: "템플릿 시스템을 사용한 레이아웃입니다. 상단에서 다른 템플릿을 선택하면 레이아웃이 변경됩니다. 실제 사용 시에는 app에서 템플릿을 정의합니다.",
      },
    },
  },
  render: () => <TemplateDemo />,
}

/**
 * Drag & Drop Swap 데모 컴포넌트
 */
const DragDropDemo = () => {
  const [layoutChanges, setLayoutChanges] = React.useState<string[]>([])

  const template: GridTemplate = {
    id: "drag-drop-demo",
    name: "Drag Drop Demo",
    columns: 2,
    rows: 2,
    cells: [
      { id: "cell-1", colStart: 1, colSpan: 1, rowStart: 1, rowSpan: 1 },
      { id: "cell-2", colStart: 2, colSpan: 1, rowStart: 1, rowSpan: 1 },
      { id: "cell-3", colStart: 1, colSpan: 1, rowStart: 2, rowSpan: 1 },
      { id: "cell-4", colStart: 2, colSpan: 1, rowStart: 2, rowSpan: 1 },
    ],
  }

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      <div className="p-4 bg-white border-b">
        <div className="flex items-center gap-2 text-sm">
          <GripVertical className="w-4 h-4 text-gray-500" />
          <span className="font-medium">편집 모드 활성화</span>
          <span className="text-gray-500">- 위젯을 드래그하여 위치를 교환할 수 있습니다</span>
        </div>
      </div>

      <div className="flex-1 p-6">
        <GridLayout
          template={template}
          editable={true}
          gap={16}
          onLayoutChange={(event) => {
            if (event.type === "swap" && event.swappedWidgets) {
              setLayoutChanges((prev) => [
                ...prev,
                `${event.swappedWidgets![0]} ↔ ${event.swappedWidgets![1]}`,
              ])
            }
          }}
          className="h-full"
        >
          <Widget id="weather" title="날씨" className="bg-sky-50">
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl">☀️</div>
                <p className="mt-2 text-lg font-bold">24°C</p>
                <p className="text-sm text-gray-500">맑음</p>
              </div>
            </div>
          </Widget>
          <Widget id="map" title="지도" className="bg-emerald-50">
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 mx-auto text-emerald-600" />
                <p className="mt-2 text-sm text-emerald-700">지도 위젯</p>
              </div>
            </div>
          </Widget>
          <Widget id="stats" title="통계" className="bg-violet-50">
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 mx-auto text-violet-600" />
                <p className="mt-2 text-sm text-violet-700">통계 위젯</p>
              </div>
            </div>
          </Widget>
          <Widget id="alerts" title="알림" className="bg-rose-50">
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 mx-auto text-rose-600" />
                <p className="mt-2 text-sm text-rose-700">알림 위젯</p>
              </div>
            </div>
          </Widget>
        </GridLayout>
      </div>

      {layoutChanges.length > 0 && (
        <div className="p-4 bg-white border-t">
          <p className="text-sm font-medium mb-2">변경 이력:</p>
          <div className="flex gap-2 flex-wrap">
            {layoutChanges.map((change, i) => (
              <Badge key={i} variant="secondary">
                {change}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export const DragDropSwap: Story = {
  parameters: {
    docs: {
      description: {
        story: "Widget Drag & Drop Swap 기능입니다. 위젯을 드래그하여 다른 위젯과 위치를 교환할 수 있습니다.",
      },
    },
  },
  render: () => <DragDropDemo />,
}
