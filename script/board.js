const table=document.getElementById("table2");
const board_container=document.getElementById("board-container");
let done=0,doing=0,think;
let stone=["black","white"];
let img=document.createElement("img");
function placeA(x,y,n){
    A[x][y]=n;
    for(let i=-1;i<=1;i++){
        for(let j=-1;j<=1;j++){
            if(x+i<0||y+j<0||x+i>N-1||y+j>N-1)continue;
            C[x+i][y+j]+=1;
        }
    }
    if(n==1){
        img.src=`./images/${stone[1]}.png`;
        img.alt=`Gomoku ${stone[1]} stone`;
        img=document.createElement("img");
        img.src=`./images/${stone[0]}_last.png`;
        img.alt=`Gomoku last ${stone[0]} stone`;
        img.style.width="100%";
        img.style.height="100%";
        table.rows[x].cells[y].appendChild(img);
    }
    if(n==2){
        img.src=`./images/${stone[0]}.png`;
        img.alt=`Gomoku ${stone[0]} stone`;
        img=document.createElement("img");
        img.alt=`Gomoku last ${stone[1]} Stone`;
        img.src=`./images/${stone[1]}_last.png`;
        img.style.width="100%";
        img.style.height="100%";
        table.rows[x].cells[y].appendChild(img);
    }
}
function search(cnt,b,square,n){
    if(cnt<=p.visit){
        let index=[{x:0,y:0}],win_rate=-Infinity;
        for(let i in p){
            let ind=Number(i);
            if(isNaN(ind))continue;
            let pw=p[ind].win;
            let pv=p[ind].visit;
            let rate=(pw/pv);
            if(rate>win_rate){
                win_rate=rate;
                index=[{x:Math.floor(ind/N),y:ind%N}];
            }else if(rate==win_rate)index.push({x:Math.floor(ind/N),y:ind%N});
        }
        index=index[getRandom(0,index.length-1)];
        placeA(index.x,index.y,1);
        if(win(index.x,index.y,1)){
            b.innerText="LOSE\nTap to Replay";
            document.onmousedown=function leftClick(){
                location.replace("/");
            };
            square.style.backgroundColor="rgba(255,255,255,0.8)";
            done=1;
            return;
        }
        doing=0;
        square.remove();
        b.remove();
        return;
    }
    for(let i=0;i<Math.ceil(cnt/100);i++){
        MCTS(p,n,1);
        p.visit++;
    }
    b.textContent=`Thinking(${(Math.min(100,p.visit/cnt*100).toFixed(0))}%)`;
    setTimeout(function(){search(cnt,b,square,n)},0)
}
table.addEventListener("click",function(event){
    if(done||doing)return;
    let x=event.target.parentNode.rowIndex;
    let y=event.target.cellIndex;
    if(!A[7][7])x=7,y=7;
    if(A[x][y]||y>N-1||x>N-1||y<0||x<0)return;
    doing=1;
    placeA(x,y,2);
    const square=document.createElement('div');
    square.className="trans-background";

    const b=document.createElement("b");
    b.textContent="Thinking(0%)";
    b.style.position="absolute";
    b.style.fontSize="44px";
    b.style.zIndex="500";
    document.body.appendChild(square);
    board_container.appendChild(b);
    if(win(x,y,2)){
        b.innerText="WIN\nTap to Replay";
        document.onmousedown=function leftClick(){
            location.replace("/");
        };
        square.style.backgroundColor="rgba(255,255,255,0.8)";
        done=1;
        return;
    }
    setTimeout(function(){
        p={win:0,visit:0};
        search(think,b,square,1);
    },0);
});
function start(){
    if(document.querySelector('input[name="difficulty"]:checked').value=="easy"){
        think=5000;
    }
    if(document.querySelector('input[name="difficulty"]:checked').value=="medium"){
        think=10000;
    }
    if(document.querySelector('input[name="difficulty"]:checked').value=="hard"){
        think=20000;
    }
    if(document.querySelector('input[name="stone"]:checked').value=="White"){
        placeA(7,7,1);
        win(7,7,1);
    }else stone=["white","black"];
    document.getElementsByClassName("trans-background")[0].remove();
}
for(let i=0;i<N;i++){
    for(let j=0;j<N;j++){
        table.rows[i].cells[j].style.border='none';
    }
}

const board=document.getElementById('board-container');
const container=document.getElementById('container');
const cells=document.querySelectorAll('th,td');
let advertisment=document.createElement("ins");
advertisment.setAttribute("class","kakao_ad_area");
advertisment.style="display:none";
if(window.matchMedia("(min-width:728px)").matches){
    advertisment.setAttribute("data-ad-unit","DAN-IlKDM4p10tJd1i3l");
    advertisment.setAttribute("data-ad-width","728");
    advertisment.setAttribute("data-ad-height","90");
    container.style.height=`${window.innerHeight-90}px`;
    board.style.height=`${Math.min(window.innerHeight-90,window.innerWidth)}px`;
    board.style.width=`${Math.min(window.innerHeight-90,window.innerWidth)}px`;
    cells.forEach(cell=>{
        cell.style.width=`${Math.min(window.innerHeight-90,window.innerWidth)*0.06}px`;
        cell.style.height=`${Math.min(window.innerHeight-90,window.innerWidth)*0.06}px`;
    });
}else{
    advertisment.setAttribute("data-ad-unit","DAN-QQ1Rd0zcFoD469HR");
    advertisment.setAttribute("data-ad-width","320");
    advertisment.setAttribute("data-ad-height","100");
    container.style.height=`${window.innerHeight-100}px`;
    board.style.height=`${Math.min(window.innerHeight-100,window.innerWidth)}px`;
    board.style.width=`${Math.min(window.innerHeight-100,window.innerWidth)}px`;
    cells.forEach(cell=>{
        cell.style.width=`${Math.min(window.innerHeight-100,window.innerWidth)*0.06}px`;
        cell.style.height=`${Math.min(window.innerHeight-100,window.innerWidth)*0.06}px`;
    });
}
let div=document.createElement("div");
div.style="bottom:0;position:absolute;width:100%;justify-content: center;align-items: center;display: flex;";
div.appendChild(advertisment);
document.body.appendChild(div);
