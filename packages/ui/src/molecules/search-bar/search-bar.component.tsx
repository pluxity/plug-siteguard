import * as React from "react"
import { Search } from "lucide-react"

import { cn } from "../../lib/utils"
import { Input } from "../../atoms/input"
import type { SearchBarProps } from "./search-bar.types"

const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      value,
      onChange,
      onSearch,
      placeholder = "검색",
      className,
      disabled = false,
    },
    ref
  ) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault()
        onSearch?.(value)
      }
    }

    return (
      <div className={cn("relative", className)}>
        <Input
          ref={ref}
          placeholder={placeholder}
          className="pr-10"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
        <Search
          className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
      </div>
    )
  }
)

SearchBar.displayName = "SearchBar"

export { SearchBar }
