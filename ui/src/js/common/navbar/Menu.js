import React, {Component} from 'react';

export default class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  show() {
    this.setState({visible: true});
  }

  test() {
    this.setState({visible: false});
  }

  hide() {
    this.setState({visible: false});
  }

  render() {
    const childrenWithProps = React.Children.map(this.props.children, (child) => React.cloneElement(child, {hide: this.hide.bind(this)}));
    return (
      <div className="menu">
        <div className={(this.state.visible
          ? 'visible '
          : 'notvisible ') + this.props.alignment}>
          <div className="closeMenu">
            <button onClick={this.hide.bind(this)}>
              X
            </button>
          </div>
          {childrenWithProps}
        </div>
      </div>
    );
  }
}
