import React, {
  Component
} from 'react';
import {
  render
} from 'react-dom';
import {
  Link
} from 'react-router';
import Boostrap from 'bootstrap';

import IconButton from '../../common/components/IconButton';

export default class Overview extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="col-md-12">
          <h1>Tools</h1>
        </div>
        <div className="col-md-4"><img src="/assets/images/widgets.png" alt="widgets" width="250" height="350"/>
          <div className="desc">
            <IconButton text="Widgets" glyphIcon="glyphicon-forward" onClick={()=>{this.props.switchTo('widgets');}}/>
            <p>
              <span className="bold">Tue Gutes und sprich darüber!</span><br/>Wir generieren Dir ein paar Zeilen Code, den Du nur in Deine WebSeite einfügen brauchst, um Dein Engagement auf iplantatree.org der Welt zu zeigen.<br/>
                Kopieren - Einfügen - Fertig.
            </p>
          </div>
        </div>
        <div className="col-md-4"><img src="/assets/images/certificate.jpg" alt="certificate" width="250" height="350"/>
          <div className="desc">
            <IconButton text="Zertifikate" glyphIcon="glyphicon-forward" onClick={()=>{this.props.switchTo('certificates');}}/>
            <p>
              <span className="bold">Dein Beitrag überzeugt!</span><br/>Erstelle ganz einfach dein eigenes Zertifikat im PDF-Format mit individuellem Text (wie z. B. einer Widmung)
            </p>
          </div>
        </div>
        <div className="col-md-4"><img src="/assets/images/banner.png" alt="banner" width="250" height="350"/><br/>
          <div className="desc">
            <IconButton text="Banner" glyphIcon="glyphicon-forward" onClick={()=>{this.props.switchTo('banner');}}/>
            <p>
              <span className="bold">Mit Engagement werben!</span><br/>IPAT-Banner in gängigen Größen für Deine Homepage.
              </p>
          </div>
        </div>
      </div>
    );
  }
}
/* vim: set softtabstop=2:shiftwidth=2:expandtab */
