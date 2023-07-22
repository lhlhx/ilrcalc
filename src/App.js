import React, { useState, useRef, useEffect } from "react";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import Absence from "./components/Absence";
import Validator from "./components/Validator";
import { nanoid } from "nanoid";

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

const FILTER_MAP = {
    All: () => true,
    Excluded: (period) => !period.counted,
    counted: (period) => period.counted,
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

function App(props) {
    const [periods, setPeriods] = useState(props.periods);
    const [filter, setFilter] = useState("All");

    const [visaStartDate, setVisaStartDate] = useState('2021-01-01');
    const [visaEndDate, setVisaEndDate] = useState('2026-01-01');
    const [firstEntryDate, setFirstEntryDate] = useState('2021-01-31');

    useEffect(() => {
        //checkValidity(absStartDate, absEndDate)
    }, [visaStartDate, visaEndDate, firstEntryDate])

    function splitDateRange(startDate, endDate) {
        const dates = [];
        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return dates;
    }

    function handleChange(e) {
        switch(e.target.id) {
            case 'visa-start-date-input':
                setVisaStartDate(e.target.value);
                break;
            case 'visa-end-date-input':
                setVisaEndDate(e.target.value);
                break;
            case 'first-entry-date-input':
                setFirstEntryDate(e.target.value);
                break;
        }
    }

    function togglePeriodCounted(id) {
        const updatedPeriods = periods.map((period) => {
            // if this period has the same ID as the edited period
            if (id === period.id) {
                // use object spread to make a new obkect
                // whose `counted` prop has been inverted
                return { ...period, counted: !period.counted };
            }
            return period;
        });
        setPeriods(updatedPeriods);
    }

    function deletePeriod(id) {
        const remainingPeriods = periods.filter((period) => id !== period.id);
        setPeriods(remainingPeriods);
    }

    function editPeriod(id, newDescription, newStartDate, newEndDate) {
        const editedPeriodList = periods.map((period) => {
            // if this period has the same ID as the edited period
            if (id === period.id) {
                //
                return { ...period, description: newDescription, start_date: newStartDate, end_date: newEndDate};
            }
            return period;
        });
        setPeriods(editedPeriodList);
    }

    const periodList = periods
        .filter(FILTER_MAP[filter])
        .map((period) => (
            <Absence
            id={period.id}
            description={period.description}
            start_date={period.start_date}
            end_date={period.end_date}
            counted={period.counted}
            key={period.id}
            togglePeriodCounted={togglePeriodCounted}
            deletePeriod={deletePeriod}
            editPeriod={editPeriod}
            />
        ));

    const filterList = FILTER_NAMES.map((name) => (
        <FilterButton
        key={name}
        name={name}
        isPressed={name === filter}
        setFilter={setFilter}
        />
    ));

    function addPeriod(name, startDate, endDate) {
        const newPeriod = { id: "abs-" + nanoid(), description: name, start_date: startDate, end_date: endDate, counted: true };
        setPeriods([...periods, newPeriod]);
    }

    const periodsNoun = periodList.length !== 1 ? "periods" : "period";
    const headingText = `${periodList.length} ${periodsNoun} filtered`;

    const listHeadingRef = useRef(null);
    const prevPeriodLength = usePrevious(periods.length);

    useEffect(() => {
        if (periods.length - prevPeriodLength === -1) {
            listHeadingRef.current.focus();
        }
    }, [periods.length, prevPeriodLength]);

    return (
        <div className="todoapp stack-large">
        <h1 className="label-wrapper">
        <label htmlFor="new-todo-input" className="label__lg">
        ILR-Calc
        </label>
        </h1>

        <p><span className="visually-fullwidth">Visa Start Date:</span>
        <input
        type="date"
        id="visa-start-date-input"
        className="input input"
        name="text"
        autoComplete="off"
        value={visaStartDate}
        onChange={handleChange}
        />
        <span className="visually-fullwidth">Visa End Date:</span>
        <input
        type="date"
        id="visa-end-date-input"
        className="input input"
        name="text"
        autoComplete="off"
        value={visaEndDate}
        onChange={handleChange}
        />

        <span className="visually-fullwidth">First Entry Date:</span>
        <input
        type="date"
        id="first-entry-date-input"
        className="input input"
        name="text"
        autoComplete="off"
        value={firstEntryDate}
        onChange={handleChange}
        />
        </p>

        <Validator periods={periods} visaStartDate={visaStartDate} visaEndDate={visaEndDate} firstEntryDate={firstEntryDate} />

        <Form addPeriod={addPeriod} />
        <div className="filters btn-group stack-exception">{filterList}</div>
        <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
        {headingText}
        </h2>
        <ul
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading">
        {periodList}
        </ul>
        </div>
    );
}

export default App;
