const TextToken = 0;
const ExpressionToken = 1;

class Token {
  constructor(value, type) {
    this._value = value;
    this._type = type;
  }

  get value() {
    return this._value;
  }

  get type() {
    return this._type;
  }

  get isExpression() {
    return this._type === ExpressionToken;
  }

  get isText() {
    return this._type === TextToken;
  }
}
