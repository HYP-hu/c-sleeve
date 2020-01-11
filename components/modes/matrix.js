export class Matrix {
  m

  constructor(matrix) {
    this.m = matrix
  }

  get rowsNum() {
    return this.m.length
  }

  get colsNum() {
    return this.m[0].length
  }

  transpose() {
    const desArr = []
    for (let c = 0; c < this.colsNum; c++) {
      desArr[c] = []
      for (let r = 0; r < this.rowsNum; r++) {
        desArr[c][r] = this.m[r][c]
      }
    }
    return desArr
  }

  each(cb) {
    for (let c = 0; c < this.colsNum; c++) {
      for (let r = 0; r < this.rowsNum; r++) {
        const element = this.m[r][c]
        cb(element, r, c)
      }
    }
  }

}