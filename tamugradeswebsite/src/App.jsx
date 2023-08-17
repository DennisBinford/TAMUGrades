import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';

import {useState, useEffect} from 'react';
import axios from 'axios';

function App() {

  const BASE_API_URL = "https://api.tamugrades.com"
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');
  const [professorFilter, setProfessorFilter] = useState('');

    useEffect(()=>{
        axios
        .get(`${BASE_API_URL}?limit=1000&department=${departmentFilter}&course=${courseFilter}&section=${sectionFilter}&professor=${professorFilter}`)
        .then(response => {
          response.data.sections.add_field = "added field"
          setData(response.data.sections)
          setTotal(response.data.total)
        })
        .catch(() => {
          setData([])
        })
    }, [departmentFilter, courseFilter, sectionFilter, professorFilter])
  try {
    return (
      <div className="App">
        <DataTable value={data} sortMode="multiple" tableStyle={{ minWidth: '120rem' }}
        header="TAMUGrades"
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
        resizableColumns
        // style={{ minWidth: '100rem' }}
        // filterHeaderStyle={{ minWidth: '100rem' }}
        onFilter={(e) => {
          e.filters.department.value ? setDepartmentFilter(e.filters.department.value) : setDepartmentFilter('');
          e.filters.course.value ? setCourseFilter(e.filters.course.value) : setCourseFilter('');
          e.filters.section.value ? setDepartmentFilter(e.filters.section.value) : setSectionFilter('');
          e.filters.professor.value ? setProfessorFilter(e.filters.professor.value) : setProfessorFilter('');
        }}
        globalFilterFields={['department', 'course', 'section', 'professor']}
        emptyMessage="No sections found."
        >
          <Column field="department" header="Department" sortable filter filterMatchMode="contains" filterMaxLength={4} filterPlaceholder="AERO"
          style={{ width: '10%' }}
          />
          <Column field="course" header="Course" sortable filter filterMatchMode="contains" filterMaxLength={3} filterPlaceholder="201"
          style={{ width: '10%' }}/>
          <Column field="section" header="Section" sortable filter filterMatchMode="contains" filterMaxLength={3} filterPlaceholder="500"
          style={{ width: '10%' }}/>
          <Column field="professor" header="Professor" sortable filter filterMatchMode="contains" filterMaxLength={100} filterPlaceholder="Smith"
          style={{ width: '10%' }}/>
          <Column field="grades.0" header="A" sortable
          style={{ width: '5%' }}/>
          <Column field="grades.1" header="B" sortable
          style={{ width: '5%' }}/>
          <Column field="grades.2" header="C" sortable
          style={{ width: '5%' }}/>
          <Column field="grades.3" header="D" sortable
          style={{ width: '5%' }}/>
          <Column field="grades.4" header="F" sortable
          style={{ width: '5%' }}/>
          <Column field="grades.8" header="Q" sortable
          style={{ width: '5%' }}/>
          <Column field="semester" header="Semester" sortable
          style={{ width: '10%' }}/>
          <Column field="year" header="Year" sortable
          style={{ width: '10%' }}/>
        </DataTable>


      </div>
    )
      } catch {
        <h1>Refresh page, caught an error</h1>
      }
}


export default App;
