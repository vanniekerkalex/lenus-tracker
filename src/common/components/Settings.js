import { React, Component } from "react";
import { Container, Row, Col, Button, InputGroup, FormControl, Form } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';

class Measure extends Component {
	constructor(props) {
		super(props);

		this.state = {
			height: 0,
			sex: 'female'
		};

	}

	componentDidUpdate(prevProps){
		if (prevProps.userData !== this.props.userData) {
			this.setState({
				height: this.props.userData.height || 0,
				sex: this.props.userData.sex,
			});
		}
	}

	saveHeightSex = () => {
		const height = parseFloat(this.state.height) || 0;
		this.props.saveHeightSex(height, this.state.sex);
	}

	onInputChange = (event) => {
		const name = event.target.name;
		const value = event.target.value;
		this.setState({
		  [name]: value
		});
	};

	render() {
		return (
			<Container className="mt-3">
				<br></br>
				<h3>Settings</h3>
				<h6>Please set your height and click save.</h6>
				<Row className="mt-3 justify-content-center">
					<Col className="col-8 col-sm-6 col-md-4 col-lg-4 col-xl-4">
						<Row className="mt-3">
							<Col>
							<InputGroup className="mb-3">
									<InputGroup.Text className="measure-info-front">Height</InputGroup.Text>
									<FormControl
										disabled={this.props.userData.height > 0}
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
								<InputGroup className="mb-3">
									<InputGroup.Text className="measure-info-front">Sex</InputGroup.Text>
									<Form.Select aria-label="Default select example" name="sex" value={this.state.sex} onChange={this.onInputChange} disabled={this.props.userData.height > 0} >
										<option value="female">Female</option>
										<option value="male">Male</option>
									</Form.Select>
								</InputGroup>
							</Col>
						</Row>
						<br></br>
						<Row className="mt-3">
							<Col>
								<Button style={{ width: "60px" }} onClick={this.saveHeightSex}>
									Save
								</Button>
							</Col>
							<Col>
								<Button style={{ minWidth: "110px" }} variant="danger" onClick={this.props.clearData}>
									Clear Data
								</Button>
							</Col>
						</Row>
						<br></br>
						<Row className="mt-3">
							<Col>
								<Button variant="info" onClick={this.props.seedUserData}>
									Seed User Data
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