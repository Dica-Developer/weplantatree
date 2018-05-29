import React, {
  Component
} from 'react';
import Loadable from 'react-loadable';

const LoadableComponent = Loadable({
  loader: () => import('./Co2Calculator'),
  loading() {
    return <div>Loading...</div>;
  }
});

export default class LoadableCo2Calculator extends Component {
  render() {
    return <LoadableComponent />;
  }
}
