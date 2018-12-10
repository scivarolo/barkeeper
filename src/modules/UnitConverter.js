class Units {
  constructor() {
    this.units = [
      {
        "label": "oz",
        "base": 30
      },
      {
        "label": "dash",
        "base": 1
      },
      {
        "label": "barspoon",
        "base": 5
      },
      {
        "label": "tsp",
        "base": 5
      },
      {
        "label": "tbsp",
        "base": 15
      },
      {
        "label": "ml",
        "base": 1
      }
    ]
  }

  convert(startValue, startUnit, toUnit) {
    let base = this.units.find(unit => unit.label === startUnit).base
    let toUnitBase = this.units.find(unit => unit.label === toUnit).base

    return startValue * base / toUnitBase
  }
  compare(aVal, aUnit, bVal, bUnit) {
    let a = this.convert(aVal, aUnit, "ml")
    let b = this.convert(bVal, bUnit, "ml")

    if (a > b) {
      return 1
    } else if (a === b) {
      return 0
    } else if (a < b) {
      return -1
    }

  }

}

export default new Units()