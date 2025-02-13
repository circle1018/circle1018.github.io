const table=document.getElementById("table");
const board_container=document.getElementById("game-container");
let done=0,doing=0,think;
let stone=["circle","cross"],rule="free";
let track=[],track_cnt=0;
let img=document.createElement("img");
function getRandom(min,max){
    return Math.floor((Math.random()*(max-min+1))+min);
}
function placeA(x,y,n){
    A[x][y]=n;
    if(n==1){
        img=document.createElement("img");
        img.src=`./images/${stone[0]}.png`;
        img.style.width="100%";
        img.style.height="100%";
        table.rows[x].cells[y].appendChild(img);
    }
    if(n==2){
        img=document.createElement("img");
        img.src=`./images/${stone[1]}.png`;
        img.style.width="100%";
        img.style.height="100%";
        table.rows[x].cells[y].appendChild(img);
    }
}
function minimax(depth,isMaximizing){
    const winner=win();
    if(winner==1)return 10-depth;
    if(winner==2)return depth-10;
    let isFull=true;
    for(let i=0;i<N;i++){
        for(let j=0;j<N;j++){
            if(A[i][j]==0){
                isFull=false;
                break;
            }   
        }
        if(!isFull)break;
    }
    if(isFull)return 0;
    let bestScore=isMaximizing?-Infinity:Infinity;
    let bestMove;

    for (let i=0;i<N;i++){
        for(let j=0;j<N;j++){
            if(A[i][j]==0){
                A[i][j]=isMaximizing?1:2;
                const score=minimax(depth+1,!isMaximizing);
                A[i][j]=0;
                if((isMaximizing&&score>bestScore)||(!isMaximizing&&score<bestScore)){
                    bestScore=score;
                    bestMove=[i,j];
                }
            }
        }
    }
    return depth==0?bestMove:bestScore;
}


table.addEventListener("click",function(event){
    if(done||doing)return;
    let x=event.target.parentNode.rowIndex;
    let y=event.target.cellIndex;
    if(A[x][y]||y>N-1||x>N-1||y<0||x<0)return;
    doing=1;
    placeA(x,y,2);
    track.length=track_cnt;
    track_cnt++;
    track.push([x,y]);
    track_icon();
    if(win()){
        const square=document.createElement('div');
        square.className="trans-background";
    
        const b=document.createElement("b");
        b.style.position="absolute";
        b.style.fontSize="44px";
        b.style.zIndex="500";
        document.body.appendChild(square);
        board_container.appendChild(b);
        b.innerText="WIN\nTap to Replay";
        document.onmousedown=function leftClick(){
            location.replace(location.href);
        };
        square.style.backgroundColor="rgba(255,255,255,0.8)";
        done=1;
        return;
    }
    let index=minimax(0,true);
    console.log(index);
    track.length=track_cnt;
    track_cnt++;
    const square=document.createElement('div');
    const b=document.createElement("b");
    if(track_cnt>8){
        square.className="trans-background";
    
        b.style.position="absolute";
        b.style.fontSize="44px";
        b.style.zIndex="500";
        document.body.appendChild(square);
        board_container.appendChild(b);
        b.innerText="WIN-WIN\nTap to Replay";
        document.onmousedown=function leftClick(){
            location.replace("/");
        };
        square.style.backgroundColor="rgba(255,255,255,0.8)";
        done=1;
    }
    track.push([index[0],index[1]]);
    track_icon();
    placeA(index[0],index[1],1);
    if(win(index[0],index[1],1)){
        square.className="trans-background";
    
        b.style.position="absolute";
        b.style.fontSize="44px";
        b.style.zIndex="500";
        document.body.appendChild(square);
        board_container.appendChild(b);
        b.innerText="LOSE\nTap to Replay";
        document.onmousedown=function leftClick(){
            location.replace("/");
        };
        square.style.backgroundColor="rgba(255,255,255,0.8)";
        done=1;
        return;
    }
    doing=0;
    return;
});
function start(){
    think=Number(document.getElementById('difficulty').value);
    if(document.querySelector('input[name="stone"]:checked').value=="cross"){
        let nx=getRandom(0,1),ny=getRandom(0,1);
        placeA(nx,ny,1);
        track.length=track_cnt;
        track_cnt++;
        track.push([nx,ny]);
        track_icon();
    }else{
        stone=["cross","circle"];
    }
    localStorage.setItem("difficulty",think);
    localStorage.setItem("stone",stone[1]);;
    document.getElementsByClassName("trans-background")[0].remove();
    track_icon();
}
function track_icon(){
    let turn=(stone[0]=="circle"?0:1);
    if(track_cnt==(turn+1)%2)icon[0].src="./images/fast_back_block.png";
    else icon[0].src="./images/fast_back.png";
    if(track_cnt==Math.max((turn+1)%2,track_cnt-2))icon[1].src="./images/back_block.png";
    else icon[1].src="./images/back.png";
    if(track_cnt==Math.min(track.length,track_cnt+2))icon[2].src="./images/front_block.png";
    else icon[2].src="./images/front.png"
    if(track_cnt==track.length)icon[3].src="./images/fast_front_block.png";
    else icon[3].src="./images/fast_front.png";
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
    size=Math.min(window.innerHeight-90,window.innerWidth);
    board.style.height=`${window.innerHeight-90}px`;
}else{
    advertisment.setAttribute("data-ad-unit","DAN-QQ1Rd0zcFoD469HR");
    advertisment.setAttribute("data-ad-width","320");
    advertisment.setAttribute("data-ad-height","100");
    size=Math.min(window.innerHeight-100,window.innerWidth);
    board.style.height=`${window.innerHeight-100}px`;
}
background.style.height=`${size*0.87}px`;
background.style.width=`${size*0.87}px`;
cells.forEach(cell=>{
    cell.style.width=`${size*0.29}px`;
    cell.style.height=`${size*0.29}px`;
});
for(let i=0;i<icon.length;i++){
    icon[i].style.width=`${size*0.058}px`;
    icon[i].style.height=`${size*0.058}px`;
    icon[i].style.left=`${size*0.058*(i+10.5)}px`;
    icon[i].addEventListener('click',function(){
        let turn=(stone[0]=="circle"?0:1);
        if(icon[i].alt=="back")track_cnt=Math.max((turn+1)%2,track_cnt-2);
        if(icon[i].alt=="front")track_cnt=Math.min(track.length,track_cnt+2);
        if(icon[i].alt=="fast_back")track_cnt=(turn+1)%2;
        if(icon[i].alt=="fast_front")track_cnt=track.length;
        A=Array.from(Array(N),()=>Array(N).fill(0));
        for(let i=0;i<track.length;i++){
            let element=table.rows[track[i][0]].cells[track[i][1]];
            if(element.firstChild){
                element.removeChild(element.firstChild);
            }else{
                break;
            }
        }
        for(let i=0;i<track_cnt;i++){
            placeA(track[i][0],track[i][1],(turn+i)%2+1);
        }
        track_icon();
    });
};
let div=document.createElement("div");
div.style="bottom:0;position:absolute;width:100%;justify-content: center;align-items: center;display: flex;";
div.appendChild(advertisment);
document.body.appendChild(div);
document.getElementById(localStorage.getItem("stone")?localStorage.getItem("stone"):"cross").checked=true;
document.getElementById('difficulty').value=localStorage.getItem("difficulty")?localStorage.getItem("difficulty"):50;