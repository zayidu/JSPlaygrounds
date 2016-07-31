import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import SplitPane from 'react-split-pane';
import { local } from 'store2';
import classnames from 'classnames';

import parseExpressions from 'selectors/parse_expressions';

const storedSizeErrosPane = local.get('size_errors_pane');

const coma = (arr, i) => i < arr.length -1 ? ', ' :'';

const formatResult = (result) => {

  // perhaps an option later
  // if (result === undefined)
  //   return <span className="cm-atom">undefined</span>;

  if (result === null)
    return <span className="cm-atom">null</span>;

  if (_.isBoolean(result))
    return <span className="cm-atom">{result ? 'true' : 'false'}</span>;

  if (_.isNumber(result))
    return <span className="cm-number">{result}</span>

  if (_.isString(result))
    return <span className="cm-string">"{result}"</span>

  if (_.isFunction(result))
    return <em><span className="cm-keyword">function</span> <span className="cm-def">{result.name || 'anonymous'}</span></em>;

  if (_.isArray(result))
    return <span>[{result.map((v, i, arr) => <span key={i}>{formatResult(v)}{coma(arr, i)}</span>)}]</span>;

  if (_.isObject(result))
    return <span>{'{'}{_.map(result, (v, k) => ({k, v})).map(({k, v}, i, arr) =>(
      <span key={k}><span className="cm-property">{k}</span>: {formatResult(v)}{coma(arr, i)}</span>
    ))} {'}'}</span>;

  return result;
};

const simpleResult = (result) => {
  if (_.isFunction(result) && result.name)
    return <i>Function {result.name}</i>;

  if (result === null)
    return 'Null';

  if (_.isBoolean(result))
    return result ? 'True' : 'False';

  if (_.isObject(result) || _.isArray(result))
    return JSON.stringify(result);

  return result;
}

class Viewer extends Component {
  evaluateExpressions(expressions) {
    const { formatedResult } = this.props;
    const formattedExpressions = _.mapValues(expressions, expression => {
      const result = eval(expression);

      if (result && result.type) {
        return result;
      }

      return formatedResult ? formatResult(result) : simpleResult(result);
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
    const { formatedResult } = this.props;
    const resultClassName = classnames('result', {'result--simple': !formatedResult});
    return (
      <SplitPane
        split="horizontal"
        defaultSize={defaultHeight}
        className="viewer"
        primary="second"
        onChange={local.set.bind(local, 'size_errors_pane')}
      >
        <div className={resultClassName}>
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
  const { formatedResult } = state;
  let expressions, errors;

  try {
    expressions = parseExpressions(state);
  } catch (e) {
    errors = e.toString();
  }

  return {
    expressions,
    errors,
    formatedResult
  };
}

export default connect(mapStateToProps)(Viewer);
