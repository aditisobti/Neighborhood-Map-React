import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import { BrowserRouter } from 'react-router-dom'
import * as serviceWorker from './registerServiceWorker';

ReactDOM.render(
<BrowserRouter>
	<App />
</BrowserRouter>, document.getElementById('root'));
serviceWorker.register();