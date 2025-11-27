import type { Meta, StoryObj } from "@storybook/react"
import { Widget } from "./widget.component"
import { Badge } from "../../atoms/badge"
import { MapPin, Users, Calendar, AlertCircle, TrendingUp } from "lucide-react"

const meta: Meta<typeof Widget> = {
  title: "Molecules/Widget",
  component: Widget,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "재사용 가능한 위젯 카드 컴포넌트입니다. 대시보드, 오버뷰 페이지에서 다양한 콘텐츠를 담는 컨테이너로 사용됩니다. 그리드 시스템에서 colSpan, rowSpan으로 크기를 조절할 수 있습니다.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "위젯 타이틀",
    },
    colSpan: {
      control: { type: "number", min: 1, max: 12 },
      description: "그리드 컬럼 수",
    },
    rowSpan: {
      control: { type: "number", min: 1, max: 4 },
      description: "그리드 행 수",
    },
  },
}

export default meta
type Story = StoryObj<typeof Widget>

export const Default: Story = {
  args: {
    title: "위젯 타이틀",
    children: (
      <div className="h-[100px] flex items-center justify-center text-gray-500">
        위젯 콘텐츠
      </div>
    ),
  },
}

export const WithoutTitle: Story = {
  args: {
    children: (
      <div className="text-center py-4">
        <p className="text-3xl font-bold text-blue-600">128</p>
        <p className="text-sm text-gray-500 mt-1">방문자 수</p>
      </div>
    ),
  },
}

export const StatCard: Story = {
  parameters: {
    docs: {
      description: {
        story: "통계 카드 스타일의 위젯입니다.",
      },
    },
  },
  render: () => (
    <div className="grid grid-cols-4 gap-4 w-[800px]">
      <Widget colSpan={1} title="총 시설">
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

      <Widget colSpan={1} title="이용객">
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

      <Widget colSpan={1} title="경기 일정">
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

      <Widget colSpan={1} title="알림">
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
    </div>
  ),
}

export const KPICard: Story = {
  parameters: {
    docs: {
      description: {
        story: "KPI 스타일의 위젯입니다. 증감률을 함께 표시합니다.",
      },
    },
  },
  render: () => (
    <Widget className="w-[250px]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">총 매출</p>
          <p className="text-2xl font-bold mt-1">₩45.2M</p>
          <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
            <TrendingUp className="w-3 h-3" />
            +12.5% 지난주 대비
          </div>
        </div>
        <div className="p-2 bg-blue-50 rounded-lg">
          <TrendingUp className="w-5 h-5 text-blue-600" />
        </div>
      </div>
    </Widget>
  ),
}

export const ListWidget: Story = {
  parameters: {
    docs: {
      description: {
        story: "리스트 형태의 위젯입니다.",
      },
    },
  },
  render: () => (
    <Widget title="일일 현황" className="w-[300px]">
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
  ),
}

export const ChartWidget: Story = {
  parameters: {
    docs: {
      description: {
        story: "차트를 담는 위젯입니다.",
      },
    },
  },
  render: () => (
    <Widget title="매출 추이" className="w-[500px]" contentClassName="p-0 h-[250px]">
      <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <p className="text-gray-500">Chart Area</p>
      </div>
    </Widget>
  ),
}

export const TableWidget: Story = {
  parameters: {
    docs: {
      description: {
        story: "테이블을 담는 위젯입니다.",
      },
    },
  },
  render: () => (
    <Widget title="최근 알람" className="w-[600px]">
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
              { time: "17:30", location: "중앙공원", content: "센서 이상", status: "확인중" },
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
  ),
}

export const CustomHeader: Story = {
  parameters: {
    docs: {
      description: {
        story: "커스텀 헤더 스타일 예시입니다.",
      },
    },
  },
  render: () => (
    <Widget
      title="알림 현황"
      className="w-[300px]"
      headerClassName="bg-blue-50 border-blue-100"
    >
      <div className="space-y-2">
        <div className="p-2 bg-gray-50 rounded text-sm">알림 1</div>
        <div className="p-2 bg-gray-50 rounded text-sm">알림 2</div>
        <div className="p-2 bg-gray-50 rounded text-sm">알림 3</div>
      </div>
    </Widget>
  ),
}

export const InGrid: Story = {
  parameters: {
    docs: {
      description: {
        story: "그리드 레이아웃에서 colSpan, rowSpan을 사용하는 예시입니다.",
      },
    },
  },
  render: () => (
    <div
      className="w-[800px] p-4 bg-gray-100 rounded-lg"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(12, 1fr)",
        gap: "16px",
      }}
    >
      <Widget colSpan={3} title="위젯 1">
        <p className="text-center text-gray-500">3 cols</p>
      </Widget>
      <Widget colSpan={3} title="위젯 2">
        <p className="text-center text-gray-500">3 cols</p>
      </Widget>
      <Widget colSpan={6} title="위젯 3">
        <p className="text-center text-gray-500">6 cols</p>
      </Widget>
      <Widget colSpan={8} rowSpan={2} title="큰 위젯" contentClassName="h-[150px]">
        <p className="text-center text-gray-500">8 cols x 2 rows</p>
      </Widget>
      <Widget colSpan={4} title="사이드 1">
        <p className="text-center text-gray-500">4 cols</p>
      </Widget>
      <Widget colSpan={4} title="사이드 2">
        <p className="text-center text-gray-500">4 cols</p>
      </Widget>
      <Widget colSpan={12} title="전체 너비">
        <p className="text-center text-gray-500">12 cols (전체)</p>
      </Widget>
    </div>
  ),
}
