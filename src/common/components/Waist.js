import { React, Component } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import { Line } from 'react-chartjs-2';

class Waist extends Component {
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
		const labels = userData.measurements.map(item => item.date);
		const points = userData.measurements.map(item => item.waist);

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
				data: this.state.points,
					fill: false,
					backgroundColor: 'rgb(0, 30, 201)',
					borderColor: 'rgba(0, 30, 201, 0.2)',
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
				<h3>Waist Progress [cm]</h3>

				<Row className="mt-3 justify-content-center">
					<Col className="">
						<Line data={data} options={options} />
					</Col>
				</Row>
			</Container>
		);
	}
}
export default Waist;