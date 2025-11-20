import type { Meta, StoryObj } from "@storybook/react"
import { Dashboard } from "./dashboard.component"
import { Button } from "../../atoms/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../molecules/card"
import { DataTable, Column } from "../../organisms/data-table"
import { SideMenu, SideMenuContent, SideMenuNav } from "../../organisms/side-menu"
import { Home, Settings, User, BarChart3 } from "lucide-react"

const meta: Meta<typeof Dashboard> = {
  title: "Templates/Dashboard",
  component: Dashboard,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "대시보드 템플릿입니다. 좌측 사이드바와 우측 콘텐츠 영역으로 구성되어 있으며, 각 영역에 다양한 요소를 children으로 전달할 수 있습니다.",
      },
    },
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Dashboard>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "좌측과 우측 각 영역에 Header, Body 구조를 사용할 수 있습니다. 각 영역을 독립적으로 구성할 수 있습니다.",
      },
    },
  },
  render: () => (
    <Dashboard 
      className="bg-gray-100"
      sidebarWidth="30%"
      contentWidth="70%"
      gap={10}
    >
      <Dashboard.Sidebar className="fixed top-0 left-0 h-screen z-50 py-4 pl-4 w-full">
        <SideMenu defaultOpen={true} collapsible={false} className="flex flex-col gap-3 h-full">
          {() => (
            <>
              <div className="h-10 shrink-0 flex items-center px-4 bg-white border rounded-xl">
                  <a href="/" className="w-full">
                      <span className="font-semibold text-sm">로고명</span>
                  </a>
              </div>
              <SideMenuContent className="w-full h-[calc(100vh-5.2rem)] shrink-0">
                <Dashboard.Sidebar.Header className="border-b p-4">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 text-xs font-medium">
                      나
                    </div>
                    <div className="flex flex-col items-start text-left flex-1 min-w-0">
                      <span className="text-xs text-gray-500">일반 사용자</span>
                      <span className="text-sm font-semibold truncate">사용자 이름</span>
                    </div>
                  </div>
                </Dashboard.Sidebar.Header>
                <Dashboard.Sidebar.Body>
                  <SideMenuNav className="flex-1 overflow-y-auto">
                    <div className="space-y-4 p-2">
                      <div className="space-y-0.5">
                        <div className="px-3 py-1.5 text-xs font-semibold text-gray-400">
                          메인 메뉴
                        </div>
                        <Button variant="ghost" className="w-full justify-start">
                          <Home className="mr-2 h-4 w-4" />
                          대시보드
                        </Button>
                        <Button variant="ghost" className="w-full justify-start">
                          <BarChart3 className="mr-2 h-4 w-4" />
                          이벤트
                        </Button>
                      </div>
                      <div className="space-y-0.5">
                        <div className="px-3 py-1.5 text-xs font-semibold text-gray-400">
                          관리 기능
                        </div>
                        <Button variant="ghost" className="w-full justify-start">
                          <Settings className="mr-2 h-4 w-4" />
                          시설 관리
                        </Button>
                        <Button variant="ghost" className="w-full justify-start">
                          <User className="mr-2 h-4 w-4" />
                          사용자 관리
                        </Button>
                      </div>
                    </div>
                  </SideMenuNav>
                </Dashboard.Sidebar.Body>
              </SideMenuContent>
            </>
          )}
        </SideMenu>
      </Dashboard.Sidebar>
      <Dashboard.Content className="bg-gray-100 flex flex-col h-full">
        <Dashboard.Content.Header className="px-6 pt-5 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                전체보기
              </Button>
              <Button variant="outline" size="sm">
                공원별 보기
              </Button>
            </div>
        </Dashboard.Content.Header>
        <Dashboard.Content.Body className="p-6 bg-gray-100">
          <div className="h-full bg-white rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">메인 콘텐츠 영역 (지도, 차트 등)</p>
          </div>
        </Dashboard.Content.Body>
      </Dashboard.Content>
    </Dashboard>
  ),
}

export const WithoutContentHeader: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "ContentHeader 없이 Body만 사용하는 예시입니다. 헤더가 필요 없는 간단한 레이아웃에 사용할 수 있습니다.",
      },
    },
  },
  render: () => {
    type TableData = {
      id: number
      name: string
      status: string
      date: string
      location: string
    }

    const tableData: TableData[] = [
      { id: 1, name: "중앙공원", status: "정상", date: "2024-01-15", location: "용인시" },
      { id: 2, name: "율동공원", status: "정상", date: "2024-01-14", location: "용인시" },
      { id: 3, name: "한강공원", status: "점검중", date: "2024-01-13", location: "서울시" },
    ]

    const columns: Column<TableData>[] = [
      { key: "id", header: "ID" },
      { key: "name", header: "공원명" },
      { key: "status", header: "상태" },
      { key: "date", header: "등록일" },
      { key: "location", header: "위치" },
    ]

    return (
      <Dashboard 
        className="bg-gray-100"
        sidebarWidth="30%"
        contentWidth="70%"
        gap={10}
      >
        <Dashboard.Sidebar className="fixed top-0 left-0 h-screen z-50 py-4 pl-4 w-full">
          <SideMenu defaultOpen={true} collapsible={false} className="flex flex-col gap-3 h-full">
            {() => (
              <>
                <div className="h-10 shrink-0 flex items-center px-4 bg-white border rounded-xl">
                    <a href="/" className="w-full">
                        <span className="font-semibold text-sm">로고명</span>
                    </a>
                </div>
                <SideMenuContent className="w-full h-[calc(100vh-5.2rem)] shrink-0">
                  <Dashboard.Sidebar.Header className="border-b p-4">
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 text-xs font-medium">
                        나
                      </div>
                      <div className="flex flex-col items-start text-left flex-1 min-w-0">
                        <span className="text-xs text-gray-500">일반 사용자</span>
                        <span className="text-sm font-semibold truncate">사용자 이름</span>
                      </div>
                    </div>
                  </Dashboard.Sidebar.Header>
                  <Dashboard.Sidebar.Body>
                    <SideMenuNav className="flex-1 overflow-y-auto">
                      <div className="space-y-4 p-2">
                        <div className="space-y-0.5">
                          <div className="px-3 py-1.5 text-xs font-semibold text-gray-400">
                            메인 메뉴
                          </div>
                          <Button variant="ghost" className="w-full justify-start">
                            <Home className="mr-2 h-4 w-4" />
                            대시보드
                          </Button>
                          <Button variant="ghost" className="w-full justify-start">
                            <BarChart3 className="mr-2 h-4 w-4" />
                            이벤트
                          </Button>
                        </div>
                        <div className="space-y-0.5">
                          <div className="px-3 py-1.5 text-xs font-semibold text-gray-400">
                            관리 기능
                          </div>
                          <Button variant="ghost" className="w-full justify-start">
                            <Settings className="mr-2 h-4 w-4" />
                            시설 관리
                          </Button>
                          <Button variant="ghost" className="w-full justify-start">
                            <User className="mr-2 h-4 w-4" />
                            사용자 관리
                          </Button>
                        </div>
                      </div>
                    </SideMenuNav>
                  </Dashboard.Sidebar.Body>
                </SideMenuContent>
              </>
            )}
          </SideMenu>
        </Dashboard.Sidebar>
        <Dashboard.Content className="bg-gray-100 flex flex-col h-full">
          <Dashboard.Content.Body className="p-6 bg-gray-100 flex flex-col gap-6">
              <Card className="flex-1 min-h-[400px]">
                <CardHeader className="border-b">
                  <CardTitle>지도 보기</CardTitle>
                </CardHeader>
                <CardContent className="h-full p-0">
                  <div className="h-full bg-gray-200 rounded-b-lg flex items-center justify-center">
                    <p className="text-muted-foreground">지도 영역</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="border-b">
                  <CardTitle>공원 목록</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <DataTable data={tableData} columns={columns} />
                </CardContent>
              </Card>
            </Dashboard.Content.Body>
        </Dashboard.Content>
      </Dashboard>
    )
  },
}

