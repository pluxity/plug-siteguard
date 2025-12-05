import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { SearchBar } from './search-bar.component'

const meta: Meta<typeof SearchBar> = {
  title: 'Molecules/SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: '검색어 값',
    },
    placeholder: {
      control: 'text',
      description: '플레이스홀더 텍스트',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
    className: {
      control: 'text',
      description: '추가 CSS 클래스',
    },
  },
}

export default meta
type Story = StoryObj<typeof SearchBar>

export const Default: Story = {
  render: function Render() {
    const [value, setValue] = useState('')
    return (
      <SearchBar
        value={value}
        onChange={setValue}
        placeholder="검색어를 입력하세요"
        className="w-[300px]"
      />
    )
  },
}

export const WithOnSearch: Story = {
  render: function Render() {
    const [value, setValue] = useState('')
    const [searchResult, setSearchResult] = useState('')

    return (
      <div className="space-y-4">
        <SearchBar
          value={value}
          onChange={setValue}
          onSearch={(v) => setSearchResult(`검색어: "${v}"`)}
          placeholder="Enter를 눌러 검색"
          className="w-[300px]"
        />
        {searchResult && (
          <p className="text-sm text-muted-foreground">{searchResult}</p>
        )}
      </div>
    )
  },
}

export const Disabled: Story = {
  render: function Render() {
    const [value, setValue] = useState('비활성화됨')
    return (
      <SearchBar
        value={value}
        onChange={setValue}
        disabled
        className="w-[300px]"
      />
    )
  },
}

export const CustomPlaceholder: Story = {
  render: function Render() {
    const [value, setValue] = useState('')
    return (
      <SearchBar
        value={value}
        onChange={setValue}
        placeholder="이벤트명, 위치 등 검색..."
        className="w-[350px]"
      />
    )
  },
}

export const Sizes: Story = {
  render: function Render() {
    const [value1, setValue1] = useState('')
    const [value2, setValue2] = useState('')
    const [value3, setValue3] = useState('')

    return (
      <div className="space-y-4">
        <SearchBar
          value={value1}
          onChange={setValue1}
          placeholder="Small (200px)"
          className="w-[200px]"
        />
        <SearchBar
          value={value2}
          onChange={setValue2}
          placeholder="Medium (300px)"
          className="w-[300px]"
        />
        <SearchBar
          value={value3}
          onChange={setValue3}
          placeholder="Large (400px)"
          className="w-[400px]"
        />
      </div>
    )
  },
}
