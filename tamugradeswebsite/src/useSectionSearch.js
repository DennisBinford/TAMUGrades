import { useEffect, useState } from 'react'
import axios from 'axios'

export default function useSectionSearch(query, pageNumber) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [sections, setSections] = useState([])
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    setSections([])
  }, [query])

  useEffect(() => {
    setLoading(true)
    setError(false)
    let cancel
    axios({
      method: 'GET',
      url: 'http://openlibrary.org/search.json',
      params: { q: query, page: pageNumber },
      cancelToken: new axios.CancelToken(c => cancel = c)
    }).then(res => {
      setSections(prevSections => {
        return [...new Set([...prevSections, ...res.data.docs.map(sec => sec.title)])]
      })
      setHasMore(res.data.docs.length > 0)
      setLoading(false)
    }).catch(e => {
      if (axios.isCancel(e)) return
      setError(true)
    })
    return () => cancel()
  }, [query, pageNumber])

  return { loading, error, sections, hasMore }
}