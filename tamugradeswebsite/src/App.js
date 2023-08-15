import React, { useState, useRef, useCallback } from 'react'
import useSectionSearch from './useSectionSearch'

export default function App() {
  const [query, setQuery] = useState('')
  const [pageNumber, setPageNumber] = useState(1)

  const {
    sections,
    hasMore,
    loading,
    error
  } = useSectionSearch(query, pageNumber)

  const observer = useRef()
  const lastSectionElementRef = useCallback(node => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPageNumber(prevPageNumber => prevPageNumber + 1)
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore])

  function handleSearch(e) {
    setQuery(e.target.value)
    setPageNumber(1)
  }

  return (
    <>
      <input type="text" value={query} onChange={handleSearch}></input>
      {sections.map((section, index) => {
        if (sections.length === index + 1) {
          return <div ref={lastSectionElementRef} key={section}>{section}</div>
        } else {
          return <div key={section}>{section}</div>
        }
      })}
      <div>{loading && 'Loading...'}</div>
      <div>{error && 'Error'}</div>
    </>
  )
}