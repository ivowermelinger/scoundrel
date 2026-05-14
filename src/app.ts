import Alpine from 'alpinejs'
import engine from './components/engine';

import './styles/reset.css';
import './styles/app.css';
import './styles/engine.css';
import './styles/card.css';

Alpine.data('engine', engine);
Alpine.start();
