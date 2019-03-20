/**
 * A helper class to make working with version numbers easier
 */
class SemVer {
  /**
   * Creates a new instance of the SemVer class
   *
   * @param {string} versionString  - A string representing a version number (as in `major[.minor[.patch]]`)
   */
  constructor(versionString) {
    let versionParts = versionString.split('.');
    if (
      versionParts.length < 1 ||
      versionParts.length > 3 ||
      !versionParts.every(p => !isNaN(parseInt(p)))
    ) {
      throw new Error(`SemVer: invalid versionString "${versionString}"`);
    }

    this._major = parseInt(versionParts[0]);
    this._minor = versionParts.length > 1 ? parseInt(versionParts[1]) : 0;
    this._patch = versionParts.length > 2 ? parseInt(versionParts[2]) : 0;
  }

  /**
   * Gets the "major" component of a version string
   *
   * @returns {number}  - The "major" component
   */
  get major() {
    return this._major;
  }

  /**
   * Gets the "minor" component of a version string
   *
   * @returns {number}  - The "minor" component
   */
  get minor() {
    return this._minor;
  }

  /**
   * Gets the "patch" component of a version string
   *
   * @returns {number}  - The "v" component
   */
  get patch() {
    return this._patch;
  }

  /**
   * Checks to see if the provided parameter is actually a {SemVer}
   *
   * @param {SemVer} semver - The parameter to check
   * @returns {SemVer}      - The {SemVer} parameter, assuming it is actually a {SemVer}
   * @throws {Error}
   * @private
   */
  _checkSemVerParam(semver) {
    if (typeof semver === 'string') {
      semver = new SemVer(semver);
    }

    if (!(semver instanceof SemVer)) {
      throw new Error('SemVer: can only compare two SemVers');
    }

    return semver;
  }

  /**
   * Checks {SemVer} equality
   *
   * @param {SemVer|string} semver  - The {SemVer} you want to check against, or a string that can be parsed into a {SemVer}
   * @returns {boolean}             - `true` if this and the {SemVer} parameter are equal, otherwise `false`
   */
  eq(semver) {
    semver = this._checkSemVerParam(semver);

    return (
      this.major === semver.major &&
      this.minor === semver.minor &&
      this.patch === semver.patch
    );
  }

  /**
   * Checks to see if this {SemVer} is greater than the provided {SemVer}
   *
   * @param {SemVer|string} semver  - The {SemVer} you want to check against, or a string that can be parsed into a {SemVer}
   * @returns {boolean}             - `true` if this {SemVer} is greater than the parameter {SemVer}, otherwise `false`
   */
  gt(semver) {
    semver = this._checkSemVerParam(semver);

    return (
      this.major > semver.major ||
      (this.major === semver.major && this.minor > semver.minor) ||
      (this.major === semver.major &&
        this.minor === semver.minor &&
        this.patch > semver.patch)
    );
  }

  /**
   * Checks to see if this {SemVer} is less than the provided {SemVer}
   *
   * @param {SemVer|string} semver  - The {SemVer} you want to check against, or a string that can be parsed into a {SemVer}
   * @returns {boolean}             - `true` if this {SemVer} is less than the parameter {SemVer}, otherwise `false`
   */
  lt(semver) {
    semver = this._checkSemVerParam(semver);

    return (
      this.major < semver.major ||
      (this.major === semver.major && this.minor < semver.minor) ||
      (this.major === semver.major &&
        this.minor === semver.minor &&
        this.patch < semver.patch)
    );
  }

  /**
   * Checks {SemVer} inequality
   *
   * @param {SemVer|string} semver  - The {SemVer} you want to check against, or a string that can be parsed into a {SemVer}
   * @returns {boolean}             - `true` if this and the {SemVer} parameter are *not* equal, otherwise `false`
   */
  neq(semver) {
    return !this.eq(semver);
  }

  /**
   * Checks to see if this {SemVer} is greater than or equal to the provided {SemVer}
   *
   * @param {SemVer|string} semver  - The {SemVer} you want to check against, or a string that can be parsed into a {SemVer}
   * @returns {boolean}             - `true` if this {SemVer} is greater than or equal to the parameter {SemVer}, otherwise `false`
   */
  gte(semver) {
    return this.eq(semver) || this.gt(semver);
  }

  /**
   * Checks to see if this {SemVer} is less than or equal to the provided {SemVer}
   *
   * @param {SemVer|string} semver  - The {SemVer} you want to check against, or a string that can be parsed into a {SemVer}
   * @returns {boolean}             - `true` if this {SemVer} is less than or equal to the parameter {SemVer}, otherwise `false`
   */
  lte(semver) {
    return this.eq(semver) || this.lt(semver);
  }

  /**
   * Gets a normalized string representation of the {SemVer}
   *
   * @returns {string}  - {SemVer} as `major.minor.patch`
   */
  toString() {
    return `${this.major}.${this.minor}.${this.patch}`;
  }

  /**
   * Checks to see if this {SemVer} has the same major version as the provided parameter
   *
   * @param {number} major  - The major version you want to check against
   * @returns {boolean}     - `true` if this {SemVer} has that major version, otherwise `false`
   */
  matchesMajor(major) {
    return major === this.major;
  }
}

export default SemVer;
