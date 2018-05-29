import React from 'react';
import { render } from 'react-dom';
import Routes from './routes';

import '../less/main.less';
import '../js/common/header/header.less';

render(<Routes />, document.getElementById('app'));
