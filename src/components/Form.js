import React, { useState, useEffect } from "react";


function Form(props) {
  const [description, setDescription] = useState('Test');

  const [absStartDate, setAbsStartDate] = useState('');
  const [absEndDate, setAbsEndDate] = useState('');
  const [isDataValid, setIsDataValid] = useState(false);

  useEffect(() => {
        checkValidity(absStartDate, absEndDate)
  })

  function checkValidity(startDateStr, endDateStr) {
        var startDate = new Date(startDateStr)
        var endDate = new Date(endDateStr)
        var differenceInDays = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)

        if (differenceInDays > 0) {
            setIsDataValid(true)
        } else {
            setIsDataValid(false)
        }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!description.trim()) {
      return;
    }
    props.addPeriod(description, absStartDate, absEndDate);
    setDescription("");
  }


  function handleChange(e) {
      switch(e.target.id) {
          case 'absence-start-date-input':
            setAbsStartDate(e.target.value);
            break;
          case 'absence-end-date-input':
            setAbsEndDate(e.target.value);
            break;
          default:
            setDescription(e.target.value);
      }
  }

  return (
    <form onSubmit={handleSubmit}>
      <hr/>
      <span>Absence Start Date:</span>
      <input
        type="date"
        id="absence-start-date-input"
        className="input input__lg"
        name="text"
        autoComplete="off"
        value={absStartDate}
        onChange={handleChange}
      />

      <span>Absence End Date:</span>
      <input
        type="date"
        id="absence-end-date-input"
        className="input input__lg"
        name="text"
        autoComplete="off"
        value={absEndDate}
        onChange={handleChange}
      />

      <span>Description:</span>
      <input
        type="text"
        id="description-input"
        className="input input__lg"
        name="text"
        autoComplete="off"
        value={description}
        onChange={handleChange}
      />
      <button type="submit" className="btn btn__primary btn__lg" disabled={!isDataValid}>
        Add
      </button>
    </form>
  );
}

export default Form;
