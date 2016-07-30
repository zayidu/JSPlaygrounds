import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import SplitPane from 'react-split-pane';
import { local } from 'store2';

import parseExpressions from 'selectors/parse_expressions';

const storedSizeErrosPane = local.get('size_errors_pane');

class Viewer extends Component {
  evaluateExpressions(expressions) {
    const formattedExpressions = _.mapValues(expressions, expression => {
      const result = eval(expression);

      if (result && result.type) {
        return result;
      } else if (_.isFunction(result) && result.name) {
        return <i>Function {result.name}</i>;
      } else if (_.isBoolean(result)) {
        return result ? 'True' : 'False';
      } else if (_.isObject(result) || _.isArray(result)) {
        return JSON.stringify(result);
      }

      return result;
    });

    return _.map(formattedExpressions, (expression, line) => {
      if(expression){
        return(
          <div key={line} className="result__line">
            <div className="CodeMirror-linenumber CodeMirror-gutter-elt result___line-number">{line}</div>
            <div className="result___expression">{expression}</div>
          </div>
        );
      }
      return ;
    });
  }

  getGutterStyle() {
    const lineNumberLength = _.reduce(
      _.keys(this.props.expressions),
      (len, line) => line.length > len ? line.length : len,
      0
    );

    return {
      width: lineNumberLength * 8 + 10
    }
  }

  renderExpressions(code) {
    return this.evaluateExpressions(this.props.expressions);
  }

  render() {
    const defaultHeight = storedSizeErrosPane || window.innerHeight * 0.25;


    return (
      <SplitPane
        split="horizontal"
        defaultSize={defaultHeight}
        className="viewer"
        primary="second"
        onChange={local.set.bind(local, 'size_errors_pane')}
      >
        <div className="result">
          <div className="CodeMirror-gutters" style={this.getGutterStyle()}/>
          <div className="result__lines">
            {this.renderExpressions(this.props.code)}
          </div>
        </div>
        <div className="errors">
          {this.props.errors}
        </div>
      </SplitPane>
    );
  }
}

function mapStateToProps(state){
  let expressions, errors;

  try {
    expressions = parseExpressions(state);
  } catch (e) {
    errors = e.toString();
  }

  return { expressions, errors };
}

export default connect(mapStateToProps)(Viewer);
