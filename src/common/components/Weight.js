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
		};
	}

	componentDidMount() {
	}

	componentDidUpdate(prevProps){
		if (prevProps.userData !== this.props.userData) {
			this.prepareData(this.props.userData);
		}
	}

	prepareData = (userData) => {
		let labels = userData.measurements.map(item => item.date);
		let points = userData.measurements.map(item => item.weight);

		this.setState({
			labels: labels,
			points: points,
		});
	}

	render() {

		const data = {
			labels: this.state.labels,
			datasets: [
			  {
				label: '# of Votes',
				data: this.state.points,
				fill: false,
				backgroundColor: 'rgb(255, 99, 132)',
				borderColor: 'rgba(255, 99, 132, 0.2)',
			  },
			],
		  };
  
		const options = {
			scales: {
				yAxes: [
					{
						ticks: {
							beginAtZero: true,
						},
					},
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
			<Container className="mt-3">
				<br></br>
				<h3>Weight Progress</h3>

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