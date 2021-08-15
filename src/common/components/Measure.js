import { React, Component } from "react";
import { Container, Row, Col, Button, InputGroup, FormControl } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {convertDateToString} from '../convertDateToString.js';

class Measure extends Component {
	constructor(props) {
		super(props);

		this.state = {
			date: new Date((new Date()).toDateString()),
			newEntry: {
				date: convertDateToString(new Date()),
				weight: 0,
				waist: 0,
				hips: 0,
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

		const selectedDate = new Date(this.state.newEntry.date).getTime();
		const measurements = [...this.state.userData.measurements];
		const index = measurements.findIndex((item) => selectedDate === new Date(item.date).getTime());

		
		if (index !== -1) {
			measurements.splice(index, 1);

			await this.setState(prevState => {
				let userData = Object.assign({}, prevState.userData);
				userData.measurements = [...measurements];
				return { userData };
			})

			this.props.persistUserData(this.state.userData);
		}
	}

	resetStateValues = async () => {
		await this.setState(prevState => {
			let newEntry = Object.assign({}, prevState.newEntry);
			newEntry.weight = 0;
			newEntry.waist = 0;
			newEntry.hips = 0;
			newEntry.neck = 0;
			return { newEntry };
		})
	}

	changeDateSelected = async (date) => {
		await this.setState(prevState => {
			let newEntry = Object.assign({}, prevState.newEntry);
			newEntry.date = convertDateToString(date);
			return { newEntry };
		})
		
		await this.setState({
			date: date
		})

		this.loadDateSelectedData();
	}

	loadDateSelectedData = () => {
		const selectedDate = new Date(this.state.newEntry.date).getTime();
		const measurements = [...this.state.userData.measurements];
		const index = measurements.findIndex((item) => selectedDate === new Date(item.date).getTime());

		if (index === -1) {
			this.resetStateValues();
		} else {
			this.setState(prevState => {
				let newEntry = Object.assign({}, prevState.newEntry);
				newEntry.weight = measurements[index].weight;
				newEntry.waist = measurements[index].waist;
				newEntry.hips = measurements[index].hips;
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
			newEntry.hips = parseFloat(this.state.newEntry.hips) || 0;
			newEntry.neck = parseFloat(this.state.newEntry.neck) || 0;
			return { newEntry };
		})
	}

	storeBodyfat = async () => {
		await this.setState(prevState => {
			let newEntry = Object.assign({}, prevState.newEntry);
			newEntry.bodyfat = this.calculateBodyfat(this.state.userData.height, this.state.newEntry.waist, this.state.newEntry.hips,this.state.newEntry.neck);
			return { newEntry };
		})
	}

	calculateBodyfat(height, waist, hips, neck) {

		let bodyfat = 0;

		if (this.state.userData.sex === 'male') {
			bodyfat = 495/(1.0324-0.19077*(Math.log10(waist-neck))+0.15456*(Math.log10(height)))-450;
		} else if (this.state.userData.sex === 'female') {
			bodyfat=(495/(1.29579-0.35004*(Math.log10(waist+hips-neck))+0.221*(Math.log10(height)))-450);
		}

		return bodyfat.toFixed(2);
	}

	saveMeasurement = async () => {
		await this.parseEnteredValues();
		this.storeBodyfat();

		const selectedDate = new Date(this.state.newEntry.date).getTime();
		const measurements = [...this.state.userData.measurements];
		const index = measurements.findIndex((item) => selectedDate <= new Date(item.date).getTime());
		const updatedMeasurements = [...measurements];

		if (index === -1) { // New entry doesn't exist or is later than all other entries, push onto stack
			updatedMeasurements.push(this.state.newEntry);
		} else { // Found a suitable place, add or update
			if (selectedDate === new Date(measurements[index].date).getTime()) { // Entry exists, update
				updatedMeasurements[index] = this.state.newEntry
			} else if (selectedDate < new Date(measurements[index].date).getTime()) { // Entry doesn't exist, insert
				updatedMeasurements.splice(index, 0, this.state.newEntry);
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
						selected={this.state.date}
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
						{ this.state.userData.sex === 'female' &&
							<Row className="mt-3">
								<Col>
								<InputGroup className="mb-3">
									<InputGroup.Text className="measure-info-front">Hips</InputGroup.Text>
										<FormControl
											placeholder="Hips"
											aria-label="Hips"
											aria-describedby="basic-addon2"
											type="number"
											onChange={this.onInputChange}
											name="hips"
											value={this.state.newEntry.hips}
										/>
										<InputGroup.Text id="basic-addon2" className="measure-info-back">cm</InputGroup.Text>
									</InputGroup>
								</Col>
							</Row>
						}
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