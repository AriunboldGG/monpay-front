export class System {
  static ISDN = new System('ISDN');
  static ACCOUNTNO = new System('ACCOUNTNO');

  constructor(name) {
    this.name = name;
  }
}
