import { React, Component } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import { Line } from 'react-chartjs-2';

class Weight extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loaded: false,
			userData: {},
			labels: [],
			points: [],
			chartData: [],
		};
	}

	componentDidMount() {
	}

	componentDidUpdate(prevProps){
		if (prevProps.userData !== this.props.userData) {
			if (this.props.userData.measurements) {
				this.prepareData(this.props.userData);
			} else {
				this.clearData();
			}
		}
	}

	clearData = () => {
		this.setState({
			labels: [],
			points: [],
		});
	}

	prepareData = (userData) => {

		const chartData = userData.measurements.map(item => ({ x: new Date(item.date).toISOString().split('T')[0].replaceAll('-', '/'), y: item.weight }));
		console.log(chartData);

		let labels = userData.measurements.map(item => new Date(item.date).toISOString().split('T')[0]);
		let points = userData.measurements.map(item => item.weight);

		this.setState({
			labels: labels,
			points: points,
			chartData: chartData,
		});
	}

	render() {

		const data = {
			// labels: this.state.labels,
			datasets: [
			  {
				label: '# of Votes',
				// data: this.state.points,
				data: this.state.chartData,
				fill: false,
				backgroundColor: 'rgb(255, 99, 132)',
				borderColor: 'rgba(255, 99, 132, 0.2)',
			  },
			],
		  };
  
		const options = {
			responsive: true,
			scales: {
				yAxes: [
				  {
					ticks: {
					  beginAtZero: true,
					},
				  },
				],
				xAxes: [
					{
						type: 'timeseries',
						time: {
							parser: "YYYY.MM.DD",
							unit: 'month',
							displayFormats: {
								quarter: 'MMM YYYY'
							}
						}
					}
				],
			},
			plugins: {
				legend: {
					display: false,
					labels: {
						color: 'rgb(255, 99, 132)'
					}
				}
			}
		};

		return (
			<Container className="mt-3 p-0">
				<br></br>
				<h3>Weight Progress [kg]</h3>

				<Row className="mt-3 justify-content-center">
					<Col className="">
						<Line data={data} options={options} />
					</Col>
				</Row>
			</Container>
		);
	}
}
export default Weight;