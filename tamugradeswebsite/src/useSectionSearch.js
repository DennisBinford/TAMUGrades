import { useEffect, useState } from 'react'
import axios from 'axios'

export default function useSectionSearch(departmentSearch, pageNumber) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [departments, setDepartments] = useState([])
  const [courses, setCourses] = useState([])
  const [sections, setSections] = useState([])
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    setSections([])
  }, [departmentSearch])

  useEffect(() => {
    setLoading(true)
    setError(false)
    let cancel
    axios({
      method: 'GET',
      url: 'https://api.tamugrades.com/sections',
      params: { search: `department,${departmentSearch}`, page: pageNumber },
      cancelToken: new axios.CancelToken(c => cancel = c)
    }).then(res => {
      setSections(prevSections => {
        return [...prevSections, ...res.data.sections.map(sec => sec.course)]
      })
      setHasMore(res.data.total - (res.data.page * res.data.limit) > 0)
      setLoading(false)
    }).catch(e => {
      if (axios.isCancel(e)) return
      setError(true)
    })
    return () => cancel()
  }, [departmentSearch, pageNumber])

  return { loading, error, sections, hasMore }
}