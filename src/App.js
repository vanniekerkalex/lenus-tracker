import { React, Component } from "react";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import Measure from './common/components/Measure';
import Weight from './common/components/Weight';
import Bodyfat from './common/components/Bodyfat';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			dateInfo: {
				msg: "John",
			},
			newUser: false,
			measure: {
			},
			seedUserData: {
				height: 181,
				measurements: [
					{
						date: '2021-08-01',
						weight: 85,
						waist: 82,
						neck: 40,
						bodyfat: 11.89,
					},
					{
						date: '2021-08-02',
						weight: 86,
						waist: 82,
						neck: 40,
						bodyfat: 11.89,
					},
					{
						date: '2021-08-03',
						weight: 87,
						waist: 82,
						neck: 40,
						bodyfat: 11.89,
					},
					{
						date: '2021-08-04',
						weight: 88,
						waist: 82,
						neck: 40,
						bodyfat: 11.89,
					},
				]
			},
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

		// this.seedUserData();

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

		console.log('App > mounted', this.state.userData.measurements)
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
			return { userData };
		})

		localStorage.setItem('userData', JSON.stringify(this.state.userData));
		console.log('App > after save', this.state.userData.measurements)
	}

	deleteMeasurement = async () => {
		console.log('App > before delete', this.state.userData.measurements)
		const newArray = [...this.state.userData.measurements];

		newArray.splice(this.state.userData.measurements.length - 1);
		await this.setState(prevState => {
			let userData = Object.assign({}, prevState.userData);
			userData.measurements = newArray;
			return { userData };
		})

		localStorage.setItem('userData', JSON.stringify(this.state.userData));
		console.log('App > after delete', this.state.userData.measurements)
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
								<Bodyfat />
							</Tab>
							<Tab eventKey="settings" title="Settings" >
								{/* <Measure dateInfo={this.state.dateInfo} saveNewMeasurement={this.saveNewMeasurement} /> */}
								<p>Set height of the user, delete user aka clear data.</p>
							</Tab>
						</Tabs>
					</Col>
				</Row>
			</Container>
		);
	};
}

export default App;