function addEscapeListener(message, selector) {
    document.addEventListener('keydown', function(e) {
        if (e.key === "Escape") {
            if (confirm(message)) {
                makePageContentFallDown(selector)
            }
        }
    });
}

function makePageContentFallDown(selector) {
    let elem = document.querySelector(selector)

    html2canvas(elem).then(canvas => {
        document.body.replaceWith(canvas)

        let ctx = canvas.getContext("2d")
        let myImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let data = myImageData.data
        let maxWhiteCellsCounter = 0

        var intr = setInterval(function() {
            let newData = []
            let whiteCellsCounter = 0

            for (let i = 0; i < data.length - 4; i += 4) {
                let red = data[i];
                let green = data[i + 1];
                let blue = data[i + 2];
                let alpha = data[i + 3];
    
                if (red !== 255 && green !== 255 && blue !== 255) {
                    whiteCellsCounter++
                }
    
                if (newData[i]) {
                    continue;
                }
                
                if (red !== 255 && green !== 255 && blue !== 255 && Math.random() < 0.25 + (maxWhiteCellsCounter / data.length)) {
                    newData[i] = 255;
                    newData[i + 1] = 255;
                    newData[i + 2] = 255;
                    newData[i + 3] = alpha;
                
                    if (canvas.width * 16 + i + 3 < data.length) {
                        newData[canvas.width * 16 + i] = red;
                        newData[canvas.width * 16 + i + 1] = green;
                        newData[canvas.width * 16 + i + 2] = blue;
                        newData[canvas.width * 16 + i + 3] = alpha;
                    }
                } else {
                    newData[i] = red;
                    newData[i + 1] = green;
                    newData[i + 2] = blue;
                    newData[i + 3] = alpha;
                }

                if (whiteCellsCounter > maxWhiteCellsCounter) {
                    maxWhiteCellsCounter = whiteCellsCounter
                }
            }
    
            myImageData.data.set(newData)
            ctx.putImageData(myImageData, 0, 0)

            if (whiteCellsCounter >= data.length) {
                clearInterval(intr)
            }
        }, (1 - (maxWhiteCellsCounter / data.length)) * 10)
    });
}
