import { React, Component } from "react";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import Measure from './common/components/Measure';
import Weight from './common/components/Weight';
import Bodyfat from './common/components/Bodyfat';
import seedUserData from './common/seedUserData';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			newUser: false,
			measure: {
			},
			seedUserData: seedUserData,
			userData: {
				height: 0,
				measurements: []
			}
		};
	};

	seedUserData = () => {
		localStorage.setItem('userData', JSON.stringify(this.state.seedUserData));
	}

	clearSeedData = () => {
		localStorage.removeItem('userData');
	}

	async componentDidMount() {

		// this.seedUserData(); // Load user data for testing
		// this.clearSeedData(); // Cleat local storage of user data

		const userData = JSON.parse(localStorage.getItem('userData'));
		if (userData && userData.measurements && userData.measurements.length > 0) {
			console.log('User exists, retrieving data.');
			await this.setState({
				userData: userData
			});
		} else {
			console.log('New user');
			await this.setState({
				newUser: true
			});
		}
	};

	saveNewMeasurement = async (newMeasurment) => {
		console.log('App > before save', this.state.userData.measurements);
		const newArray = [...this.state.userData.measurements];

		if (this.state.userData.measurements 
			&& this.state.userData.measurements.length > 0 
			&& this.state.userData.measurements[this.state.userData.measurements.length - 1].date === newMeasurment.date) {
			newArray.splice(this.state.userData.measurements.length - 1);
		}
		newArray.splice(newArray.length, 0, newMeasurment);
		await this.setState(prevState => {
			let userData = Object.assign({}, prevState.userData);
			userData.measurements = newArray;
			userData.height = newMeasurment.height;
			return { userData };
		})

		localStorage.setItem('userData', JSON.stringify(this.state.userData));
	}

	deleteMeasurement = async () => {
		
		console.log('App > before delete', this.state.userData.measurements)
		const today = (new Date().toISOString().split('T')[0]);

		if (this.state.userData.measurements && this.state.userData.measurements.length === 1) {
			localStorage.removeItem('userData');
		} else if (this.state.userData.measurements 
			&& this.state.userData.measurements.length > 0 
			&& this.state.userData.measurements[this.state.userData.measurements.length - 1].date === today) {
				const newArray = [...this.state.userData.measurements];
				newArray.splice(this.state.userData.measurements.length - 1);

				await this.setState(prevState => {
					let userData = Object.assign({}, prevState.userData);
					userData.measurements = newArray;
					return { userData };
				})

				localStorage.setItem('userData', JSON.stringify(this.state.userData));
			}
	}

	render() {
		return (
			<Container className="App">
				<Row className="mt-3">
					<Col>
						<Tabs defaultActiveKey={this.state.newUser ? 'settings' : 'measure'} className="mb-3">
							<Tab eventKey="measure" title="Measure">
								<Measure
									userData={this.state.userData}
									dateInfo={this.state.dateInfo}
									saveNewMeasurement={this.saveNewMeasurement}
									deleteMeasurement={this.deleteMeasurement}
								/>
							</Tab>
							<Tab eventKey="weight" title="Weight">
								<Weight userData={this.state.userData} />
							</Tab>
							<Tab eventKey="bodyfat" title="Bodyfat" >
								<Bodyfat userData={this.state.userData} />
							</Tab>
						</Tabs>
					</Col>
				</Row>
			</Container>
		);
	};
}

export default App;