const table=document.getElementById("table2");
const board_container=document.getElementById("game-container");
let done=0,doing=0,think;
let stone=["black","white"],rule="free";
let track=[],track_cnt=0;
let img=document.createElement("img");
let ssx=20,ssy=20,bbx=0,bby=0;
function placeA(x,y,n){
    A[x][y]=n;
    ssx=Math.min(ssx,Math.max(x,2));
    ssy=Math.min(ssy,Math.max(y,2));
    bbx=Math.max(bbx,Math.min(x,12));
    bby=Math.max(bby,Math.min(y,12));
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
function learn(win){
}
function search(cnt,b,square,n){
    if(cnt<=p.visit||think==100){
        let index=[{x:0,y:0}],win_rate=-Infinity;
        if(think==100){
            let cand=candidate(0);
            index=[{x:cand[0][0],y:cand[0][1]}];
        }else{
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
        }
        index=index[getRandom(0,index.length-1)];
        track.length=track_cnt;
        track_cnt++;
        track.push([index.x,index.y]);
        track_icon();
        placeA(index.x,index.y,1);
        if(win(index.x,index.y,1)){
            b.innerText="LOSE\nTap to Replay";
            learn(0);
            document.onmousedown=function leftClick(){
                location.replace("/");
            };
            square.style.backgroundColor="rgba(255,255,255,0.8)";
            done=1;
            return;
        }
        if(rule=="omok"){
            for(let i=0;i<N;i++){
                for(let j=0;j<N;j++){
                    if(A33[i][j]<2)continue;
                    table.rows[i].cells[j].removeChild(table.rows[i].cells[j].firstChild);
                }
            }
            chk33(2);
            for(let i=0;i<N;i++){
                for(let j=0;j<N;j++){
                    if(A33[i][j]<2)continue;
                    let forbid33=document.createElement("img");
                    forbid33.alt=`forbid 33`;
                    forbid33.src=`./images/33.png`;
                    forbid33.style.width="100%";
                    forbid33.style.height="100%";
                    table.rows[i].cells[j].appendChild(forbid33);
                }
            }
        }
        doing=0;
        square.remove();
        b.remove();
        icon[0].src="./images/robot.png";
        icon[1].src="./images/person_turn.png";
        document.getElementsByClassName("loading")[0].style.opacity=0;
        return;
    }
    for(let i=0;i<100;i++){
        MCTS(p,n,1);
        p.visit++;
    }
    // b.textContent=`Thinking(${(Math.min(100,p.visit/cnt*100).toFixed(0))}%)`;
    setTimeout(function(){search(cnt,b,square,n)},0)
}
table.addEventListener("click",function(event){
    if(done||doing)return;
    let x=event.target.parentNode.rowIndex;
    let y=event.target.cellIndex;
    if(!A[7][7])x=7,y=7;
    if(A[x][y]||y>N-1||x>N-1||y<0||x<0)return;
    if(rule=="omok"&&A33[x][y]>=2)return;
    doing=1;
    placeA(x,y,2);
    track.length=track_cnt;
    track_cnt++;
    track.push([x,y]);
    track_icon();
    const square=document.createElement('div');
    square.className="trans-background";

    const b=document.createElement("b");
    // b.textContent="Thinking(0%)";
    b.style.position="absolute";
    b.style.fontSize="44px";
    b.style.zIndex="500";
    document.body.appendChild(square);
    board_container.appendChild(b);
    icon[0].src="./images/robot_turn.png";
    icon[1].src="./images/person.png";
    document.getElementsByClassName("loading")[0].style.opacity=1;
    if(win(x,y,2)){
        b.innerText="WIN\nTap to Replay";
        learn(1);
        document.onmousedown=function leftClick(){
            location.replace("/");
        };
        square.style.backgroundColor="rgba(255,255,255,0.8)";
        done=1;
        return;
    }
    if(rule=="omok"){
        for(let i=0;i<N;i++){
            for(let j=0;j<N;j++){
                if(A33[i][j]<2)continue;
                table.rows[i].cells[j].removeChild(table.rows[i].cells[j].firstChild);
            }
        }
        chk33(1);
        for(let i=0;i<N;i++){
            for(let j=0;j<N;j++){
                if(A33[i][j]<2)continue;
                let forbid33=document.createElement("img");
                forbid33.alt=`forbid 33`;
                forbid33.src=`./images/33.png`;
                forbid33.style.width="100%";
                forbid33.style.height="100%";
                table.rows[i].cells[j].appendChild(forbid33);
            }
        }
    }
    setTimeout(function(){
        p={win:0,visit:0};
        search(think,b,square,1);
    },0);
});
function start(){
    think=Number(document.getElementById('difficulty').value);
    if(document.querySelector('input[name="stone"]:checked').value=="White"){
        placeA(7,7,1);
        win(7,7,1);
        track.length=track_cnt;
        track_cnt++;
        track.push([7,7]);
        track_icon();
    }else{
        stone=["white","black"];
    }
    rule=document.querySelector('select[name=rule] option:checked').value;
    localStorage.setItem("difficulty",think);
    localStorage.setItem("stone",stone[1]);
    localStorage.setItem("rule",rule);
    document.getElementsByClassName("trans-background")[0].remove();
    document.getElementsByTagName("html")[0].style.overflow="visible";
    track_icon();
}
function track_icon(){
    let turn=(stone[0]=="black"?0:1);
    if(track_cnt==(turn+1)%2)icon[2].src="./images/fast_back_block.png";
    else icon[2].src="./images/fast_back.png";
    if(track_cnt==Math.max((turn+1)%2,track_cnt-2))icon[3].src="./images/back_block.png";
    else icon[3].src="./images/back.png";
    if(track_cnt==Math.min(track.length,track_cnt+2))icon[4].src="./images/front_block.png";
    else icon[4].src="./images/front.png"
    if(track_cnt==track.length)icon[5].src="./images/fast_front_block.png";
    else icon[5].src="./images/fast_front.png";
}
const board=document.getElementById("game-container");
const cells=document.querySelectorAll("th");
const background=document.getElementById("background");
const icon=document.getElementsByClassName("icon");
for(let i=0;i<icon.length;i++){
    if(i<2)continue;
    icon[i].addEventListener('click',function(){
        let turn=(stone[0]=="black"?0:1);
        if(icon[i].alt=="back")track_cnt=Math.max((turn+1)%2,track_cnt-2);
        if(icon[i].alt=="front")track_cnt=Math.min(track.length,track_cnt+2);
        if(icon[i].alt=="fast_back")track_cnt=(turn+1)%2;
        if(icon[i].alt=="fast_front")track_cnt=track.length;
        A=Array.from(Array(N),()=>Array(N).fill(0));
        C=Array.from(Array(N),()=>Array(N).fill(0));
        W1=Array(N*N).fill(0);// |
        W2=Array(N*N).fill(0);// _
        W3=Array(N*N).fill(0);// \
        W4=Array(N*N).fill(0);// /
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
            win(track[i][0],track[i][1])
        }
        track_icon();
        if(rule=="omok"){
            for(let i=0;i<N;i++){
                for(let j=0;j<N;j++){
                    if(A33[i][j]<2)continue;
                    table.rows[i].cells[j].removeChild(table.rows[i].cells[j].firstChild);
                }
            }
            chk33((turn+track_cnt-1)%2+1);
            for(let i=0;i<N;i++){
                for(let j=0;j<N;j++){
                    if(A33[i][j]<2)continue;
                    let forbid33=document.createElement("img");
                    forbid33.alt=`forbid 33`;
                    forbid33.src=`./images/33.png`;
                    forbid33.style.width="100%";
                    forbid33.style.height="100%";
                    table.rows[i].cells[j].appendChild(forbid33);
                }
            }
        }
    });
};
document.getElementById(localStorage.getItem("stone")?localStorage.getItem("stone"):"black").checked=true;
document.getElementById('difficulty').value=localStorage.getItem("difficulty")?localStorage.getItem("difficulty"):10000;
let sel=document.querySelector("select[name=rule]").options;
for(let i=0;i<sel.length;i++){
    if(sel[i].value==localStorage.getItem("rule"))sel[i].selected=true;
}
window.addEventListener('scroll', function() {
    const upButton=document.querySelector('#up-button');
    if(window.scrollY==0){
        upButton.style.opacity=0;
        upButton.style.pointerEvents="none";
    }else{
        upButton.style.opacity=1;
        upButton.style.pointerEvents="auto";
    }
});
window.scrollTo(0,0);