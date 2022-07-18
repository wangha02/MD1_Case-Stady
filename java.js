// Vẽ Canvas
const canvas = document.getElementById("myCanvas")
const c = canvas.getContext('2d')
const scoreEl = document.querySelector("#scoreEl") //Const TÍNH ĐIỂM
//Khung
canvas.width = innerWidth
canvas.height = innerHeight
let audio = new Audio("img/sound.mp3");
let audio1 = new Audio("img/tututu.mp3");
// khung xanh
class Boundary {
    static width = 40    //chiều rộng tĩnh của khung
    static height = 40    // chiều cao tĩnh của khung
    constructor({position, image }) {
        this.position = position;
        this.width = 40;
        this.height = 40;
        this.image = image
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

// SIZE - ICON PACMAN
class Player {
    static speed = 2

    constructor({position, velocity}) {
        this.position = position; // nhiệm vụ của ...
        this.velocity = velocity; // vận tốc
        this.radius = 15 //size
        this.radians = 0.85 // tỉ lệ mở mồm
        this.openRate = 0.06 // tốc độ mở mồm
        this.rotation = 0 //defailt = 180 độ giờ đưa về vòng xoay = 0,
    }

// MÀU PACMAN
    draw() {
        c.save()
        c.translate(this.position.x, this.position.y) //mồm của pacman truyền đến trục x và y (theo hướng mồm) [hàm gọi lại]
        // quay,xoay, mồm của pacman theo tâm,theo hướng đi // đặt chỉ phương hướng là 0
        //sau đó xoay pacman
        // muốn nó đổi mặt với hướng ngược lại, thay đổi vtri ở đây
        c.rotate(this.rotation)
        c.translate(-this.position.x, -this.position.y) //[hàm gọi lại để trở lại vị trí há mồm theo hướng pacman đi]
        c.beginPath() // bắt đầu đường dẫn
        c.arc(this.position.x, this.position.y, this.radius, this.radians, Math.PI * 2 - this.radians)   // bắt đầu từ 0.85 thay vì từ 0
        c.lineTo(this.position.x, this.position.y) //Miệng PACMAN, gán lại trục x,y
        c.fillStyle = "yellow"
        c.fill() // lấp đầy khoảng trống (pacman)
        c.closePath() // đóng đường dẫn
        c.restore() // khôi phục
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        // khoảng cách chạy mở mồm liên tục từ 0 -> 0.75
        if (this.radians < 0 || this.radians > 0.85) this.openRate
            = -this.openRate
        this.radians += this.openRate
    }
}

//// SIZE - ICON MA (GHOST) ghost
class Ghost {
    static speed = 2  //toc do cua MA
    constructor({image, position, velocity, color = "red"}) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 15
        this.prevCollisions = []
        this.speed = 2 //toc do cua MA
        this.image = image
        this.width = 35
        this.height = 35
    }
// MÀU GHOST
    draw() {
        c.beginPath()
        // c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        // c.fillStyle = this.color
        // c.fill()
        c.drawImage(this.image, this.position.x - this.width / 2, this.position.y - this.height / 2, this.width, this.height)
        c.closePath()
    }
    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}



//HẠT ĂN
class Pellet {
    constructor({position}) {
        this.position = position;
        this.radius = 3
    }

// MÀU HẠT ĂN
    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = "white"
        c.fill()
        c.closePath()
    }
}

const img = new Image()
img.src = "img/maXanh.png"

const img1 = new Image(1)
img1.src = "img/maDo.png"

const img2 = new Image(1)
img2.src = "img/maHong.png"

const img3 = new Image(1)
img3.src = "img/maCam.png"

const pellets = [] //HẠT ĂN
const boundaries = [] //



const ghosts = [   //tạo ra ma mới :)))
    new Ghost({
        position: {
            x: Boundary.width * 10 + Boundary.width / 2,
            y: Boundary.height * 9 + Boundary.height / 2
        },
        velocity: {
            x: Ghost.speed,
            y: 0
        },
        image: img
    }),

    new Ghost({
        position: {
            x: Boundary.width * 10 + Boundary.width / 2,
            y: Boundary.height * 9 + Boundary.height / 2
        },
        velocity: {
            x: Ghost.speed,
            y: 0
        },
        image: img1
    }),
    new Ghost({
        position: {
            x: Boundary.width * 10 + Boundary.width / 2,
            y: Boundary.height * 9 + Boundary.height / 2
        },
        velocity: {
            x: Ghost.speed,
            y: 0
        },
        image: img2
    }),
    new Ghost({
        position: {
            x: Boundary.width * 10 + Boundary.width / 2,
            y: Boundary.height * 9 + Boundary.height / 2
        },
        velocity: {
            x: Ghost.speed,
            y: 0
        },
        image: img3
    }),
]

//VỊ TRỊ CỐ ĐỊNH TRÊN TRỤC TỌA ĐỘ X,Y
const player = new Player({ //PACMAN
    position: {
        x: Boundary.width + Boundary.width / 2,
        y: Boundary.height + Boundary.height / 2
    },
    velocity: {
        x: 0,
        y: 0
    }
})
//KEY DI CHUYỂN
const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}


let score = 0
let lastKey = ""

const map = [
    ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '.', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2',],
    ['|', '$', '$', '$', '$', '$', '$', '$', '$', '$', 'c', '$', '$', '$', '$', '$', '$', '$', '$', '$', '|',],
    ['|', '$', 'a', 'b', '$', 'd', '$', 'a', 'b', '$', '$', '$', 'a', 'b', '$', 'd', '$', 'a', 'b', '$', '|',],
    ['|', '$', '$', '$', '$', '|', '$', '$', '$', '$', 'd', '$', '$', '$', '$', '|', '$', '$', '$', '$', '|',],
    ['|', '$', 'a', '-', '-', ',', '-', '-', 'b', '$', '|', '$', 'a', '-', '-', ',', '-', '-', 'b', '$', '|',],
    ['|', '$', '$', '$', '$', '$', '$', '$', '$', '$', '|', '$', '$', '$', '$', '$', '$', '$', '$', '$', '|',],
    ['|', '-', '-', 'b', '$', 'a', '-', '-', 'b', '$', 'c', '$', 'a', '-', '-', 'b', '$', 'a', '-', '-', '|',],
    ['|', '$', '$', '$', '$', '$', '$', '$', '$', '$', '$', '$', '$', '$', '$', '$', '$', '$', '$', '$', '|',],
    ['|', '$', '1', '-', 'b', '$', 'a', 'b', '$', 'a', '-', 'b', '$', 'a', 'b', '$', 'a', '-', '2', '$', '|',],
    ['|', '$', '|', '$', '$', '$', '$', '$', '$', '$', '$', '$', '$', '$', '$', '$', ' ', '$', '|', '$', '|',],
    ['|', '$', 'c', '$', 'a', '-', '-', 'b', '$', 'a', '-', 'b', '$', 'a', '-', '-', 'b', '$', 'c', '$', '|',],
    ['|', '$', '$', '$', '$', '$', '$', '$', '$', '$', '$', '$', '$', '$', '$', '$', '$', '$', '$', '$', '|',],
    ['|', '-', '-', 'b', '$', 'a', '-', '-', 'b', '$', 'd', '$', 'a', '-', '-', 'b', '$', 'a', '-', '-', '|',],
    ['|', '$', '$', '$', '$', '$', '$', '$', '$', '$', '|', '$', '$', '$', '$', '$', '$', '$', '$', '$', '|',],
    ['|', '$', 'a', '-', '-', '.', '-', '-', 'b', '$', '|', '$', 'a', '-', '-', '.', '-', '-', 'b', '$', '|',],
    ['|', '$', '$', '$', '$', '|', '$', '$', '$', '$', 'c', '$', '$', '$', '$', '|', '$', '$', '$', '$', '|',],
    ['|', '$', 'a', 'b', '$', 'c', '$', 'a', 'b', '$', '$', '$', 'a', 'b', '$', 'c', '$', 'a', 'b', '$', '|',],
    ['|', '$', '$', '$', '$', '$', '$', '$', '$', '$', 'd', '$', '$', '$', '$', '$', '$', '$', '$', '$', '|',],
    ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', ',', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3',]
]

//GỌI HÀM GHÉP ẢNH
function createImage(src) {
    const image = new Image()
    image.src = src
    return image
}

//------ve map ------------
function mapTo() {
    map.forEach((row, i) => {
        row.forEach((symbol, j) => {
            switch (symbol) {
                case '-':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: Boundary.width * j,
                                y: Boundary.height * i
                            },
                            image: createImage('img/pipeHorizontal.png')
                        })
                    )
                    break
                //---------------//
                case '|':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: Boundary.width * j,
                                y: Boundary.height * i
                            },
                            image: createImage('img/pipeVertical.png')
                        })
                    )
                    break
                //---------------//
                case '1':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: Boundary.width * j,
                                y: Boundary.height * i
                            },
                            image: createImage('img/G1.png')
                        })
                    )
                    break
                //-------------//
                case '2':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: Boundary.width * j,
                                y: Boundary.height * i
                            },
                            image: createImage('img/G2.png')
                        })
                    )
                    break
                //------------------//
                case '3':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: Boundary.width * j,
                                y: Boundary.height * i
                            },
                            image: createImage('img/G3.png')
                        })
                    )
                    break
                //------------------//
                case '4':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: Boundary.width * j,
                                y: Boundary.height * i
                            },
                            image: createImage('img/G4.png')
                        })
                    )
                    break
                //------------------//
                case 'a':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: Boundary.width * j,
                                y: Boundary.height * i
                            },
                            image: createImage('img/capTrai.png')
                        })
                    )
                    break
                //------------------//
                case 'b':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: Boundary.width * j,
                                y: Boundary.height * i
                            },
                            image: createImage('img/capPhai.png')
                        })
                    )
                    break
                //------------------//
                case 'c':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: Boundary.width * j,
                                y: Boundary.height * i
                            },
                            image: createImage('img/capDuoi.png')
                        })
                    )
                    break
                //------------------//
                case 'd':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: Boundary.width * j,
                                y: Boundary.height * i
                            },
                            image: createImage('img/capTren.png')
                        })
                    )
                    break

                //------------------//
                case '.':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: Boundary.width * j,
                                y: Boundary.height * i
                            },
                            image: createImage('img/pipeConnectorBottom.png')
                        })
                    )
                    break
                //------------------//
                case ',':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: Boundary.width * j,
                                y: Boundary.height * i
                            },
                            image: createImage('img/pipeConnectorTop.png')
                        })
                    )
                    break
                //------------------//

                case 'ht':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: Boundary.width * j,
                                y: Boundary.height * i
                            },
                            image: createImage('img/hoPrai.png')
                        })
                    )
                    break
                //------------------//

                case 'bl':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: Boundary.width * j,
                                y: Boundary.height * i
                            },
                            image: createImage('img/block.png')
                        })
                    )
                    break



                //------------------//
                    //--case HẠT ĂN Và CHỈNH HẠT Ở GIỮA
                case '$':
                    pellets.push(
                        new Pellet({
                            position: {
                                x: j * Boundary.width + Boundary.width / 2,
                                y: i * Boundary.height + Boundary.height / 2
                            },
                            image: createImage('img/tututu.mp3')
                        })
                    )
                    break
                //------------------//


                case '%':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: Boundary.width * j,
                                y: Boundary.height * i
                            },
                            image: createImage('img/pipeCross.png')
                        })
                    )
                    break

            }
        })
    })
}

//padding: chỉnh "khoảng cách" pacman, ghost giữa các vạch xanh k chạm vào nhau//
//rectangle:Hình CN - Circle: Vòng tròn - Radius: bán kính//
function circleCollidesWithRectangle({circle, rectangle}) {   // vòng tròn va chạm với hình chữ nhật
    const padding = Boundary.width / 2 - circle.radius - 1
    return (
        circle.position.y - circle.radius + circle.velocity.y
        <=
        rectangle.position.y + rectangle.height + padding &&
        circle.position.x + circle.radius + circle.velocity.x
        >=
        rectangle.position.x - padding &&
        circle.position.y + circle.radius + circle.velocity.y
        >=
        rectangle.position.y - padding &&
        circle.position.x - circle.radius + circle.velocity.x
        <=
        rectangle.position.x + rectangle.width + padding)
    //chức vụ, bán kính, vận tốc
}
//-------------------CopyCode--------------------//




let animationId
function animate() {
    animationId = requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.height, canvas.width)
//DÙNG VÒNG LẶP FOR // ELSE IF
    if (keys.w.pressed && lastKey === "w") {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (circleCollidesWithRectangle({
                circle: {
                    ...player, velocity: {
                        x: 0,
                        y: -2
                    }
                },
                rectangle: boundary
            })
            ) {
                player.velocity.y = 0
                break
            } else {
                player.velocity.y = -2
            }
        }

    } else if (keys.a.pressed && lastKey === "a") {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (circleCollidesWithRectangle({
                circle: {
                    ...player, velocity: {
                        x: -2,
                        y: 0
                    }
                },
                rectangle: boundary
            })
            ) {
                player.velocity.x = 0
                break
            } else {
                player.velocity.x = -2
            }
        }
    } else if (keys.s.pressed && lastKey === "s") {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (circleCollidesWithRectangle({
                circle: {
                    ...player, velocity: {
                        x: 0,
                        y: 2
                    }
                },
                rectangle: boundary
            })
            ) {
                player.velocity.y = 0
                break
            } else {
                player.velocity.y = 2
            }
        }
    } else if (keys.d.pressed && lastKey === "d") {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (circleCollidesWithRectangle({
                circle: {
                    ...player, velocity: {
                        x: 2,
                        y: 0
                    }
                },
                rectangle: boundary
            })
            ) {
                player.velocity.x = 0
                break
            } else {
                player.velocity.x = 2
            }
        }
    }
// PacMan: "-" đi khoảng cách bán kính từ pacman tới các viên//
    // điều kiện trong (): k còn nhấp nháy khi pacman đi qua Hạt//
    // điều kiện chạm vào cộng điểm, đếm số điểm
    for (let i = pellets.length - 1; 0 < i; i--) {
        const pellet = pellets[i]
        pellet.draw()
        if (
            Math.hypot(
                pellet.position.x - player.position.x,
                pellet.position.y - player.position.y
            ) <
            pellet.radius + player.radius
        ) {
            //TÍNH ĐIỂM
            pellets.splice(i, 1)
            score += 1
            scoreEl.innerHTML = score
        }
    }
    boundaries.forEach((boundary) => {
        boundary.draw()
        if (
            circleCollidesWithRectangle({
                circle: player,
                rectangle: boundary
            })
        ) {
            player.velocity.y = 0
            player.velocity.x = 0
            //Điểm xuất phát trên truc x,y và trong khung canvas
        }
    })

    //HIỂN THỊ VITRI Xuất hiện CỦA PACMMAN
    player.update()
    //HIỂN THỊ VỊ TRÍ Xuất hiện CỦA MA ĐỎ
    ghosts.forEach(ghost => {
        ghost.update()

        if (
            Math.hypot(
                ghost.position.x - player.position.x,
                ghost.position.y - player.position.y
            ) <
            ghost.radius + player.radius
        ) {
            audio.pause();

            audio1.play();
            document.getElementById('endGameDiv').style.opacity = '1'
            cancelAnimationFrame(animationId)
        }
        if (pellets.length === 1) {
            alert("YOU WIN")
            cancelAnimationFrame(animationId)
        }

        const collisions = []
        boundaries.forEach(boundary => {
            if ( // nếu va chạm vào bên phải chuỗi và va chạm vào bên trái
                !collisions.includes('right') &&
                circleCollidesWithRectangle({
                    circle: {
                        ...ghost, velocity: {
                            x: ghost.speed,
                            y: 0
                        }
                    },
                    rectangle: boundary
                })
            ) {
                collisions.push('right')
            }

            if (!collisions.includes('left') &&
                circleCollidesWithRectangle({
                    circle: {
                        ...ghost, velocity: {
                            x: -ghost.speed,
                            y: 0
                        }
                    },
                    rectangle: boundary
                })
            ) {
                collisions.push('left')
            }

            if (!collisions.includes('up') &&
                circleCollidesWithRectangle({
                    circle: {
                        ...ghost, velocity: {
                            x: 0,
                            y: -ghost.speed
                        }
                    },
                    rectangle: boundary
                })
            ) {
                collisions.push('up')
            }

            if (!collisions.includes('down') &&
                circleCollidesWithRectangle({
                    circle: {
                        ...ghost, velocity: {
                            x: 0,
                            y: ghost.speed
                        }
                    },
                    rectangle: boundary
                })
            ) {
                collisions.push('down')
            }
        })
        if (collisions.length > ghost.prevCollisions.length)
            ghost.prevCollisions = collisions

        if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {

            if (ghost.velocity.x > 0) ghost.prevCollisions.push('right')
            else if (ghost.velocity.x < 0) ghost.prevCollisions.push('left')
            else if (ghost.velocity.y < 0) ghost.prevCollisions.push('up')
            else if (ghost.velocity.y > 0) ghost.prevCollisions.push('down')
                // 2 ojb k ss dc với nhau thì chuyển thành chuỗi
            const pathways = ghost.prevCollisions.filter((collision
            ) => {
                return !collisions.includes(collision)
                // TRẢ VỀ MẢNG VA CHẠM BAN ĐẦU
                // "!":NGHỊCH ĐẢO LÀ NẾU KHÔNG THÌ CŨNG CHẢ LẠI VỀ BAN ĐẦU
            })
            const direction = pathways[Math.floor(Math.random() * pathways.length)]
            switch (direction) {
                case "down":
                    ghost.velocity.y = ghost.speed
                    ghost.velocity.x = 0
                    break

                case "up":
                    ghost.velocity.y = -ghost.speed
                    ghost.velocity.x = 0
                    break

                case "right":
                    ghost.velocity.y = 0
                    ghost.velocity.x = ghost.speed
                    break

                case "left":
                    ghost.velocity.y = 0
                    ghost.velocity.x = -ghost.speed
                    break
            }

            ghost.prevCollisions = []
        }
    })
    if (player.velocity.x > 0) player.rotation = 0
    else if (player.velocity.x < 0) player.rotation = Math.PI
    else if (player.velocity.y > 0) player.rotation = Math.PI / 2
    else if (player.velocity.y < 0) player.rotation = Math.PI * 1.5

}


//ADD KEY CHẠY
addEventListener("keydown", ({key}) => {
    switch (key) {

        case "a":
            keys.a.pressed = true
            lastKey = "a"
            break
        case "d":
            keys.d.pressed = true
            lastKey = "d"

            break
        case "s":
            keys.s.pressed = true
            lastKey = "s"
            break
        case "w":
            keys.w.pressed = true
            lastKey = "w"
            break
    }
})

addEventListener('keyup', ({key}) => {
    switch (key) {
        case "a":
            keys.a.pressed = false
            break
        case "s":
            keys.s.pressed = false
            break
        case "d":
            keys.d.pressed = false
            break
        case "w":
            keys.w.pressed = false
            break
    }
})

function startGame() {
    audio.play();
    audio1.pause();
    cancelAnimationFrame(animationId)
    mapTo();
    score = 0;
    player.position.x = 60
    player.position.y = 60
    document.getElementById('endGameDiv').style.opacity = '0'
    animate();
}
