document.addEventListener('DOMContentLoaded', ()=>{
    // Target is the 'document' referring to the HTML document
    // Can use a for loop to create a div element 200 times
    const grid = document.querySelector('.grid')
    for (let i=0;i<200;i++){
        const square = document.createElement('div')
        square.classList.add('square')
        square.setAttribute('id',i)
        grid.appendChild(square)
    }
    for (let i=0;i<10;i++){
        const takenSquare = document.createElement('div')
        // perhaps the tetrominoes aren't going to the square
        // because the class is 'taken' and not 'square' ? 
        // it's because the css of div elements with the taken class are always orange, unaffected
        // must remove the element's 'taken' class attribute if we want to override it
        takenSquare.classList.add('taken')
        takenSquare.setAttribute('id',200+i)
        grid.appendChild(takenSquare)
    }
    const minigrid = document.querySelector('.mini-grid')
    for (let i=0;i<16;i++){
        const miniGridSquare = document.createElement('div')
        minigrid.appendChild(miniGridSquare)
    }


    const width = 10 
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    let nextRandom = 0 
    let timerId = null  ; // can do let timerID and not assign it to a value either -> same value -> null
    let score = 0 
    const colors = [
        'black',
        'red',
        'purple',
        'green',
        'blue'
    ]

    const lTetromino = [
        [1, width+1, width*2+1, 2 ],
        [width, width+1, width+2, width*2+2],
        [1,width+1, width*2, width*2+1],
        [width,width*2,width*2+1,width*2+2]
    ]

    const zTetromino = [
        [width+1,width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1,width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1]
    ]

    const tTetromino = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
    ]

    const oTetromino = [
        [0,1,width,width+1],    
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]  
        // 1 unique rotation
    ]


    const iTetromino = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
        // 2 unique rotations
    ]

    // looking at the video, it's drawing B1, B2, B3,C1 -> 1st array of LTetromino shows one rotation
    // from 36:11 timestamp of the video
    // draw the other 3 rotations
    // these are all in respect to a 3x3 mini grid ^^
    // go from first row down to the bottom row -> up to down ; left to right

    const theTetrominoes=[lTetromino,zTetromino,tTetromino,oTetromino,iTetromino]

    // lets define where we want to draw the tetrominoes on the squares grid
    // first square of our chosen tetromino array is index 4
    let currentPosition = 4
    let currentRotation = 0 

    // 4 is the neutral singular starting point
    // before we apply the rotation of the index to apply it 
    // so it will translate to 4 squares in different places
    // depending on which rotation and which tetromino

    //  randomly select a Tetromino and its first rotation
    let random = Math.floor(Math.random()*theTetrominoes.length)
    // console.log(random)

    let current = theTetrominoes[random][currentRotation]
    // atm currentRotation is set to 0 meaning the first rotation of any random tetromino

    // console.log(theTetrominoes)  // the tetromino shapes
    // console.log(theTetrominoes[0][0]) // lTetrominoes' first rotation
    // now my current shape

    // draw the tetromino
    function draw(){
        // forEach item in the array (specific rotation array)
        // we want to add a class of tetromino
        current.forEach(index => {
            // squares[currentPosition] reveals a current square
            // squares[currentPosition+index] reveals where you're moving the square to (it's one square in a tetromino)
            // console.log(squares[currentPosition+index])
            // squares[currentPosition + index].classList.remove('taken')
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition +index].style.backgroundColor = colors[random] 
            squares[currentPosition + index].style.outline = "1px solid white ; "
        })
    }

    function undraw(){
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition +index].style.backgroundColor = ""

        })
    }

    // make the tetromino move down every second
    // timerId = setInterval(moveDown, 300) // make 300 for testing purposes ; originally 1000

    // assign functions to keyCodes
    function control(e){
        // e stands for event
        if (e.keyCode === 37 ){ // keycode 37 means arrowLeft
            moveLeft()
        }
        else if (e.keyCode === 38){ // keycode 38 means arrowUp
            rotate()
        }
        else if(e.keyCode === 39){ // keycode 39 means arrowRight
            moveRight()
        }
        else if(e.keyCode === 40){ // keycode 40 means arrowDown
            moveDown()
        }
    }

    document.addEventListener('keyup',control)


    // move down function
    function moveDown(){
        undraw()
        // we're moving everything down by 1
        currentPosition += width
        draw()
        freeze()
    }

    // freeze function
    function freeze(){
        // if any of the squares of the tetromino when adding the index which is the rotation, AND also going down 
        // one square, if any square of the tetromino is in the range of the taken squares
        // it means the tetromino cannot go further down, should stop there
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
            // we turn each of the squares in the tetromino into the class of taken
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            // then select a new tetromino to be our current tetromino

            // reset and release a randomised tetromino with a currently fixed rotation, since current Rotation is set to 0
            // before we choose a random tetromino for our main grid, we're adding one more step

            random = nextRandom 
            nextRandom = Math.floor(Math.random()*theTetrominoes.length)
            current = theTetrominoes[random][currentRotation]
            currentPosition = 4 // have to change the current position back to 4
            // This is because we may be moving the current position in the future with our arrow keys
            // when playing the game
            draw()
            displayShape()
            addScore()
            gameOver()
        }

    }

    // move the tetromino left, unless it's at the edge or there's a blockage
    function moveLeft(){
        undraw()
        // if any (one or more) squares of the tetromino is at the left edge
        // squares[currentPosition + index] returns the div at that certain index of a current tetromino
        // (currentPosition + index) returns the specific index number
        const isAtLeftEdge = current.some(index => (currentPosition + index)%width ===0)
        if (!isAtLeftEdge){
            // only allow the tetromino to move left by one, if none of the squares are at the left most edge
            // we also want the tetromino to stop if there is already a tetromino there
            currentPosition-=1 
            // current.forEach(index => squares[currentPosition+index].classList.add('tetromino'))
        }
        if (current.some(index => squares[currentPosition+index].classList.contains("taken"))){
            currentPosition+=1 // to move the tetromino back to its original space

        }
        draw()
    }

    function moveRight(){
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width=== width-1)
        if (!isAtRightEdge){
            currentPosition+=1 
            // move currentPosition 1 index further if none of the tetromino squares are at the right edge
        }
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition-=1 // move the tetromino back to its original position
            // this is if you moved it further to the right since it's not at the right most edge,
            // but would then take up space of another previous tetromino
        }
        draw()
    }


    draw()
    // setInterval(undraw, 1000)

    //rotate the tetromino
    function rotate(){
        undraw()
        currentRotation ++ 
        // must check when rotating if all of the tetromino squares are not going past the left edge nor the right edge, nor within a taken square
        if (currentRotation === current.length) { // if the current rotation gets to 4, make it go back to 0
            currentRotation = 0 ;
            // go back to the first rotation
        }
        // another alternative is currentRotation = (currentRotation + 1) % current.length
        current = theTetrominoes[random][currentRotation]
        draw()
    }

    // show up-next tetromino in mini-grid
    const displaySquares = document.querySelectorAll('.mini-grid div')
    // select all the div elements inside the mini grid
    const displayWidth = 4 
    const displayIndex = 0 
    

    // the Tetrominoes without rotations
    const upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1, 2 ], // LTetromino
        [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
        [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
        [0, 1, displayWidth, displayWidth+1], // oTetromino
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] // iTetromino
    ]

    // display the shape in the mini grid display
    function displayShape(){
        // remove any trace of a tetromino from the entire grid
        displaySquares.forEach(square => {
            square.classList.remove('tetromino') // for the whole mini grid - essentially undrawing 
            square.style.backgroundColor=''

        })
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }

    // add functionality to the button
    startBtn.addEventListener('click',()=>{
        if (timerId){
            // if the timerId is not null 
            clearInterval(timerId)
            timerId = null
        }
        else {
            draw()
            timerId = setInterval(moveDown, 300)
            nextRandom = Math.floor(Math.random()*theTetrominoes.length)
            displayShape()
        }
    })

    // Function when a user manages to fill a whole row with tetromino squares
    // 1. Need to remove the row from our grid
    // 2. Increase the score to our score talley
    // 3. Display the score on our browser
    // 4. Add a new fresh row to our grid , so it doesn't appear to shrink in size
    // (3 functions to focus on -> splice, concat, and appendChild)

    function addScore(){
        // <200 , because 210-219 is the "invisible" divs with the "taken class" , provided so that the tetrominoes will stop at the very bottom 
        console.log(squares)
        for (let i=0; i<200; i++){ 
            if (i%10===0){
                const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9] // specific row
                // console.log(grid2[i])
                console.log(squares[i])
                if (row.every(index => squares[index].classList.contains('taken'))){
                    score+=10
                    scoreDisplay.innerHTML= score
                    row.forEach(index => {
                        squares[index].classList.remove('taken')
                        squares[index].classList.remove('tetromino')
                        squares[index].style.backgroundColor=''
                    })
                                        // 
                    const squaresRemoved = squares.splice(i,width)
                    // not using the splice method
                    // append these new squares to our grid
                    // now reversed the order, so the squaresRemoved becomes the first 10 squares, concatenating the previous squares
                    squares = squaresRemoved.concat(squares)
                    squares.forEach(cell => grid.appendChild(cell))
                    

                }
            }
        }        
    }

    function gameOver(){
        // tetris finishes when you stack up all your tetrominoes in the top part of the grid (first 10 div elements)
        // so that they don't fit in the grid anymore
        // use the .some() and .innerHTML 
        // makes our writing of gameOver definition really simple
        // if there is a div with the 'taken' class in the original default position, or index for, we call it a game over

        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            scoreDisplay.innerHTML = 'end'
            clearInterval(timerId)
        }
    }


})