import React from 'react'

import Table from 'react-bootstrap/Table';

const PriorityTable = (props) => {
    const colmns = props.data ? Object.keys(props.data) : [];
    const values = props.data ? Object.values(props.data) : [];
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    {colmns.map((itm, index) => {
                        return (
                            <th>{itm}</th>
                        );
                    })}
                </tr>
            </thead>
            <tbody>
                <tr>
                    {values.map((itm, index) => {
                        return (
                            <td>{itm}</td>
                        );
                    })}
                </tr>
            </tbody>
        </Table>
    )
}

export default PriorityTable