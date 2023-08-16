import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';

import {useState, useEffect} from 'react';
import {FilterMatchMode} from 'primereact/api';
import {InputText} from 'primereact/inputtext';
import axios from 'axios';

function App() {

  const[filters, setFilters] = useState({
    global: {value: null, matchMode: FilterMatchMode.CONTAINS}
  })

  const [data, setData] = useState([]);

  useEffect(()=>{
      axios.get('https://api.tamugrades.com/sections')
      .then(response => {
          setData(response.data.sections)
      })
      .cancel
  })

  return (
    <div className="App">

      <InputText 
        onInput={(e) =>
          setFilters({
            global: {value: e.target.value, matchMode: FilterMatchMode.CONTAINS}
          })
      }/>

      <DataTable value={data} sortMode="multiple" filters={filters}
      paginator
      rows={10}
      rowsPerPageOptions={[5,10,25,50,100]}
      totalRecords={5}>
        <Column field="department" header="Department" sortable filters/>
        <Column field="course" header="Course" sortable filters/>
        <Column field="section" header="Section" sortable filters/>
        <Column field="professor" header="Professor" sortable filters/>
      </DataTable>
    </div>
  )
}

export default App;