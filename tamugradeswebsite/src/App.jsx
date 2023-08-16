import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';

import {useState, useEffect} from 'react';
import axios from 'axios';

function App() {


  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');
  const [professorFilter, setProfessorFilter] = useState('');

    useEffect(()=>{
        axios.get(`https://api.tamugrades.com/sections?limit=100&search=department,${departmentFilter},course,${courseFilter},section,${sectionFilter},professor,${professorFilter}`)
        .then(response => {
          setData(response.data.sections)
          setTotal(response.data.total)
        })
        .catch(setData([]))
    }, [departmentFilter, courseFilter, sectionFilter, professorFilter])

  return (
    <div className="App">
      <DataTable value={data} sortMode="multiple"
      totalRecords={total}
      paginator
      rows={100}
      rowsPerPageOptions={[5,10,25,50,100]}
      showGridlines
      removableSort
      scrollable 
      scrollHeight="1000px"
      filterDisplay="row"
      filter
      onFilter={(e) => {
        e.filters.department.value ? setDepartmentFilter(e.filters.department.value) : setDepartmentFilter('');
        e.filters.section.value ? setCourseFilter(e.filters.course.value) : setCourseFilter('');
        e.filters.course.value ? setDepartmentFilter(e.filters.section.value) : setSectionFilter('');
        e.filters.professor.value ? setProfessorFilter(e.filters.professor.value) : setProfessorFilter('');
      }}
      globalFilterFields={['department', 'course', 'section', 'professor']}
      emptyMessage="No sections found."
      >
        <Column field="department" header="Department" sortable filter filterMatchMode="contains" filterMaxLength={4} filterPlaceholder="AERO"
        />
        <Column field="course" header="Course" sortable filter filterMatchMode="contains" filterMaxLength={3} filterPlaceholder="201"/>
        <Column field="section" header="Section" sortable filter filterMatchMode="contains" filterMaxLength={3} filterPlaceholder="500"/>
        <Column field="professor" header="Professor" sortable filter filterMatchMode="contains" filterMaxLength={100} filterPlaceholder="Smith"/>
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
