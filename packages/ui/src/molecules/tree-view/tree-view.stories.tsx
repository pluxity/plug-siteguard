import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { TreeItem, TreeView } from './tree-view.component'
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
    <TreeView>
      <TreeItem value="1" label="Root">
        <TreeItem value="1-1" label="Child 1" />
        <TreeItem value="1-2" label="Child 2" />
      </TreeItem>
    </TreeView>
  ),
}

// 기본 확장 상태
export const DefaultExpanded: Story = {
  render: () => (
    <TreeView defaultExpanded={["1", "1-2"]}>
      <TreeItem value="1" label="Documents">
        <TreeItem value="1-1" label="resume.pdf" />
        <TreeItem value="1-2" label="Projects">
          <TreeItem value="1-2-1" label="project-a" />
          <TreeItem value="1-2-2" label="project-b" />
        </TreeItem>
        <TreeItem value="1-3" label="notes.txt" />
      </TreeItem>
    </TreeView>
  ),
}

// 아이콘 사용
export const WithIcons: Story = {
  render: () => (
    <TreeView defaultExpanded={["folder-1"]}>
      <TreeItem 
        value="folder-1" 
        label="src" 
        icon={<FolderIcon />}
      >
        <TreeItem value="file-1" label="index.ts" icon={<FileIcon />} />
        <TreeItem value="file-2" label="utils.ts" icon={<FileIcon />} />
        <TreeItem 
          value="folder-2" 
          label="components" 
          icon={<FolderIcon />}
        >
          <TreeItem value="file-3" label="Button.tsx" icon={<FileIcon />} />
          <TreeItem value="file-4" label="Input.tsx" icon={<FileIcon />} />
        </TreeItem>
      </TreeItem>
    </TreeView>
  ),
}

// 체크박스 기본
export const Checkable: Story = {
  render: () => (
    <TreeView checkable defaultExpanded={["features"]}>
      <TreeItem value="features" label="Features">
        <TreeItem value="auth" label="Authentication" />
        <TreeItem value="dashboard" label="Dashboard" />
        <TreeItem value="settings" label="Settings" />
      </TreeItem>
    </TreeView>
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
        >
          <TreeItem value="features" label="Features">
            <TreeItem value="auth" label="Authentication" />
            <TreeItem value="dashboard" label="Dashboard" />
            <TreeItem value="settings" label="Settings" />
          </TreeItem>
        </TreeView>
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
        >
          <TreeItem value="root" label="프로젝트" icon={<FolderIcon />}>
            <TreeItem value="frontend" label="Frontend" icon={<FolderIcon />}>
              <TreeItem value="react" label="React" icon={<FileIcon />} />
              <TreeItem value="vue" label="Vue" icon={<FileIcon />} />
              <TreeItem value="angular" label="Angular" icon={<FileIcon />} />
            </TreeItem>
            <TreeItem value="backend" label="Backend" icon={<FolderIcon />}>
              <TreeItem value="node" label="Node.js" icon={<FileIcon />} />
              <TreeItem value="python" label="Python" icon={<FileIcon />} />
            </TreeItem>
            <TreeItem value="database" label="Database" icon={<FolderIcon />}>
              <TreeItem value="mysql" label="MySQL" icon={<FileIcon />} />
              <TreeItem value="postgres" label="PostgreSQL" icon={<FileIcon />} />
              <TreeItem value="mongodb" label="MongoDB" icon={<FileIcon />} />
            </TreeItem>
          </TreeItem>
        </TreeView>
      </div>
    )
  }, 
}

// Disabled 아이템
export const WithDisabled: Story = {
  render: () => (
    <TreeView defaultExpanded={["1"]}>
      <TreeItem value="1" label="Available Items">
        <TreeItem value="1-1" label="Enabled Item" />
        <TreeItem value="1-2" label="Disabled Item" disabled />
        <TreeItem value="1-3" label="Another Enabled" />
      </TreeItem>
    </TreeView>
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
        <TreeView expanded={expanded} onExpandedChange={setExpanded}>
          <TreeItem value="1" label="Root">
            <TreeItem value="1-1" label="Child 1" />
            <TreeItem value="1-2" label="Child 2">
              <TreeItem value="1-2-1" label="Grandchild 1" />
              <TreeItem value="1-2-2" label="Grandchild 2" />
            </TreeItem>
          </TreeItem>
        </TreeView>
      </div>
    )
  },
}

// renderItem 커스텀 렌더링
export const CustomRenderItem: Story = {
  render: () => (
    <TreeView defaultExpanded={["1"]}>
      <TreeItem
        value="1"
        label="Custom Parent"
        renderItem={({ label, isExpanded, hasChildren, isSelected }) => (
          <div className={`flex items-center gap-2 p-2 rounded ${isSelected ? 'text-black' : 'hover:text-red-500'}`}>
            {hasChildren && <span>{isExpanded ? '▼' : '▶'}</span>}
            <span className="font-medium">{label}</span>
          </div>
        )}
      >
        <TreeItem
          value="1-1"
          label="Custom Child 1"
          renderItem={({ label, isSelected }) => (
            <div className={`flex items-center gap-2 p-2 rounded ${isSelected ? 'text-black' : 'hover:text-red-500'}`}>
              <span>•</span>
              <span>{label}</span>
              {isSelected && <span className="ml-auto">✓</span>}
            </div>
          )}
        />
        <TreeItem
          value="1-2"
          label="Custom Child 2"
          renderItem={({ label, isSelected }) => (
            <div className={`flex items-center gap-2 p-2 rounded ${isSelected ? 'text-black' : 'hover:text-red-500'}`}>
              <span>•</span>
              <span>{label}</span>
              {isSelected && <span className="ml-auto">✓</span>}
            </div>
          )}
        />
      </TreeItem>
    </TreeView>
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
      <TreeView defaultExpanded={["1"]}>
        <TreeItem value="1" label="포커스 후 키보드로 조작해보세요" icon={<FolderIcon />}>
          <TreeItem value="1-1" label="파일 1" icon={<FileIcon />} />
          <TreeItem value="1-2" label="폴더" icon={<FolderIcon />}>
            <TreeItem value="1-2-1" label="파일 2" icon={<FileIcon />} />
            <TreeItem value="1-2-2" label="파일 3" icon={<FileIcon />} />
          </TreeItem>
          <TreeItem value="1-3" label="파일 4" icon={<FileIcon />} />
        </TreeItem>
        <TreeItem value="2" label="다른 루트" icon={<FolderIcon />}>
          <TreeItem value="2-1" label="파일 5" icon={<FileIcon />} />
        </TreeItem>
      </TreeView>
    </div>
  ),
}

// Depth를 활용한 들여쓰기 조절
export const CustomDepth: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="text-sm text-gray-500 mb-2">
        <p>depth 값을 변경하여 시작 들여쓰기 위치를 조절할 수 있습니다.</p>
      </div>
      
      <div>
        <p className="text-xs text-gray-400 mb-2">depth=0 (기본)</p>
        <TreeView defaultExpanded={["a1"]}>
          <TreeItem value="a1" label="Root" icon={<FolderIcon />}>
            <TreeItem value="a1-1" label="Child" icon={<FileIcon />} />
          </TreeItem>
        </TreeView>
      </div>

      <div>
        <p className="text-xs text-gray-400 mb-2">depth=1</p>
        <TreeView defaultExpanded={["b1"]}>
          <TreeItem value="b1" label="Root" icon={<FolderIcon />} depth={1}>
            <TreeItem value="b1-1" label="Child" icon={<FileIcon />} />
          </TreeItem>
        </TreeView>
      </div>

      <div>
        <p className="text-xs text-gray-400 mb-2">depth=2</p>
        <TreeView defaultExpanded={["c1"]}>
          <TreeItem value="c1" label="Root" icon={<FolderIcon />} depth={2}>
            <TreeItem value="c1-1" label="Child" icon={<FileIcon />} />
          </TreeItem>
        </TreeView>
      </div>

      <div>
        <p className="text-xs text-gray-400 mb-2">depth=3</p>
        <TreeView defaultExpanded={["d1"]}>
          <TreeItem value="d1" label="Root" icon={<FolderIcon />} depth={3}>
            <TreeItem value="d1-1" label="Child" icon={<FileIcon />} />
          </TreeItem>
        </TreeView>
      </div>
    </div>
  ),
}
