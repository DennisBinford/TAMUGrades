import { useEffect, useState } from 'react'
import axios from 'axios'

export default function useSectionSearch(departmentSearch, limitAmount) {
    const [data, setData] = useState([])

    useEffect(() => {
      let cancel
      axios({
        method: 'GET',
        url: 'http://openlibrary.org/search.json',
        params: { search: `department,${departmentSearch}`, limit: limitAmount },
        cancelToken: new axios.CancelToken(c => cancel = c)
        })
        .then(response => {
          setData(response.data.sections)
      }).catch(e => {
        if (axios.isCancel(e)) return
      })
      return () => cancel()
      }, [])
    return data
  }