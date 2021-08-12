import { React, Component } from "react";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import Measure from './common/components/Measure';
import Weight from './common/components/Weight';
import Bodyfat from './common/components/Bodyfat';
import Settings from './common/components/Settings';
import seedUserData from './common/seedUserData';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			measure: {
			},
			seedUserData: seedUserData,
			userData: {
				height: 0,
				measurements: []
			},
			key: '',
		};
	};

	seedUserData = async () => {
		localStorage.setItem('userData', JSON.stringify(this.state.seedUserData));
		await this.setState({
			userData: {...this.state.seedUserData}
		});
		console.log('User seed data has been loaded.')
	}

	async componentDidMount() {
		const userData = JSON.parse(localStorage.getItem('userData'));
		if (userData && userData.height !== 0){
			console.log('User exists, retrieving data.');
			await this.setState({
				userData: userData,
				key: 'measure'
			});
		} else {
			console.log('New user');
			await this.setState({
				key: 'settings'
			});
		}
	};

	saveNewMeasurement = async (newMeasurment) => {
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
		this.persistUserData();
	}

	deleteMeasurement = async () => {
		const today = (new Date().toISOString().split('T')[0]);

		if (this.state.userData.measurements
			&& this.state.userData.measurements.length > 0 
			&& this.state.userData.measurements[this.state.userData.measurements.length - 1].date === today) {
				const newArray = [...this.state.userData.measurements];
				newArray.splice(this.state.userData.measurements.length - 1);

				await this.setState(prevState => {
					let userData = Object.assign({}, prevState.userData);
					userData.measurements = newArray;
					return { userData };
				})
				this.persistUserData();
			}
	}

	handleSelect = (key) => {
		this.setState({ key: key });
	}

	saveHeight = async (height) => {
		await this.setState(prevState => {
			let userData = Object.assign({}, prevState.userData);
			userData.height = height;
			return { userData };
		})
		this.persistUserData();
	}

	persistUserData = () => {
		console.log('Persisting user data changes to local storage.')
		localStorage.setItem('userData', JSON.stringify(this.state.userData));
	}

	clearData = () => {
		this.setState({
			userData: {
				height: 0,
				measurements: []
			},
		})
		localStorage.removeItem('userData');
		console.log('All data has been cleared.');
	}
	
	render() {
		return (
			<Container className="App">
				<Row className="mt-3">
					<Col>
						<Tabs activeKey={this.state.key} onSelect={this.handleSelect} className="mb-3">
							<Tab eventKey="measure" title="Measure" disabled={this.state.userData.height === 0} >
								<Measure
									userData={this.state.userData}
									dateInfo={this.state.dateInfo}
									saveNewMeasurement={this.saveNewMeasurement}
									deleteMeasurement={this.deleteMeasurement}
								/>
							</Tab>
							<Tab eventKey="weight" title="Weight" disabled={this.state.userData.height === 0} >
								<Weight userData={this.state.userData} />
							</Tab>
							<Tab eventKey="bodyfat" title="Bodyfat" disabled={this.state.userData.height === 0}  >
								<Bodyfat userData={this.state.userData} />
							</Tab>
							<Tab eventKey="settings" title="Settings" >
								<Settings 
									userData={this.state.userData} 
									saveHeight={this.saveHeight} 
									clearData={this.clearData} 
									seedUserData={this.seedUserData}
								/>
							</Tab>
						</Tabs>
					</Col>
				</Row>
			</Container>
		);
	};
}

export default App;