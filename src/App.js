import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import Measure from './common/components/Measure';

function App() {
  return (
	<Container className="App">
		<Row className="mt-3">
			<Col>
				<Tabs defaultActiveKey="measure" className="mb-3">
					<Tab eventKey="measure" title="Measure">
						<Measure />
					</Tab>
					<Tab eventKey="weight" title="Weight">
						<p>Not marble, nor the gilded monuments Of princes, shall outlive this powerful rhyme; But you shall shine more bright in these contents Than unswept stone, besmear'd with sluttish time. When wasteful war shall statues overturn, And broils root out the work of masonry, Nor Mars his sword, nor war's quick fire shall burn The living record of your memory. 'Gainst death, and all-oblivious enmity Shall you pace forth; your praise shall still find room</p>
					</Tab>
					<Tab eventKey="bodyfat" title="Bodyfat" >
						<p>Not marble, nor the gilded monuments Of princes, shall outlive this powerful rhyme; But you shall shine more bright in these contents Than unswept stone, besmear'd with sluttish time. When wasteful war shall statues overturn, And broils root out the work of masonry, Nor Mars his sword, nor war's quick fire shall burn The living record of your memory. 'Gainst death, and all-oblivious enmity Shall you pace forth; your praise shall still find room</p>
					</Tab>
				</Tabs>
			</Col>
		</Row>
	</Container>
  );
}

export default App;
