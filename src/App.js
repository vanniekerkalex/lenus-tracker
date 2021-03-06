import { React, Component } from "react";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import Measure from './common/components/Measure';
import Weight from './common/components/Weight';
import Bodyfat from './common/components/Bodyfat';
import Waist from './common/components/Waist';
import Hips from './common/components/Hips';
import Settings from './common/components/Settings';
import seedUserData from './common/seedUserData';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			seedUserData: seedUserData,
			userData: {
				height: 0,
				sex: 'female',
				measurements: []
			},
			key: '',
		};
	};

	async componentDidMount() {
		const userData = await JSON.parse(localStorage.getItem('userData'));
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

	seedUserData = async () => {
		await this.clearData();
		await this.setState({
			userData: {...this.state.seedUserData}
		});
		localStorage.setItem('userData', JSON.stringify(this.state.seedUserData));
		console.log('User seed data has been loaded.')
	}

	clearData = () => {
		this.setState({
			userData: {
				height: 0,
				sex: 'female',
				measurements: []
			},
		})
		console.log('All data has been cleared.');
		localStorage.removeItem('userData');
	}

	persistUserData = async (userDataProps) => {
		if (userDataProps) {
			await this.setState(prevState => {
				let userData = Object.assign({}, prevState.userData);
				userData = {...userDataProps};
				return { userData };
			})
		}
		console.log('Persisting user data changes to local storage.')
		localStorage.setItem('userData', JSON.stringify(this.state.userData));
	}

	handleSelect = (key) => {
		this.setState({ key: key });
	}

	saveHeightSex = async (height, sex) => {
		await this.setState(prevState => {
			let userData = Object.assign({}, prevState.userData);
			userData.height = height;
			userData.sex = sex;
			return { userData };
		})
		console.log('Persisting height to user data and local storage.')
		localStorage.setItem('userData', JSON.stringify(this.state.userData));
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
									persistUserData={this.persistUserData}
								/>
							</Tab>
							<Tab eventKey="weight" title="Weight" disabled={this.state.userData.height === 0} >
								<Weight userData={this.state.userData} />
							</Tab>
							<Tab eventKey="waist" title="Waist" disabled={this.state.userData.height === 0}  >
								<Waist userData={this.state.userData} />
							</Tab>
							{ this.state.userData.sex === 'female' &&
								<Tab eventKey="hips" title="Hips" disabled={this.state.userData.height === 0}  >
									<Hips userData={this.state.userData} />
								</Tab>
							}
							<Tab eventKey="bodyfat" title="Bodyfat" disabled={this.state.userData.height === 0}  >
								<Bodyfat userData={this.state.userData} />
							</Tab>
							<Tab eventKey="settings" title="Settings" >
								<Settings 
									userData={this.state.userData} 
									saveHeightSex={this.saveHeightSex} 
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