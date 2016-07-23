import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import SplitPane from 'react-split-pane';
import { local } from 'store2';

import parseExpressions from 'selectors/parse_expressions';

const storedSizeErrosPane = local.get('size_errors_pane');

const coma = (arr, i) => i < arr.length -1 ? ', ' :'';

const formatResult = (value) => {

  // perhaps an option later
  // if (value === undefined)
  //   return <span className="cm-atom">undefined</span>;

  if (value === null)
    return <span className="cm-atom">null</span>;

  if (_.isBoolean(value))
    return <span className="cm-atom">{value ? 'true' : 'false'}</span>;

  if (_.isNumber(value))
    return <span className="cm-number">{value}</span>

  if (_.isString(value))
    return <span className="cm-string">"{value}"</span>

  if (_.isFunction(value))
    return <em><span className="cm-keyword">function</span> <span className="cm-def">{value.name || 'anonymous'}</span></em>;

  if (_.isArray(value))
    return <span>[{value.map((v, i, arr) => <span key={i}>{formatResult(v)}{coma(arr, i)}</span>)}]</span>;

  if (_.isObject(value))
    return <span>{'{'}{_.map(value, (v, k) => ({k, v})).map(({k, v}, i, arr) =>(
      <span key={k}><span className="cm-property">{k}</span>: {formatResult(v)}{coma(arr, i)}</span>
    ))} {'}'}</span>;

  return value;
}

class Viewer extends Component {
  evaluateExpressions(expressions) {
    const formattedExpressions = _.mapValues(expressions, expression => {
      const result = eval(expression);

      if (result && result.type) {
        return result;
      }

      return formatResult(result);
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
