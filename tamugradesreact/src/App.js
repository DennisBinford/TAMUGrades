import './App.css';
import axios from "axios";
import Section from './components/Section';
import {useState, useEffect} from 'react';
import BootstrapTable from "react-bootstrap-table-next"
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  const [data, setData] = useState([]);
  useEffect(() => {
    getData();
  }, []);
  const getData = () => {
    axios("https://api.tamugrades.com/section/AERO/201").then((res) => {
      console.log(res.data);
      setData(res.data);
    });
  };
  const columns=[
    {
      dataField: "Department",
      text: "Department",
      sort: true,
    },
    {
      dataField: "Course",
      text: "Course",
      sort: true,
    },
    {
      dataField: "Section",
      text: "Section",
      sort: true,
    }
  ]
  return (
    <div className="App bg-[#800000] width: 100%">
      <BootstrapTable 
        keyField="_id" 
        data={data} 
        columns={columns}
        striped
        hover
        condensed
      />
    </div>
  );
}


export default App;
