import transformCode from './transformCode';
import compose from 'lodash/fp/compose';

const getError = compose(
  transformedCode => {
    const { error, code } = transformedCode;
    if (error)
      return { message: error.toString(), line: error.loc.line };

    try {
      eval(code);
      return null;
    } catch (err) {
      return { message: err.toString() };
    }
  },
  transformCode
);

export default getError;

