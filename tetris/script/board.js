let tetris=[[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]];
let block=[],block_color,new_block=[
    [
        [[0,5],[1,5],[2,5],[3,5]],1
    ],
    [
        [[0,4],[0,5],[1,4],[1,5]],2
    ],
    [
        [[0,4],[0,5],[1,5],[1,6]],3
    ],
    [
        [[0,5],[0,6],[1,4],[1,5]],4
    ],
    [
        [[0,5],[1,5],[2,5],[2,4]],5
    ],
    [
        [[0,4],[1,4],[2,4],[2,5]],6
    ],
    [
        [[0,4],[0,5],[0,6],[1,5]],7
    ]
];
let table=document.getElementById("table");
function json(obj){return JSON.parse(JSON.stringify(obj))}
function shuffle(array){
    for(let index=array.length-1;index>0;index--){
        const randomPosition=Math.floor(Math.random()*(index+1));
        const temporary=array[index];
        array[index]=array[randomPosition];
        array[randomPosition]=temporary;
    }
}
let block_list=json(new_block),used_block=1;
shuffle(block_list);
function print_tetris(){
    for(let i=0;i<12;i++){
        for(let j=0;j<10;j++){
            table.rows[i].cells[j].style["background-color"]=["#000000","#87CEEB","#FFD700","#FF6347","#32CD32","#1E90FF","#FFA500","#800080"][tetris[i][j]];
        }
    }
}
function delete_line(){
    for(let i=3;i>=0;i--)tetris[block[i][0]][block[i][1]]=0;
    for(let i=11;i>=0;i--){
        let chk=1,k=0;
        for(let j=0;j<10;j++){
            if(!tetris[i][j]){
                chk=0;
                break;
            }else k=1;
        }
        if(chk){
            for(let k=i-1;k>=0;k--){
                for(let j=0;j<10;j++){
                    tetris[k+1][j]=tetris[k][j];
                }
            }
            for(let j=3;j>=0;j--)block[j]=[block[j][0]+1,block[j][1]];
            i++;
        }
    }
    for(let i=3;i>=0;i--)tetris[block[i][0]][block[i][1]]=block_color;
}
function move(){
    if(block.length==0){
        if(used_block==7){
            used_block=0;
            shuffle(block_list);
        }
        block=json(block_list[used_block][0]);
        block_color=block_list[used_block++][1];
        for(let i=0;i<4;i++){
            if(tetris[block[i][0]][block[i][1]])return;
        }
        for(let i=3;i>=0;i--)tetris[block[i][0]][block[i][1]]=block_color;
        delete_line();
        return;
    }
    let pre_tetris=json(tetris);
    block.sort(function(a,b){
        return (a[0]!=b[0])?(a[0]-b[0]):(a[1]-b[1]);
    });
    for(let i=3;i>=0;i--)tetris[block[i][0]][block[i][1]]=0;
    for(let i=3;i>=0;i--){
        block[i]=[block[i][0]+1,block[i][1]];
        if(block[i][0]>11||tetris[block[i][0]][block[i][1]]){
            tetris=pre_tetris;
            block=[];
            move();
            return;
        }
        tetris[block[i][0]][block[i][1]]=block_color;
    }
}
function goDown(){
    block.sort(function(a,b){
        return (a[0]!=b[0])?(a[0]-b[0]):(a[1]-b[1]);
    });
    for(;;){
        let pre_tetris=json(tetris);
        for(let i=3;i>=0;i--)tetris[block[i][0]][block[i][1]]=0;
        for(let i=3;i>=0;i--){
            block[i]=[block[i][0]+1,block[i][1]];
            if(block[i][0]>11||tetris[block[i][0]][block[i][1]]){
                tetris=pre_tetris;
                block=[];
                move();
                return;
            }
            tetris[block[i][0]][block[i][1]]=block_color;
        }
    }
}
function left(){
    let pre_tetris=json(tetris);
    for(let i=0;i<4;i++)tetris[block[i][0]][block[i][1]]=0;
    for(let i=0;i<4;i++){
        if(tetris[block[i][0]][block[i][1]-1]||block[i][1]-1<0){
            tetris=pre_tetris;
            return;
        }
    }
    for(let i=0;i<4;i++){
        block[i]=[block[i][0],block[i][1]-1];
        tetris[block[i][0]][block[i][1]]=block_color;
    }
}
function right(){
    let pre_tetris=json(tetris);
    for(let i=0;i<4;i++)tetris[block[i][0]][block[i][1]]=0;
    for(let i=0;i<4;i++){
        if(tetris[block[i][0]][block[i][1]+1]||block[i][1]+1>9){
            tetris=pre_tetris;
            return;
        }
    }
    for(let i=0;i<4;i++){
        block[i]=[block[i][0],block[i][1]+1];
        tetris[block[i][0]][block[i][1]]=block_color;
    }
}
function turn_(mid_n){
    let pre_tetris=json(tetris);
    let mid=[(block[0][0]+block[1][0]+block[2][0]+block[3][0])/4,(block[0][1]+block[1][1]+block[2][1]+block[3][1])/4];
    for(let i=0;i<4;i++)tetris[block[i][0]][block[i][1]]=0;
    for(let i=0;i<4;i++){
        let r=Math.round(mid[0]+mid[1]-block[i][1]);
        let c=Math.round(mid[1]-mid[0]+block[i][0]);
        if(r>11||r<0||c>9||c<0||tetris[r][c]){
            tetris=pre_tetris;
            return;
        }
    }
    for(let i=0;i<4;i++){
        block[i]=[Math.round(mid[0]+mid[1]-block[i][1]),Math.round(mid[1]-mid[0]+block[i][0])];
        tetris[block[i][0]][block[i][1]]=block_color;
    }
}
let inter,delay,d=800;
function auto_move(){
    let dc=d;
    inter=setInterval(function(){
        move();
        print_tetris();
    },d-=2);
}
function start(){
    if(active++)return;
    let count=3;
    const countdown=document.getElementById("countdown");
    countdown.style.color="red";
    countdown.style.fontSize="100px";
    countdown.style.animation="countdownEffect 1s ease-in-out infinite";
    countdown.textContent="3";
    const interval=setInterval(()=>{
        count--;
        if(count==0){
            countdown.style.opacity=0;
            countdown.style.animation="fade 2s 1";
            setTimeout(function(){
                countdown.remove();
            },2000)
            document.onkeydown=function(e){
                switch(e.keyCode){
                    case 38:
                        goDown();
                        break;
                    case 87:
                        goDown();
                        break;
                    case 40:
                        move();
                        break;
                    case 83:
                        move();
                        break;
                    case 37:
                        left();
                        break;
                    case 65:
                        left();
                        break;
                    case 39:
                        right();
                        break;
                    case 68:
                        right();
                        break;
                    case 13:
                        turn_(1);
                        break;
                    case 32:
                        turn_(1);
                        break;
                }
                print_tetris();
                clearInterval(inter);
                auto_move();
            };
            auto_move();
            clearInterval(interval);
        }else{
            countdown.textContent=count;
        }
    },1000);
}


const board=document.getElementById("game-container");
const cells=document.querySelectorAll("th");
const background=document.getElementById("background");
const icon=document.getElementsByClassName("icon");
const advertisment=document.createElement("ins");
advertisment.setAttribute("class","kakao_ad_area");
advertisment.style="display:none";
let size;
if(window.matchMedia("(min-width:728px)").matches){
    advertisment.setAttribute("data-ad-unit","DAN-IlKDM4p10tJd1i3l");
    advertisment.setAttribute("data-ad-width","728");
    advertisment.setAttribute("data-ad-height","90");
    size=window.innerHeight-90;
    board.style.height=`${window.innerHeight-90}px`;
}else{
    advertisment.setAttribute("data-ad-unit","DAN-QQ1Rd0zcFoD469HR");
    advertisment.setAttribute("data-ad-width","320");
    advertisment.setAttribute("data-ad-height","100");
    size=window.innerHeight-100;
    board.style.height=`${window.innerHeight-100}px`;
}
cells.forEach(cell=>{
    cell.style.width=`${size*0.0725}px`;
    cell.style.height=`${size*0.0725}px`;
    cell.style.fontSize="100%";
});
let div=document.createElement("div");
div.style="bottom:0;position:absolute;width:100%;justify-content: center;align-items: center;display: flex;";
div.appendChild(advertisment);
document.body.appendChild(div);
let active=0;
document.onmousedown=function(){start()};
document.onkeydown=function(){start();};