class CanvasHelper {
  constructor() {
    this.canvas = document.getElementById('canvas');
    const { top, left } = this.canvas.getBoundingClientRect();
    this.offsetTop = top;
    this.offsetLeft = left;

    this.ctx = this.canvas.getContext('2d');
    this.ctx.lineWidth = 2;
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = 'black';

    this.initStoke = this.initStoke.bind(this);
    this.paint = this.paint.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.endStroke = this.endStroke.bind(this);
    this.clearCanvas = this.clearCanvas.bind(this);
    this.getDataURL = this.getDataURL.bind(this);
    
    this.canvas.addEventListener('mousedown', this.initStoke);
    this.canvas.addEventListener('touchstart', this.handleTouchStart);
    document.addEventListener('mouseup', this.endStroke);
    document.addEventListener('touchend', this.endStroke);
  }

  handleTouchStart(event) {
    event.preventDefault();
    this.initStoke(event.touches[0]);
  }

  handleTouchMove(event) {
    event.preventDefault();
    this.paint(event.touches[0]);
  }

  initStoke(event) {
    const { x, y } = this.calculateXY(event);
    this.ctx.moveTo(x, y);
    this.ctx.beginPath();
    this.paint(event);
    this.canvas.addEventListener('mousemove', this.paint);
    this.canvas.addEventListener('touchmove', this.handleTouchMove);
  }
 
  paint(event) {
    const { x, y } = this.calculateXY(event);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
  }

  endStroke() {
    this.ctx.closePath();
    this.canvas.removeEventListener('mousemove', this.paint);
    this.canvas.removeEventListener('touchmove', this.paint);
  }

  calculateXY(event) {
    return {
      x: event.clientX - this.offsetLeft,
      y: event.clientY - this.offsetTop,
    };
  }

  clearCanvas() {
    const { width, height } = this.canvas.getBoundingClientRect();
    this.ctx.clearRect(0, 0, width, height);
  }

  getDataURL() {
    const dataURL = this.canvas.toDataURL();
    $.ajax({
      url: 'esign/generate_pdf',
      type: 'POST',
      data: {
        dataURL,
        turbolinks: false,
      },
    });
  }
}

function processCanvas() {
  const c = new CanvasHelper();

  const clearButton = document.getElementById('clear-canvas-button');
  const exportButton = document.getElementById('export-canvas-button');
  clearButton.addEventListener('click', c.clearCanvas);
  exportButton.addEventListener('click', c.getDataURL);
}