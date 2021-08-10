import React, { useState } from "react";
import { Container, Row, Col, Button, InputGroup, FormControl } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function Measure() {

	const [startDate, setStartDate] = useState(new Date());


	const ExampleCustomInput = React.forwardRef(({ value, onClick }, ref) => (
		<Button className="example-custom-input" onClick={onClick} ref={ref}>
			{value}
		</Button>
	));

	return (
		<Container className="mt-3">
			<br></br>
			<Row className="mt-3">
				<Col>
					<h3>Add Measurement</h3>
					<br></br>
					
					<DatePicker
						selected={startDate}
						onChange={(date) => setStartDate(date)}
						customInput={<ExampleCustomInput />}
					/>
				</Col>
			</Row>

			<Row className="mt-3 justify-content-center">
				<Col className="col-8 col-sm-6 col-md-4 col-lg-4 col-xl-4">
					<Row className="mt-3">
						<Col>
							<InputGroup className="mb-3">
								<FormControl
									placeholder="Height"
									aria-label="Height"
									aria-describedby="basic-addon2"
									type="number"
								/>
								<InputGroup.Text id="basic-addon2">cm</InputGroup.Text>
							</InputGroup>
						</Col>
					</Row>
					<Row className="mt-3">
						<Col>
						<InputGroup className="mb-3">
								<FormControl
									placeholder="Weight"
									aria-label="Weight"
									aria-describedby="basic-addon2"
									type="number"
								/>
								<InputGroup.Text id="basic-addon2">kg</InputGroup.Text>
							</InputGroup>
						</Col>
					</Row>
					<Row className="mt-3">
						<Col>
						<InputGroup className="mb-3">
								<FormControl
									placeholder="Waist"
									aria-label="Waist"
									aria-describedby="basic-addon2"
									type="number"
								/>
								<InputGroup.Text id="basic-addon2">cm</InputGroup.Text>
							</InputGroup>
						</Col>
					</Row>
					<Row className="mt-3">
						<Col>
						<InputGroup className="mb-3">
								<FormControl
									placeholder="Neck"
									aria-label="Neck"
									aria-describedby="basic-addon2"
									type="number"
								/>
								<InputGroup.Text id="basic-addon2">cm</InputGroup.Text>
							</InputGroup>
						</Col>
					</Row>
					<Row className="mt-3">
						<Col>
							<Button>
								Save
							</Button>
						</Col>
						<Col>
							<Button>
								Cancel
							</Button>
						</Col>
					</Row>
				</Col>
			
			</Row>

			
			
		</Container>
	);
}

export default Measure;