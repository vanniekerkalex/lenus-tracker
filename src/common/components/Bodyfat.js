import { React, Component } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';

class Bodyfat extends Component {
	constructor(props) {
		super(props);

		this.state = {
		};

	}

	componentDidMount() {
	}

	componentDidUpdate(){
	}

	render() {
		return (
			<Container className="mt-3">
				<br></br>
				<h3>Bodyfat Progress</h3>

				<Row className="mt-3 justify-content-center">
					<Col className="col-8 col-sm-6 col-md-4 col-lg-4 col-xl-4">
						
					</Col>
				</Row>
			</Container>
		);
	}
}
export default Bodyfat;