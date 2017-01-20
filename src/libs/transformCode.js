import { transform } from 'babel-standalone';

const transformCode = code => {
  try {
    return transform(code, {
      presets: ['react'],
      retainLines: true
    });
  } catch (error) {
    return { error };
  }
};

export default transformCode;
