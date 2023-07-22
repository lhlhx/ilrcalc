import React, { useEffect, useRef, useState } from "react";

function NonComplianceMsg(props) {
    return (<li>{props.startMonth} - {props.endMonth}: {props.daysOfAbsence} days</li>);

};

export default function ComplianceMsg(props) {
    const [textOutput, setTextOutput] = useState(props.textOutput);
    const [nonComplianceArray, setNonComplianceArray] = useState([]);

    const nonComplianceMsgList = nonComplianceArray.map(e => {
        return (<NonComplianceMsg startMonth={e.start_month} endMonth={e.end_month} daysOfAbsence={e.days_of_absence} />)
    });

    useEffect(() => {
        setNonComplianceArray([]);
        if (props.textOutput == "") {
            let isCompliant = true;
            let nonComplianceArrayL = new Array();
            for (const element of props.complianceArray) {
                if (element.days_of_absence > 179) {
                    nonComplianceArrayL = nonComplianceArrayL.concat(element);
                    isCompliant = false;
                }
            }
            if (isCompliant == false) {
                setTextOutput("Non  Compliant!")
            } else {
                setTextOutput("All periods match compliance. Hooray!")
            }
            setNonComplianceArray(nonComplianceArrayL);
        } else {
            setTextOutput(props.textOutput);
        }
    }, [props.complianceArray]);

    return (
        <div>
        <span>{textOutput}</span>
        <ul className="absence_msg">{nonComplianceMsgList}</ul>
        <AllAbsenceMsg complianceArray={props.complianceArray}/>
        </div>
    );
}

function AllAbsenceMsg(props) {
    const [isExpanded, setExpand] = useState(false);

    const complianceMsgList = props.complianceArray.map(e => {
        return (<li>{e.start_month} - {e.end_month}: {e.days_of_absence} days</li>);
    });

    function handleToggle(e) {
        if (isExpanded == true) {
            setExpand(false);
        } else {
            setExpand(true);

        }
    }

    return (
        <div>
        <a href="#" onClick={handleToggle}>{isExpanded? 'Hide all periods':'Show all periods'}</a>
        {isExpanded? complianceMsgList : null }
        </div>
    )
};

