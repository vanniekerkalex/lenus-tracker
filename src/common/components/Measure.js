import { React, Component } from "react";
import { Container, Row, Col, Button, InputGroup, FormControl } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

class Measure extends Component {
	constructor(props) {
		super(props);

		this.state = {
			date: new Date(),
			loaded: false,
			weight: 0,
			waist: 0,
			neck: 0,
			bodyfat: 0,
			userData: {},
			height: 0,
		};

	}

	componentDidMount() {
	}

	async componentDidUpdate(prevProps){
		if (prevProps.userData !== this.props.userData) {
			if (this.props.userData.measurements && this.props.userData.measurements.length > 0){
				// This is to check if the dates match up, but prefilling is best for ease of updating values.
				//&& this.props.userData.measurements[this.props.userData.measurements.length - 1].date.toString() === (this.state.date.toISOString().split('T')[0])) {

				await this.setState({
					height: this.props.userData.height,
					weight: this.props.userData.measurements[this.props.userData.measurements.length - 1].weight,
					waist: this.props.userData.measurements[this.props.userData.measurements.length - 1].waist,
					neck: this.props.userData.measurements[this.props.userData.measurements.length - 1].neck,
				});
			}
		}
	}

	onInputChange = (event) => {
		const name = event.target.name;
		const value = event.target.value;
		this.setState({
		  [name]: value
		});
	  };

	calculateBodyfat(height, waist, neck) {
		const bodyfat = 495/(1.0324-0.19077*(Math.log10(waist-neck))+0.15456*(Math.log10(height)))-450;
		return bodyfat.toFixed(2);
	}

	saveMeasurement = (props) => {
		const newMeasurement = {
			date: (new Date().toISOString().split('T')[0]),
			height: parseFloat(this.state.height),
			weight: parseFloat(this.state.weight),
			waist: parseFloat(this.state.waist),
			neck: parseFloat(this.state.neck),
			bodyfat: parseFloat(this.calculateBodyfat(this.state.height, this.state.waist, this.state.neck)),
		}
		this.props.saveNewMeasurement(newMeasurement);
	}

	deleteMeasurement = async (props) => {
		await this.props.deleteMeasurement();
		await this.setState({
			weight: 0,
			waist: 0,
			neck: 0,
		});
		
	}

	changeDateSelected = (date) => {
		this.setState({ date: date });
	}

	render() {
		return (
			<Container className="mt-3">
				<br></br>
				<h3>Add Measurement</h3>

				<div className="mt-3" style={{ display: "inline-block", width: "150px" }}>
					<DatePicker 
						disabled
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
										value={this.state.weight}
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
										value={this.state.waist}
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
										value={this.state.neck}
									/>
									<InputGroup.Text id="basic-addon2" className="measure-info-back">cm</InputGroup.Text>
								</InputGroup>
							</Col>
						</Row>
						<Row className="mt-3">
							<Col>
							<InputGroup className="mb-3">
									<InputGroup.Text className="measure-info-front">Height</InputGroup.Text>
									<FormControl
										placeholder="Height"
										aria-label="Height"
										aria-describedby="basic-addon2"
										type="number"
										onChange={this.onInputChange}
										name="height"
										value={this.state.height}
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