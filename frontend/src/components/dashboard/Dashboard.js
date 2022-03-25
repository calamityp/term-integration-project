import React, { useEffect, useState } from 'react'

import { Button, Card } from '@mui/material';
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import ReactLoading from 'react-loading';
import { ToastContainer, toast } from 'react-toastify';
import { BarChart, Bar, PieChart, Pie, Cell, Sector, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useLocation } from 'react-router-dom';

import './Dashboard.css'
import 'react-toastify/dist/ReactToastify.css';
import PriorityTable from '../tables/PriorityTable';

const logout = () => {
    localStorage.clear();
    window.location.href = '/';
}
const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
                {payload.name}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value}`}</text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                {`(Rate ${(percent * 100).toFixed(2)}%)`}
            </text>
        </g>
    );
};
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const data = [
    { key: 'Critica', value: 5 },
    { key: 'Alta', value: 43 },
    { key: 'Media', value: 2229 },
    { key: 'Baja', value: 5549 },
];
const Dashboard = () => {
    let location = useLocation();
    let username = location.state.username;
    let userId = location.state.userId;
    let docId = location.state.docId;
    const [kpis, setKpis] = useState({});
    const [activeIndex, setActiveIndex] = useState(0);
    const [pRData, setPRData] = useState([]);
    const [pBData, setPBData] = useState([]);
    const [iCData, setICData] = useState([]);
    const [loaded, setLoaded] = useState(false);

    const navigate = useNavigate();

    const type = 'bars';
    const color = '#e39f00';
    const height = 150;
    const width = 150;

    const preparePRData = (val) => {
        let data = []
        for (const [key, value] of Object.entries(val)) {
            data.push({ "name": key, "value": value })
        }
        setPRData(data);
    }
    const preparePBData = (val) => {
        let data = []
        for (const [key, value] of Object.entries(val)) {
            data.push({ "name": key, "value": value })
        }
        setPBData(data);
    }
    const prepareICData = (val) => {
        let data = []
        for (const [key, value] of Object.entries(val)) {
            data.push({ "name": key, "company_Name": value })
        }
        setICData(data);
    }
    const onPieEnter = (_, index) => {
        setActiveIndex(index)
    };
    useEffect(() => {
        setLoaded(true);
        axios.get(`http://localhost:5000/dashboardkpis`, {
            params: {
                docId,
            }
        }).then((res) => {
            setLoaded(false);
            if (res.data['response']) {
                console.log("success");
                toast.success("Succeed..",
                    { autoClose: 5000 })

                setKpis(res.data["kpis"])
                preparePRData(res.data["kpis"].raisedInsidentPerPriority)
                preparePBData(res.data["kpis"].backlogInsidentPerPriority)
                prepareICData(res.data["kpis"].noOfInsPerCustomer)
            } else {
                console.log("Error");
                toast.error("Data loading failed",
                    { autoClose: 5000 })
                navigate("/main", { state: { "username": username, "id": userId } })
            }
        }).catch((err) => {
            console.log("Error");
            setLoaded(false);
            toast.error("Failed to load data",
                { autoClose: 5000 })
            navigate("/main", { state: { "username": username, "id": userId } })
            console.log(err)
        });
    }, [userId, docId]);
    return (
        <>
            {loaded ? <div className='mt-5' style={{ 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center' }}><ReactLoading type={type} color={color} height={height} width={width} /></div>
                :
                <div className='container-fluid' id='mi'>
                    <div className='top-bar'>
                        <div className='row mt-2' id='top'>
                            <div className='col'>
                                <div className='username'>
                                    <span id='uname' style={{ 'color': 'black' }}>{username}</span>
                                </div>
                            </div>
                            <div className='col'>
                                <div className='logout'>
                                    <Button onClick={logout} id='btn-logout' style={{ 'backgroundColor': 'red' }} startIcon={<LogoutSharpIcon />} variant='contained'><span>Logout</span></Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ToastContainer />
                    <div className='row'>
                        <div className='topic'>
                            <h3 style={{ 'textAlign': 'left' }}>KPI Summary</h3>
                        </div>
                    </div>
                    <div className='dashboard-content mt-5'>
                        <div className='card-stats'>
                            <div className='container'>
                                <div className='row mt-5 mb-5'>
                                    <div className='col' >
                                        <Card id='crd1'>
                                            <h6>Total Incidents</h6>
                                            <h3>{kpis.totalRaisedIns}</h3>
                                        </Card>
                                    </div>
                                    <div className='col' >
                                        <Card id='crd2'>

                                            <h6>Total Critical Incidents</h6>
                                            <h3>{kpis.totalP1}</h3>
                                        </Card>
                                    </div>
                                    <div className='col' >
                                        <Card id='crd3'>
                                            <h6>Number of incidences P1 in the month meeting SLA resolution time</h6>
                                            <h3>{kpis.noOfP1SLA}</h3>
                                        </Card>
                                    </div>
                                    <div className='col' >
                                        <Card id='crd4'>
                                            <h6>Number of incidences P1 in the month not meeting SLA resolution time</h6>
                                            <h3>{kpis.noOfP1NotSLA}</h3>
                                        </Card>
                                    </div>
                                    <div className='col' >
                                        <Card id='crd5'>
                                            <h6>Average resolution time for incidences P1 meeting SLA</h6>
                                            <h3>{kpis.avgTimeP1SLA}</h3>
                                        </Card>
                                    </div>
                                </div>
                                <div className='row'>
                                    <Card className='outer' >
                                        <div className='row pt-3 '>
                                            <h4>Priority Type - Raised</h4>
                                            <div className='col' style={{ 'height': '200px', 'marginTop': '100px', 'paddingLeft': '100px' }}>
                                                <PriorityTable
                                                    data={kpis.raisedInsidentPerPriority}
                                                />
                                            </div>
                                            <div className='col' style={{ 'height': '250px' }}>
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart width={400} height={400}>
                                                        <Pie
                                                            activeIndex={activeIndex}
                                                            activeShape={renderActiveShape}
                                                            data={pRData}
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={60}
                                                            outerRadius={80}
                                                            fill="#8884d8"
                                                            dataKey="value"
                                                            onMouseEnter={onPieEnter}
                                                        >
                                                            {data.map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                            ))}
                                                        </Pie>
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                                <div className='row mt-2'>
                                    <Card className='outer' >
                                        <div className='row pt-3 '>
                                            <h4>Priority Type - Backlog</h4>
                                            <div className='col' style={{ 'height': '200px', 'marginTop': '100px', 'paddingLeft': '100px' }}>
                                                <PriorityTable
                                                    data={kpis.backlogInsidentPerPriority}
                                                />
                                            </div>
                                            <div className='col' style={{ 'height': '250px' }}>
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart width={400} height={400}>
                                                        <Pie
                                                            activeIndex={activeIndex}
                                                            activeShape={renderActiveShape}
                                                            data={pBData}
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={60}
                                                            outerRadius={80}
                                                            fill="#8884d8"
                                                            dataKey="value"
                                                            onMouseEnter={onPieEnter}
                                                        >
                                                            {data.map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                            ))}
                                                        </Pie>
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                                <div className='row mt-2'>
                                    <Card className='outer' >
                                        <div className='row pt-3 '>
                                            <h4>Number of Causes</h4>
                                            <div className='col' style={{ 'height': 'auto', 'minHeight': '200px', 'marginTop': '60px', 'paddingLeft': '100px' }}>
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart
                                                        width={500}
                                                        height={500}
                                                        data={kpis.noOfInsPerCause}
                                                        margin={{
                                                            top: 20,
                                                            right: 30,
                                                            left: 20,
                                                            bottom: 5,
                                                        }}
                                                    >
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis dataKey="name" />
                                                        <YAxis yAxisId="left" orientation="left" stroke="#850014" />
                                                        <YAxis yAxisId="right" orientation="right" stroke="#067314" />
                                                        <Tooltip />
                                                        <Legend />
                                                        <Bar yAxisId="left" dataKey="Raised" fill="#850014" />
                                                        <Bar yAxisId="right" dataKey="Closed" fill="#067314" />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                                <div className='row mt-2'>
                                    <Card className='outer mb-3' >
                                        <div className='row pt-3'>
                                            <h4>Number of Incidence for Customer Company</h4>
                                            <div className='col mb-2' style={{ 'height': 'auto', 'minHeight': '200px', 'marginTop': '60px', 'paddingLeft': '100px' }}>
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart
                                                        width={500}
                                                        height={300}
                                                        data={iCData}
                                                        margin={{
                                                            top: 5,
                                                            right: 30,
                                                            left: 20,
                                                            bottom: 5
                                                        }}
                                                        barSize={20}
                                                    >
                                                        <XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} />
                                                        <YAxis />
                                                        <Tooltip />
                                                        <Legend />
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <Bar dataKey="company_Name" fill="#8884d8" background={{ fill: "#eee" }} />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default Dashboard