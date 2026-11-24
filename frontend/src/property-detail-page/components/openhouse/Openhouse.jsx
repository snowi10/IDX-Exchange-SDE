/**
 * The component to display openhouse information of a property. 
 * @param {object} details - Keys representing openhouse details and their values.
 */
export function Openhouse({ details }) {
    // Return no openhouse information if it does not exist.
    if (!details.isInfo) {
        return (
            <div>
                <h1><b>Openhouse:</b></h1>
                <p>None</p>
            </div>);
    }

    return (
        <div>
            <h1><b>Openhouse:</b></h1>
            <h3><b>Status:</b> {details.status}</h3>
            <h3><b>Type:</b> {details.type}</h3>
            <h3><b>Date:</b> {details.date}</h3>
            <h3><b>Start Time:</b> {details.startTime}</h3>
            <h3><b>End Time:</b> {details.endTime}</h3>
            <h3><b>Showing Agent:</b> {details.agentFirstName} {details.agentLastName}</h3>
        </div>);
}