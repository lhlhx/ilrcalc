import React, { useEffect, useRef, useState } from "react";


function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default function Absence(props) {
  const [isEditing, setEditing] = useState(false);
  const [newDescription, setNewDescription] = useState(props.description);
  const [newAbsStartDate, setNewAbsStartDate] = useState(props.start_date);
  const [newAbsEndDate, setNewAbsEndDate] = useState(props.end_date);

  const editDescriptionRef = useRef(null);
  const editStartDateRef = useRef(null);
  const editEndDateRef = useRef(null);
  const editButtonRef = useRef(null);
  const [isDataValid, setIsDataValid] = useState(false);

  const wasEditing = usePrevious(isEditing);

  function checkValidity(startDateStr, endDateStr) {
        var startDate = new Date(startDateStr);
        var endDate = new Date(endDateStr);
        var differenceInDays = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);

        if (differenceInDays > 0 && differenceInDays < 3650) {
            setIsDataValid(true);
        } else {
            setIsDataValid(false);
        }
  }


  function handleChange(e) {
      switch(e.target.id) {
          case 'absence-start-date-input':
            setNewAbsStartDate(e.target.value);
            break;
          case 'absence-end-date-input':
            setNewAbsEndDate(e.target.value);
            break;
          default:
            setNewDescription(e.target.value);
      }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!newDescription.trim()) {
      return;
    }
    props.editPeriod(props.id, newDescription, newAbsStartDate, newAbsEndDate);
    setEditing(false);
  }

  const editingTemplate = (
    <form className="stack-small" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="absence-label" htmlFor={props.id}>
          New description for {props.description}
        </label>
        <input
          id={props.id}
          className="absence-text"
          type="text"
          value={newDescription || props.description}
          onChange={handleChange}
          ref={editDescriptionRef}
        />
        <label className="absence-label" htmlFor={props.id}>
          Start date:
        </label>
        <input
          id="absence-start-date-input"
          className="absence-text"
          type="date"
          value={newAbsStartDate || props.start_date}
          onChange={handleChange}
          ref={editStartDateRef}
        />
        <label className="absence-label" htmlFor={props.id}>
          End Date:
        </label>
        <input
          id="absence-end-date-input"
          className="absence-text"
          type="date"
          value={newAbsEndDate || props.end_date}
          onChange={handleChange}
          ref={editEndDateRef}
        />
      </div>
      <div className="btn-group">

        <button
          type="button"
          className="btn absence-cancel"
          onClick={() => setEditing(false)}
        >
          Cancel
          <span className="visually-hidden">renaming {props.note}</span>
        </button>
        <button type="submit" className="btn btn__primary absence-edit" disabled={!isDataValid}>
          Save
          <span className="visually-hidden">new note for {props.note}</span>
        </button>
      </div>
    </form>
  );

  const viewTemplate = (
    <div className="stack-small">
      <div className="c-cb">
          <input
            id={props.id}
            type="checkbox"
            defaultChecked={props.counted}
            onChange={() => props.togglePeriodCounted(props.id)}
          />
          <label className="absence-label" htmlFor={props.id}>
            {props.description}
          </label>
          <label className="absence-label" htmlFor={props.id}>
            Start: {newAbsStartDate}
          </label>
          <label className="absence-label" htmlFor={props.id}>
            End: {newAbsEndDate}
          </label>
        </div>
        <div className="btn-group">
        <button
          type="button"
          className="btn"
          onClick={() => setEditing(true)}
          ref={editButtonRef}
          >
            Edit <span className="visually-hidden">{props.note}</span>
          </button>
          <button
            type="button"
            className="btn btn__danger"
            onClick={() => props.deletePeriod(props.id)}
          >
            Delete <span className="visually-hidden">{props.note}</span>
          </button>
        </div>
    </div>
  );

  useEffect(() => {
    checkValidity(newAbsStartDate, newAbsEndDate)
  })

  useEffect(() => {
    if (!wasEditing && isEditing) {
      editDescriptionRef.current.focus();
    }
    if (wasEditing && !isEditing) {
      editButtonRef.current.focus();
    }
  }, [wasEditing, isEditing]);


  return <li className="absence">{isEditing ? editingTemplate : viewTemplate}</li>;
}
