import { React, Component } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import { Line } from 'react-chartjs-2';

class Bodyfat extends Component {
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
		let labels = userData.measurements.map(item => item.date);
		let points = userData.measurements.map(item => item.bodyfat);

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
				backgroundColor: 'rgb(59, 137, 4)',
				borderColor: 'rgba(59, 137, 4, 0.2)',
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
			<Container className="mt-3 p-0">
				<br></br>
				<h3>Bodyfat Progress</h3>

				<Row className="mt-3 justify-content-center">
					<Col className="">
						<Line data={data} options={options} />
					</Col>
				</Row>
			</Container>
		);
	}
}
export default Bodyfat;