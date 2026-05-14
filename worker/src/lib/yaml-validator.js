import yaml from 'js-yaml';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import schema from '../../../spec/v2.14/schema.json';

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);

export function validateYamlAgainstV214(yamlText) {
  let doc;
  try {
    doc = yaml.load(yamlText);
  } catch (e) {
    return { ok: false, errors: `YAML parse failed: ${e.message}` };
  }
  if (validate(doc)) return { ok: true, errors: '' };
  const errs = (validate.errors || [])
    .map(e => `${e.instancePath || '/'} ${e.message}`)
    .join('; ');
  return { ok: false, errors: errs };
}
