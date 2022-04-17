INF_POINT = null;
class EllipticCurve {
  constructor(a, b, p) {
    this.a = a;
    this.b = b;
    this.p = p;
    this.points = [];
    this.definePoints();
  }

  definePoints() {
    this.points.push(INF_POINT);
    for (let x = 1; x < this.p; x++) {
      for (let y = 1; y < this.p; y++) {
        if (this.equalModP(y ** 2, x ** 3 + this.a * x + this.b)) {
          this.points.push([x, y]);
        }
      }
    }
  }

  add(p, q) {
    if (p == null) {
      return q;
    }
    if (q == null) {
      return p;
    }

    const x1 = p[0];
		    const y1 = p[1];
		    const x2 = q[0];
		    const y2 = q[1];
    let lambda;
    if (this.equalModP(x1, x2) && this.equalModP(y1, -y2)) {
      return INF_POINT;
    }
    if (this.equalModP(x1, x2) && this.equalModP(y1, y2)) {
      lambda = this.reduceModP((3 * x1 * x1 + this.a) * this.inverseModP(2 * y1));
    } else {
      lambda = this.reduceModP((y1 - y2) * this.inverseModP(x1 - x2));
    }
    const x3 = this.reduceModP(lambda ** 2 - x1 - x2);
    const y3 = this.reduceModP(lambda * (x1 - x3) - y1);
    return [x3, y3];
  }

  doubleAndAddAlgorithm(n, P) {
    let Q = INF_POINT;
    while (n != 0) {
      if (n & 1 !== 0) {
        Q = this.add(Q, P);
      }
      P = this.add(P, P);
      n >>= 1;
    }
    return Q;
  }

  reduceModP(n) {
    while (n < 0) {
      n += this.p;
    }
    return n % this.p;
  }

  equalModP(x, y) {
    return this.reduceModP(x - y) == 0;
  }

  inverseModP(x) {
    for (let y = 1; y < this.p; y++) {
      if (this.equalModP(x * y, 1)) {
        return y;
      }
    }
    return null;
  }
}
ec = new EllipticCurve(0, 1, 7);
console.log(ec.points);
console.log(ec.doubleAndAddAlgorithm(5, [2, 4]));
