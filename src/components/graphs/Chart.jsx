import React, { useEffect, useState } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
const Chart = ({ data, keyData }) => {

    return (
        <div>
            <LineChart width={400} height={250} data={data} margin={{ top: 1, right: 10, bottom: 1, left: 0 }}>
                <Line type="monotone" dataKey={keyData} stroke="#00e5f8" />
                <CartesianGrid stroke="#00affa" strokeDasharray="3 3" />
                <XAxis dataKey="momento" />
                <YAxis />
                <Tooltip contentStyle={{backgroundColor:'#282c34', borderColor:'#00e5f8'}}/>
            </LineChart>

        </div>
    )
}

export default Chart;