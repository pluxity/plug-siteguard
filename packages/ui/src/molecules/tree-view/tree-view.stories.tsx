import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { TreeView } from './tree-view.component'
import { FileIcon, FolderIcon, KeyboardIcon } from 'lucide-react'

const meta: Meta<typeof TreeView> = {
  title: 'Molecules/TreeView',
  component: TreeView,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '계층 구조를 표시하는 트리 뷰 컴포넌트입니다. 데이터 계층을 시각적으로 표현하며 확장/축소, 선택, 체크박스 기능을 지원합니다.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof TreeView>

// 기본 사용
export const Default: Story = {
  render: () => (
    <TreeView 
      items={[
        { 
          value: "1", 
          label: "Root",
          children: [
            { value: "1-1", label: "Child 1" },
            { value: "1-2", label: "Child 2" },
          ]
        }
      ]} 
    />
  ),
}

// 기본 확장 상태
export const DefaultExpanded: Story = {
  render: () => (
    <TreeView 
      defaultExpanded={["1", "1-2"]}
      items={[
        {
          value: "1",
          label: "Documents",
          children: [
            { value: "1-1", label: "resume.pdf" },
            { 
              value: "1-2", 
              label: "Projects",
              children: [
                { value: "1-2-1", label: "project-a" },
                { value: "1-2-2", label: "project-b" },
              ]
            },
            { value: "1-3", label: "notes.txt" },
          ]
        }
      ]}
    />
  ),
}

// 아이콘 사용
export const WithIcons: Story = {
  render: () => (
    <TreeView 
      defaultExpanded={["folder-1"]}
      items={[
        {
          value: "folder-1",
          label: "src",
          icon: <FolderIcon />,
          children: [
            { value: "file-1", label: "index.ts", icon: <FileIcon /> },
            { value: "file-2", label: "utils.ts", icon: <FileIcon /> },
            {
              value: "folder-2",
              label: "components",
              icon: <FolderIcon />,
              children: [
                { value: "file-3", label: "Button.tsx", icon: <FileIcon /> },
                { value: "file-4", label: "Input.tsx", icon: <FileIcon /> },
              ]
            },
          ]
        }
      ]}
    />
  ),
}

// 체크박스 기본
export const Checkable: Story = {
  render: () => (
    <TreeView 
      checkable 
      defaultExpanded={["features"]}
      items={[
        {
          value: "features",
          label: "Features",
          children: [
            { value: "auth", label: "Authentication" },
            { value: "dashboard", label: "Dashboard" },
            { value: "settings", label: "Settings" },
          ]
        }
      ]}
    />
  ),
}

// 체크박스 - Controlled
export const CheckableControlled: Story = {
  render: () => {
    const [checked, setChecked] = useState<string[]>(["auth"])

    return (
      <div className="flex flex-col gap-4">
        <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded">
          <p className="font-medium mb-1">Checked Items:</p>
          <p className="font-mono text-xs">{JSON.stringify(checked)}</p>
        </div>
        <TreeView 
          checkable 
          defaultExpanded={["features"]} 
          checked={checked}
          onCheckedChange={setChecked}
          items={[
            {
              value: "features",
              label: "Features",
              children: [
                { value: "auth", label: "Authentication" },
                { value: "dashboard", label: "Dashboard" },
                { value: "settings", label: "Settings" },
              ]
            }
          ]}
        />
      </div>
    )
  },
}

// 체크박스 - 다중 레벨
export const CheckableMultiLevel: Story = {
  render: () => {
    const [checked, setChecked] = useState<string[]>([])

    return (
      <div className="flex flex-col gap-4">
        <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded">
          <p className="font-medium mb-1">Checked Items:</p>
          <p className="font-mono text-xs">{checked.length > 0 ? JSON.stringify(checked) : '(없음)'}</p>
        </div>
        <TreeView 
          checkable 
          defaultExpanded={["root", "frontend", "backend"]} 
          checked={checked}
          onCheckedChange={setChecked}
          items={[
            {
              value: "root",
              label: "프로젝트",
              icon: <span>📁</span>,
              children: [
                {
                  value: "frontend",
                  label: "Frontend",
                  icon: <span>🌐</span>,
                  children: [
                    { value: "react", label: "React", icon: <span>⚛️</span> },
                    { value: "vue", label: "Vue", icon: <span>💚</span> },
                    { value: "angular", label: "Angular", icon: <span>🅰️</span> },
                  ]
                },
                {
                  value: "backend",
                  label: "Backend",
                  icon: <span>⚙️</span>,
                  children: [
                    { value: "node", label: "Node.js", icon: <span>🟢</span> },
                    { value: "python", label: "Python", icon: <span>🐍</span> },
                  ]
                },
                {
                  value: "database",
                  label: "Database",
                  icon: <span>🗄️</span>,
                  children: [
                    { value: "mysql", label: "MySQL", icon: <span>🐬</span> },
                    { value: "postgres", label: "PostgreSQL", icon: <span>🐘</span> },
                    { value: "mongodb", label: "MongoDB", icon: <span>🍃</span> },
                  ]
                },
              ]
            }
          ]}
        />
      </div>
    )
  }, 
}

// Disabled 아이템
export const WithDisabled: Story = {
  render: () => (
    <TreeView 
      defaultExpanded={["1"]}
      items={[
        {
          value: "1",
          label: "Available Items",
          children: [
            { value: "1-1", label: "Enabled Item" },
            { value: "1-2", label: "Disabled Item", disabled: true },
            { value: "1-3", label: "Another Enabled" },
          ]
        }
      ]}
    />
  ),
}

// Controlled 상태
export const Controlled: Story = {
  render: () => {
    const [expanded, setExpanded] = useState<string[]>(["1"])

    return (
      <div className="flex flex-col gap-4">
        <div className="text-sm text-gray-500">
          <p>Expanded: {JSON.stringify(expanded)}</p>
        </div>
        <TreeView 
          expanded={expanded} 
          onExpandedChange={setExpanded}
          items={[
            {
              value: "1",
              label: "Root",
              children: [
                { value: "1-1", label: "Child 1" },
                { 
                  value: "1-2", 
                  label: "Child 2",
                  children: [
                    { value: "1-2-1", label: "Grandchild 1" },
                    { value: "1-2-2", label: "Grandchild 2" },
                  ]
                },
              ]
            }
          ]}
        />
      </div>
    )
  },
}

// 펼침/접힘 아이콘 사용
export const WithExpandIcon: Story = {
  render: () => (
    <TreeView 
      showExpandIcon
      defaultExpanded={["folder-1"]}
      items={[
        {
          value: "folder-1",
          label: "src",
          icon: <FolderIcon className="w-4 h-4" />,
          children: [
            { value: "file-1", label: "index.ts", icon: <FileIcon className="w-4 h-4" /> },
            { value: "file-2", label: "utils.ts", icon: <FileIcon className="w-4 h-4" /> },
            {
              value: "folder-2",
              label: "components",
              icon: <FolderIcon className="w-4 h-4" />,
              children: [
                { value: "file-3", label: "Button.tsx", icon: <FileIcon className="w-4 h-4" /> },
                { value: "file-4", label: "Input.tsx", icon: <FileIcon className="w-4 h-4" /> },
              ]
            },
          ]
        }
      ]}
    />
  ),
}

// 키보드 네비게이션 안내
export const KeyboardNavigation: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="p-4 bg-gray-100 rounded text-sm">
        <p className="font-bold mb-2"><KeyboardIcon /> 키보드 사용법</p>
        <ul className="space-y-1">
          <li><kbd className="px-1 bg-white rounded border">↑</kbd> <kbd className="px-1 bg-white rounded border">↓</kbd> - 아이템 이동</li>
          <li><kbd className="px-1 bg-white rounded border">→</kbd> - 펼치기</li>
          <li><kbd className="px-1 bg-white rounded border">←</kbd> - 접기</li>
          <li><kbd className="px-1 bg-white rounded border">Enter</kbd> / <kbd className="px-1 bg-white rounded border">Space</kbd> - 선택 및 토글</li>
        </ul>
      </div>
      <TreeView 
        defaultExpanded={["1"]}
        items={[
          {
            value: "1",
            label: "포커스 후 키보드로 조작해보세요",
            icon: <FolderIcon />,
            children: [
              { value: "1-1", label: "파일 1", icon: <FileIcon /> },
              { 
                value: "1-2", 
                label: "폴더", 
                icon: <FolderIcon />,
                children: [
                  { value: "1-2-1", label: "파일 2", icon: <FileIcon /> },
                  { value: "1-2-2", label: "파일 3", icon: <FileIcon /> },
                ]
              },
              { value: "1-3", label: "파일 4", icon: <FileIcon /> },
            ]
          },
          {
            value: "2",
            label: "다른 루트",
            icon: <FolderIcon />,
            children: [
              { value: "2-1", label: "파일 5", icon: <FileIcon /> },
            ]
          }
        ]}
      />
    </div>
  ),
}
