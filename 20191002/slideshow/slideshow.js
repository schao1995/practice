export class Bunner {
  constructor (el, times) {
    this.el = el
    this.times = times
    this.mytime = null
  }
  init () {
    for (let i = 0; i < this.el.length; i++) {
      this.el[i].style.left = i * this.el[0].clientWidth + 'px'
    }
    this.el[this.el.length - 1].style.left = -this.el[0].clientWidth + 'px'
  }
  run (direction) {
    console.log('run')
    console.log(this.el[this.el.length - 1].style.left)
    this.mytime = setInterval(() => {
      for (let i = 0; i < this.el.length; i++) {
        this.el[i].style.left = parseFloat(this.el[i].style.left) + this.el[0].clientWidth * 4 * direction / 100 + 'px'
      }
      for (let i = 0; i < this.el.length; i++) {
        let a1 = Math.round(parseFloat(this.el[i].style.left) % this.el[0].clientWidth)
        let a2 = Math.round(parseFloat(this.el[i].style.left) % this.el[0].clientWidth + Math.abs(this.el[0].clientWidth * 4 * direction / 100))
        for (let o = a1; o < a2; o++) {
          if (o === 0) {
            if (i === this.el.length - 1) {
              this.el[0].style.left = this.el[0].clientWidth + 'px'
            } else if (i === 0) {
              this.el[this.el.length - 1].style.left = this.el[0].clientWidth + 'px'
            }
          }
        }
      }
      // console.log(this.el[0].style.left)
      let num1 = Math.round(parseFloat(this.el[0].style.left) % this.el[0].clientWidth)
      let num2 = Math.round(parseFloat(this.el[0].style.left) % this.el[0].clientWidth + Math.abs(this.el[0].clientWidth * 4 * direction / 100))
      for (let i = num1; i < num2; i++) {
        if (i % this.el[0].clientWidth === 0) {
          // alert('clear')
          this.stop()
          setTimeout(() => { this.run(-1) }, 3000)
        }
      }
    }, this.times)
  }
  stop () {
    console.log('stop')
    clearInterval(this.mytime)
  }
  drag (num) {
    for (let i = 0; i < this.el.length; i++) {
      this.el[i].style.left = parseFloat(this.el[i].style.left) + num + 'px'
    }
  }
}
