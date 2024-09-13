/**
 * Argv
 * ----
 * A Simple Argv Wrapper
 */
class Argv {
  niddle = 0;

  /**
   * Wrap Argv & Consume First Two Elements
   */
  constructor() {
    this.args = process.argv;
    this.consume(2);
  }

  /**
   * Consume it!!
   * @param {Number} num Number of Elements
   */
  consume(num = 1) {
    this.args.splice(0, num);
  }

  /**
   * Check if Next is Same As Passed Param
   * @param {String} value Suggestion
   */
  next(value) {
    return this.args[this.niddle + 1] == value;
  }

  /**
   * Get Next Value Without Consuming it
   */
  getNext() {
    return this.args[this.niddle + 1];
  }

  /**
   * Increment a Niddle
   */
  up() {
    this.niddle += 1;
  }

  /**
   * Next Exists??
   */
  hasNext() {
    return !!this.args[this.niddle + 1];
  }

  /**
   * Current Exists??
   */
  hasCurrent() {
    return !!this.args[this.niddle];
  }

  /**
   * Get Current Element
   */
  getCurrent() {
    return this.args[this.niddle];
  }

  /**
   * Value is Current ?
   * Consume it!! and Say
   * @param {String} value Suggestion
   *
   */
  current(value) {
    if (this.args[this.niddle] == value) {
      this.consume();
      return true;
    }
    return false;
  }
}

module.exports = Argv;
