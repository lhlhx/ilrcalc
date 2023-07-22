import React, { useState, useEffect, useRef } from "react";
import ComplianceMsg from "./AbsenceMsg";

function Validator(props) {
    const [textOutput, setTextOutput] = useState('');
    const [complianceArray, setComplianceArray] = useState([]);

    const visaPeriodMonthMap = new Map();

    useEffect(() => {
        const visaStartDate = new Date(props.visaStartDate);
        const visaEndDate = new Date(props.visaEndDate);
        const firstEntryDate = new Date(props.firstEntryDate);
        let isViolated = false;

        setComplianceArray([]);
        setTextOutput("");
        if (visaStartDate.getTime() >= visaEndDate.getTime()) {
            setTextOutput("VisaStartDate and VisaEndDate error! Operation Aborted!");
            isViolated = true;
        }

        if (visaEndDate.getTime() - visaStartDate.getTime() > 315705600000) { // 10 years
            setTextOutput("VisaStartDate and VisaEndDate range too large! Operation Aborted!");
            isViolated = true;
        }

        if (firstEntryDate.getTime() < visaStartDate.getTime() || firstEntryDate.getTime() > visaEndDate.getTime()) {
            setTextOutput("FirstEntryDate out of Visa range! Operation Aborted!");
            isViolated = true;
        }

        if (isViolated == false) {
            for (const element of listMonth(props.visaStartDate, props.visaEndDate)) {
                visaPeriodMonthMap.set(element, []);
            }

            sortAbsenceDateByMonth(props.visaStartDate, props.firstEntryDate);

            for (const element of props.periods) {
                if (element.counted == false) {
                    continue;
                }
                sortAbsenceDateByMonth(element.start_date, element.end_date);
            }

            setComplianceArray(checkCompliance());
        }

    }, [props.periods, props.visaStartDate, props.visaEndDate, props.firstEntryDate]);

    function checkCompliance() {
        const monthList = listMonth(props.visaStartDate, props.visaEndDate);
        let complianceArray = [];
        for (let i = 0; i < monthList.length; i++) {
            let absDays = 0;
            for (const monthInInspection of monthList.slice(i, i+6)) {
                const absDateArray = visaPeriodMonthMap.get(monthInInspection);
                absDays = absDays + absDateArray.length;
            }
                const msg = { start_month: monthList[i] , end_month: monthList[i+5], days_of_absence: absDays };
                complianceArray = complianceArray.concat(msg);
        }
        return complianceArray;
    }

    function sortAbsenceDateByMonth(startDate, endDate) {
        let splitDate = splitDateRange(startDate, endDate);
        for (const element of splitDate) {
            let isDuplicated = false;
            const monthwithAbsence = element.toLocaleString('default', { month: 'numeric', year: 'numeric' })
            let arrayMonthWithAbsence = visaPeriodMonthMap.get(monthwithAbsence)
            if (arrayMonthWithAbsence == null) { continue; };
            verifyDateExistence:
            for (const existingDate of arrayMonthWithAbsence) {
                if (existingDate.getTime() === element.getTime()) {
                    isDuplicated = true;
                    break verifyDateExistence;
                }
            }
            if (isDuplicated) {
                continue;
            }
            visaPeriodMonthMap.set(monthwithAbsence, arrayMonthWithAbsence.concat(element))
        }
    }

    function splitDateRange(startDate, endDate) {
        const dates = [];
        let currentDate = new Date(startDate);

        while (currentDate <= new Date(endDate)) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return dates;
    }

    function listMonth(startDate, endDate) {
        // Create an array to store the resulting months
        const months = [];
        let startDateN = new Date(startDate);
        let endDateN = new Date(endDate);

        // Initialize the current month as the start date
        let currentMonth = new Date(startDateN.getFullYear(), startDateN.getMonth());

        // Loop until the current month is after the end date
        while (currentMonth <= endDateN) {
            // Add the current month to the result array
            months.push(currentMonth.toLocaleString('default', { month: 'numeric', year: 'numeric' }));

            // Move to the next month
            currentMonth.setMonth(currentMonth.getMonth() + 1);
        }

        return months;

    }

    return (
        <span className="visually-fullwidth">
        <ComplianceMsg textOutput={textOutput} complianceArray={complianceArray}></ComplianceMsg>
        </span>
    );
}

export default Validator;
