import Alpine from 'alpinejs'
import engine from './components/engine';

import './styles/reset.css';
import './styles/app.css';

Alpine.data('engine', engine);
Alpine.start();
