import { createContext, useContext, useEffect, useState } from 'react'
import { defaultContent, type PortfolioContent } from './content'

const ContentContext = createContext<PortfolioContent>(defaultContent)

export function SiteContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState(defaultContent)
  useEffect(() => {
    fetch('/api/content').then((response) => response.ok ? response.json() : null)
      .then((saved) => { if (saved) setContent({ ...defaultContent, ...saved }) })
      .catch(() => {})
  }, [])
  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>
}

export function useSiteContent() {
  return useContext(ContentContext)
}
