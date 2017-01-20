import React, { Component } from 'react';
import { connect } from 'react-redux';
import SplitPane from 'react-split-pane';
import { local } from 'store2';
import classnames from 'classnames';

import parseExpressions from 'libs/parseExpressions';
import ResultExpression from './ResultExpression';

const storedSizeErrosPane = local.get('size_errors_pane');

const getGutterStyle = (expressions) => {
  const lineNumberLength = expressions
    .map(({ line }) => line )
    .reduce((len, line) => line.length > len ? line.length : len, 0);

  return {
    width: lineNumberLength * 8 + 10
  }
};

const Viewer = ({error, expressions, formatedResult}) => {
  const defaultHeight = storedSizeErrosPane || window.innerHeight * 0.25;
  const resultClassName = classnames('result', {
    'result--simple': !formatedResult,
    'result--has-errors': !!error ,
  });

  return (
    <SplitPane
      split="horizontal"
      defaultSize={defaultHeight}
      className="viewer"
      primary="second"
      onChange={local.set.bind(local, 'size_errors_pane')}
    >
      <div className={resultClassName}>
        <div
          className="result__errors-indicator"
          onClick={() => alert("Output is perhaps obsolete. The code has some errors.")}
        >
          <i className="mdi mdi-alert" />
        </div>
        <div className="CodeMirror-gutters" style={getGutterStyle(expressions)}/>
        <div className="result__lines">
          {expressions.map(({ line, expression }) => (
            <ResultExpression key={line} expression={expression} line={line} />
          ))}
        </div>
      </div>
      <div className="errors">
        {error ? error.message : null}
      </div>
    </SplitPane>
  );
};

const mapStateToProps = ({ formatedResult, currentSnippet }) => {
  const { stable, error } = currentSnippet;

  return {
    expressions: parseExpressions(stable),
    error,
    formatedResult
  };
};

export default connect(mapStateToProps)(Viewer);
