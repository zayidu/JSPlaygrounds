import map from 'lodash/fp/map';
import mapValues from 'lodash/fp/mapValues';
import filter from 'lodash/fp/filter';
import isUndefined from 'lodash/isUndefined'
import compose from 'lodash/fp/compose';
import reduce from 'lodash/reduce';
import keys from 'lodash/keys';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import SplitPane from 'react-split-pane';
import { local } from 'store2';
import classnames from 'classnames';

import parseExpressions from 'selectors/parse_expressions';
import ResultExpression from './ResultExpression';

const storedSizeErrosPane = local.get('size_errors_pane');

const mapUnCaped = map.convert({ 'cap': false });

const renderExpressions = compose(
  mapUnCaped((expression, line) => <ResultExpression key={line} expression={expression} line={line} />),
  mapValues(eval)
)

const getGutterStyle = (expressions) => {
  const lineNumberLength = reduce(
    keys(expressions),
    (len, line) => line.length > len ? line.length : len,
    0
  );

  return {
    width: lineNumberLength * 8 + 10
  }
};

const Viewer = ({errors, expressions, formatedResult}) => {
  const defaultHeight = storedSizeErrosPane || window.innerHeight * 0.25;
  const resultClassName = classnames('result', {
    'result--simple': !formatedResult,
    'result--has-errors': errors.length ,
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
          {renderExpressions(expressions)}
        </div>
      </div>
      <div className="errors">
        {errors.map(({ line, message }) => `line ${line}: ${message} \n`)}
      </div>
    </SplitPane>
  );
};

const mapStateToProps = ({ formatedResult, currentSnippet }) => {
  const { stable, errors = [] } = currentSnippet;

  return {
    expressions: parseExpressions(stable),
    errors,
    formatedResult
  };
};

export default connect(mapStateToProps)(Viewer);
