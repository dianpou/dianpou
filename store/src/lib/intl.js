import config from 'config';
import {FormattedNumber} from 'react-intl';
var locale = config.intl.locales[0];

export function lang(key, options = {}) {
  return _.template(_.get(Lang[locale], key, key))(options);
}
export function price(price) {
  return price !== undefined ? <FormattedNumber value={price} style="currency" currency={_.get(User, 'settings.currency', 'USD')} /> : null;
}

export function date(v, format = 'YYYY/MM/DD HH:mm:ss'){
  return v ? moment.utc(v).utcOffset('+08:00').format(format) : null;
}
