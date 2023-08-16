import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';

import {useState, useEffect} from 'react';
import axios from 'axios';

function App() {


  const [data, setData] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');
  const [professorFilter, setProfessorFilter] = useState('');

    useEffect(()=>{
        axios.get(`http://localhost:8080/sections?search=department,${departmentFilter},course,${courseFilter},section,${sectionFilter},professor,${professorFilter}&limit=100`)
        .then(response => {
          console.log(response.data)
          setData(response.data.sections)
        })
    }, [departmentFilter])

  return (
    <div className="App">
      <DataTable value={data} sortMode="multiple"
      paginator
      rows={100}
      rowsPerPageOptions={[5,10,25,50,100]}
      showGridlines
      removableSort
      scrollable 
      scrollHeight="1000px"
      filterDisplay="row"
      globalFilterFields={['department', 'course', 'section', 'professor']}
      emptyMessage="No sections found."
      >
        <Column field="department" header="Department" sortable filter filterPlaceholder="AERO" style={{ minWidth: '12rem' }} />
        <Column field="course" header="Course" sortable filter filterPlaceholder="201" style={{ minWidth: '12rem' }}/>
        <Column field="section" header="Section" sortable filter filterPlaceholder="500" style={{ minWidth: '12rem' }}/>
        <Column field="professor" header="Professor" sortable filter filterPlaceholder="Smith" style={{ minWidth: '12rem' }}/>
        <Column field="grades.0" header="A" sortable/>
        <Column field="grades.1" header="B" sortable/>
        <Column field="grades.2" header="C" sortable/>
        <Column field="grades.3" header="D" sortable/>
        <Column field="grades.4" header="F" sortable/>
        <Column field="grades.8" header="Q" sortable/>
        <Column field="semester" header="Semester" sortable/>
        <Column field="year" header="Year" sortable/>
      </DataTable>


    </div>
  )
}


export default App;


//<Column field="department" header="Department" sortable filters/>
// <Column field="course" header="Course" sortable filters/>
// <Column field="section" header="Section" sortable filters/>
// <Column field="professor" header="Professor" sortable filters/>
// </DataTable>