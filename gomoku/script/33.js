let A33=Array.from(Array(N),()=>Array(N).fill(0));
let type=['00110','01010','01100','001010','010010','011000','000110','010100'];
let loc3=[[1],[2],[3],[1],[2,3],[4],[1],[4]];
let max3=0;
function chk33(num,nod){
    if(!nod)A33=Array.from(Array(N),()=>Array(N).fill(0));
    //가로
    for(let i=0;i<N;i++){
        let str="";
        for(let j=0;j<N;j++){
            str+=(A[i][j]==num)?1:(A[i][j]?2:0);
            if(str.length>6)str=str.substring(1);
            if(type.includes(str)){
                let t=loc3[type.indexOf(str)];
                for(let l=0;l<t.length;l++){
                    let ind=5-t[l];
                    A33[i][j-ind]+=1;
                }
            }
            if(type.includes(str.substring(1))){
                let t=loc3[type.indexOf(str.substring(1))];
                for(let l=0;l<t.length;l++){
                    let ind=4-t[l];
                    A33[i][j-ind]+=1;
                }
            }
        }
    }
    //세로
    for(let j=0;j<N;j++){
        let str="";
        for(let i=0;i<N;i++){
            str+=(A[i][j]==num)?1:(A[i][j]?2:0);
            if(str.length>6)str=str.substring(1);
            if(type.includes(str)){
                let t=loc3[type.indexOf(str)];
                for(let l=0;l<t.length;l++){
                    let ind=5-t[l];
                    A33[i-ind][j]+=1;
                }
            }
            if(type.includes(str.substring(1))){
                let t=loc3[type.indexOf(str.substring(1))];
                for(let l=0;l<t.length;l++){
                    let ind=4-t[l];
                    A33[i-ind][j]+=1;
                }
            }
        }
    }
    //Diagonal
    for(let k=0;k<N;k++){
        let str="";
        for(let i=0,j=k;i<N&&j<N;i++,j++){
            str+=(A[i][j]==num)?1:(A[i][j]?2:0);
            if(str.length>6)str=str.substring(1);
            if(type.includes(str)){
                let t=loc3[type.indexOf(str)];
                for(let l=0;l<t.length;l++){
                    let ind=5-t[l];
                    A33[i-ind][j-ind]+=1;
                }
            }
            if(type.includes(str.substring(1))){
                let t=loc3[type.indexOf(str.substring(1))];
                for(let l=0;l<t.length;l++){
                    let ind=4-t[l];
                    A33[i-ind][j-ind]+=1;
                }
            }
        }
    }
    for(let k=1;k<N;k++){
        let str="";
        for(let i=k,j=0;i<N&&j<N;i++,j++){
            str+=(A[i][j]==num)?1:(A[i][j]?2:0);
            if(str.length>6)str=str.substring(1);
            if(type.includes(str)){
                let t=loc3[type.indexOf(str)];
                for(let l=0;l<t.length;l++){
                    let ind=5-t[l];
                    A33[i-ind][j-ind]+=1;
                }
            }
            if(type.includes(str.substring(1))){
                let t=loc3[type.indexOf(str.substring(1))];
                for(let l=0;l<t.length;l++){
                    let ind=4-t[l];
                    A33[i-ind][j-ind]+=1;
                }
            }
        }
    }
    //Anti Diagonal
    for(let k=0;k<N;k++){
        let str="";
        for(let i=0,j=k;i<N&&j>=0;i++,j--){
            str+=(A[i][j]==num)?1:(A[i][j]?2:0);
            if(str.length>6)str=str.substring(1);
            if(type.includes(str)){
                let t=loc3[type.indexOf(str)];
                for(let l=0;l<t.length;l++){
                    let ind=5-t[l];
                    A33[i-ind][j+ind]+=1;
                }
            }
            if(type.includes(str.substring(1))){
                let t=loc3[type.indexOf(str.substring(1))];
                for(let l=0;l<t.length;l++){
                    let ind=4-t[l];
                    A33[i-ind][j+ind]+=1;
                }
            }
        }
    }
    for(let k=1;k<N;k++){
        let str="";
        for(let i=k,j=N-1;i<N&&j>=0;i++,j--){
            str+=(A[i][j]==num)?1:(A[i][j]?2:0);
            if(str.length>6)str=str.substring(1);
            if(type.includes(str)){
                let t=loc3[type.indexOf(str)];
                for(let l=0;l<t.length;l++){
                    let ind=5-t[l];
                    A33[i-ind][j+ind]+=1;
                }
            }
            if(type.includes(str.substring(1))){
                let t=loc3[type.indexOf(str.substring(1))];
                for(let l=0;l<t.length;l++){
                    let ind=4-t[l];
                    A33[i-ind][j+ind]+=1;
                }
            }
        }
    }

    max3=0;
    for(let i=0;i<N;i++){
        for(let j=0;j<N;j++){
            max3=Math.max(max3,A33[i][j]);
        }
    }
    if(nod)nod=JSON.parse(JSON.stringify(A44));
}