import React from 'react';
import { Router } from "@reach/router"

import Login from './pages/Login'
import Main from './pages/Main'
import Configs from './pages/Configs'
import Extrato from './pages/Extrato'
import Graficos from './pages/Graficos'
import AdicionarGasto from './pages/AdicionarGasto'

import './App.css'
import 'typeface-roboto';

function App() {
	return (
		<div className="appContainer">
			<Router className='router'>
				<Login path='/'></Login>
				<Main path=':id'>
					<AdicionarGasto path='gasto'></AdicionarGasto>
					<Extrato path='extrato'></Extrato>
					<Graficos path='graficos'></Graficos>
					<Graficos path='Fatura'></Graficos>
					<Configs path='configs'></Configs>
				</Main>
			</Router>
		</div>
	);
}

export default App;
