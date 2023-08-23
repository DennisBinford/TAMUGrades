import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import "../../index.css";
import ReactDOM from "react-dom";

import React, { useState, useRef, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";

import "./DropdownDemo.css";

const DropdownDemo = () => {
  const drpref = useRef();

  const [selectedCountry, setSelectedCountry] = useState(null);

  const countries = [
    { name: "Australia", code: "AU" },
    { name: "Brazil", code: "BR" },
    { name: "China", code: "CN" },
    { name: "Egypt", code: "EG" },
    { name: "France", code: "FR" },
    { name: "Germany", code: "DE" },
    { name: "India", code: "IN" },
    { name: "Japan", code: "JP" },
    { name: "Spain", code: "ES" },
    { name: "United States", code: "US" }
  ];

  // const handleFilter = () => {
  //   drpref.current.show();
  //   let data = drpref.current.getOverlay().querySelector(".p-dropdown-item");
  // };

  const onCountryChange = (e) => {
    drpref.current.show();
    setSelectedCountry(e.value);
  };

  useEffect(() => {
    let i, txtValue;

    const overlayNode = drpref.current.getOverlay();
    if (!overlayNode) return;

    let data = drpref.current.getOverlay().getElementsByTagName("li");
    console.log("li : ", data);

    for (i = 0; i < data.length; i++) {
      txtValue = data[i].textContent || data[i].innerText;
      console.log(txtValue);
      if (txtValue.toUpperCase().indexOf(selectedCountry.toUpperCase()) > -1) {
        data[i].style.display = "";
      } else {
        data[i].style.display = "none";
      }
    }
  }, [selectedCountry]);

  return (
    <div className="dropdown-demo">
      <div className="card">
        <h5>Country</h5>
        <Dropdown
          value={selectedCountry}
          options={countries}
          onChange={onCountryChange}
          optionLabel="name"
          ref={drpref}
          editable
          // showOnFocus={true}
          showClear
          filterBy="name"
          placeholder="Select a Country"
        />
      </div>
    </div>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<DropdownDemo />, rootElement);
