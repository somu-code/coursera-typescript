/** @format */
//import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import HomePage from './components/HomePage.tsx';
import { Navbar } from './components/Navbar.tsx';
import SignInPage from './components/SignInPage.tsx';
import { Routes, Route } from 'react-router-dom';

function App() {
	return (
		<>
			{/* <Route path="/" exact element={<Navbar />} /> */}
			<Navbar />
			<HomePage />

			<Route path="/signin" element={<SignInPage />} />
		</>
	);
}

export default App;
