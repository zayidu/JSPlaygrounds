import React, { Component } from 'react';
import { connect } from 'react-redux';
import SplitPane from 'react-split-pane';
import { local } from 'store2';

import { themesType } from 'themes';

import Editor from './editor';
import Viewer from './viewer';
import Header from './Header';

const storedSizeViewerPane = local.get('size_viewer_pane');


const App = ({ theme }) => {
  const width = window.innerHeight;
  const defaultSize = storedSizeViewerPane || window.innerWidth * 0.3;

  return (
    <div className={`CodeMirror cm-s-${theme} theme-${themesType[theme]} App`}>
      <Header />
      <div className="App__master">
        <SplitPane
           split="vertical"
           defaultSize={defaultSize}
           primary="second"
           onChange={local.set.bind(local, 'size_viewer_pane')}
        >
          <Editor />
          <Viewer />
        </SplitPane>
      </div>
    </div>
  );
}

const mapStateToProps = ({ theme }) => ({ theme });

export default connect(mapStateToProps)(App);
