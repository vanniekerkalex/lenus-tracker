import { React, Component } from "react";
import { Container, Row, Col, Button, InputGroup, FormControl } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

class Measure extends Component {
	constructor(props) {
		super(props);

		this.state = {
			newEntry: {
				date: new Date((new Date()).toDateString()),
				weight: 0,
				waist: 0,
				neck: 0,
				bodyfat: 0,
			},
			userData: {
				height: 0,
				measurements: []
			},
		};

	}

	componentDidMount() {
	}

	async componentDidUpdate(prevProps){
		if (prevProps.userData !== this.props.userData) {
			await this.setState({
				userData: {...this.props.userData},
			});
		}
	}

	onInputChange = (event) => {
		const name = event.target.name;
		const value = event.target.value;

		this.setState(prevState => {
			let newEntry = Object.assign({}, prevState.newEntry);
			newEntry[name] = value;
			return { newEntry };
		})
	};

	deleteMeasurement = async () => {
		await this.resetStateValues();

		const measurements = [...this.state.userData.measurements];
		const index = measurements.findIndex((item) => this.state.newEntry.date.getTime() === new Date(item.date).getTime());
		measurements.splice(index);

		await this.setState(prevState => {
			let userData = Object.assign({}, prevState.userData);
			userData.measurements = measurements;
			return { userData };
		})

		this.props.persistUserData(this.state.userData);
	}

	resetStateValues = async () => {
		await this.setState(prevState => {
			let newEntry = Object.assign({}, prevState.newEntry);
			newEntry.weight = 0;
			newEntry.waist = 0;
			newEntry.neck = 0;
			return { newEntry };
		})
	}

	changeDateSelected = async (date) => {
		await this.setState(prevState => {
			let newEntry = Object.assign({}, prevState.newEntry);
			newEntry.date = new Date(date.toDateString());
			return { newEntry };
		})

		this.loadDateSelectedData();
	}

	loadDateSelectedData = () => {
		const measurements = [...this.state.userData.measurements];
		const index = measurements.findIndex((item) => new Date(item.date).getTime() === this.state.newEntry.date.getTime());

		if (index === -1) {
			this.resetStateValues();
		} else {
			this.setState(prevState => {
				let newEntry = Object.assign({}, prevState.newEntry);
				newEntry.weight = measurements[index].weight;
				newEntry.waist = measurements[index].waist;
				newEntry.neck = measurements[index].neck;
				return { newEntry };
			})
		}
	}

	parseEnteredValues = async () => {
		await this.setState(prevState => {
			let newEntry = Object.assign({}, prevState.newEntry);
			newEntry.weight = parseFloat(this.state.newEntry.weight) || 0;
			newEntry.waist = parseFloat(this.state.newEntry.waist) || 0;
			newEntry.neck = parseFloat(this.state.newEntry.neck) || 0;
			return { newEntry };
		})
	}

	storeBodyfat = async () => {
		await this.setState(prevState => {
			let newEntry = Object.assign({}, prevState.newEntry);
			newEntry.bodyfat = this.calculateBodyfat(this.state.userData.height, this.state.newEntry.waist, this.state.newEntry.neck);
			return { newEntry };
		})
	}

	calculateBodyfat(height, waist, neck) {
		const bodyfat = 495/(1.0324-0.19077*(Math.log10(waist-neck))+0.15456*(Math.log10(height)))-450;
		return bodyfat.toFixed(2);
	}

	saveMeasurement = async () => {
		await this.parseEnteredValues();
		this.storeBodyfat();

		const measurements = [...this.state.userData.measurements];
		const index = measurements.findIndex((item) => this.state.newEntry.date.getTime() >= new Date(item.date).getTime());
		const updatedMeasurements = [...measurements];

		if (index === -1) { // New entry not bigger or equal to any, insert in the front.
			updatedMeasurements.unshift(this.state.newEntry);
		} else { // Found a suitable place, add or update
			if (this.state.newEntry.date.getTime() === new Date(measurements[index].date).getTime()) { // Entry exists, update
				updatedMeasurements[index] = this.state.newEntry
			} else if (this.state.newEntry.date.getTime() > new Date(measurements[index].date).getTime()) { // Entry doesn't exist, insert
				updatedMeasurements.splice(index + 1, 0, this.state.newEntry);
			}
		}
		
		await this.setState(prevState => {
			let userData = Object.assign({}, prevState.userData);
			userData.measurements = updatedMeasurements;
			return { userData };
		})

		this.props.persistUserData(this.state.userData);
	}

	render() {
		return (
			<Container className="mt-3 p-0">
				<br></br>
				<h3>Add Measurement</h3>

				<div className="mt-3" style={{ display: "inline-block", width: "150px" }}>
					<DatePicker 
						dateFormat="dd/MM/yyyy"
						className="form-control text-center"
						selected={this.state.newEntry.date}
						onChange={(date) => this.changeDateSelected(date)}
					/>
				</div>

				<Row className="mt-3 justify-content-center">
					<Col className="col-8 col-sm-6 col-md-4 col-lg-4 col-xl-4">
						<Row className="mt-3">
							<Col>
							<InputGroup className="mb-3">
									<InputGroup.Text className="measure-info-front">Weight</InputGroup.Text>
									<FormControl
										placeholder="Weight"
										aria-label="Weight"
										aria-describedby="basic-addon2"
										type="number"
										onChange={this.onInputChange}
										name="weight"
										value={this.state.newEntry.weight}
									/>
									<InputGroup.Text id="basic-addon2" className="measure-info-back">kg</InputGroup.Text>
								</InputGroup>
							</Col>
						</Row>
						<Row className="mt-3">
							<Col>
							<InputGroup className="mb-3">
								<InputGroup.Text className="measure-info-front">Waist</InputGroup.Text>
									<FormControl
										placeholder="Waist"
										aria-label="Waist"
										aria-describedby="basic-addon2"
										type="number"
										onChange={this.onInputChange}
										name="waist"
										value={this.state.newEntry.waist}
									/>
									<InputGroup.Text id="basic-addon2" className="measure-info-back">cm</InputGroup.Text>
								</InputGroup>
							</Col>
						</Row>
						<Row className="mt-3">
							<Col>
							<InputGroup className="mb-3">
									<InputGroup.Text className="measure-info-front">Neck</InputGroup.Text>
									<FormControl
										placeholder="Neck"
										aria-label="Neck"
										aria-describedby="basic-addon2"
										type="number"
										onChange={this.onInputChange}
										name="neck"
										value={this.state.newEntry.neck}
									/>
									<InputGroup.Text id="basic-addon2" className="measure-info-back">cm</InputGroup.Text>
								</InputGroup>
							</Col>
						</Row>
						<Row className="mt-3">
							<Col>
								<Button onClick={this.saveMeasurement}>
									Save
								</Button>
							</Col>
							<Col>
								<Button variant="danger" onClick={this.deleteMeasurement}>
									Delete
								</Button>
							</Col>
						</Row>
					</Col>
				</Row>
			</Container>
		);
	}
}
export default Measure;