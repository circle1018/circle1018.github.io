let A44=Array.from(Array(N),()=>Array(N).fill(0));
let loc4=[[1],[2],[3],[4],[1],[2,3],[4,3],[5],[1],[2,4],[5],[1],[5],[1],[2],[3],[4],[1],[2,3],[4,3],[5],[1],[2,4],[5],[1],[5],[1],[2],[3],[4],[1],[2],[4],[5],[1],[2],[3],[5],[1],[3],[4],[5],[1],[2,3],[4,3],[5],[1],[2,4],[5],[1],[5]]
let type44=["001110","010110","011010","011100","0010110","0100110","0110010","0110100","0011010","0101010","0111000","0001110","0101100","201110","210110","211010","211100","2010110","2100110","2110010","2110100","2011010","2101010","2111000","2001110","2101100","001112","010112","011012","011102","0012110","0102110","0112010","0112100","0011210","0101210","0110210","0111200","0021110","0120110","0121010","0121100","0010112","0100112","0110012","0110102","0011012","0101012","0111002","0001112","0101102"]
function chk44(num){
    A44=Array.from(Array(N),()=>Array(N).fill(0));
    //가로
    for(let i=0;i<N;i++){
        let str="";
        for(let j=0;j<N;j++){
            str+=(A[i][j]==num)?1:(A[i][j]?2:0);
            if(str.length>7)str=str.substring(1);
            if(type44.includes(str)){
                let t=loc4[type44.indexOf(str)];
                for(let l=0;l<t.length;l++){
                    let ind=6-t[l];
                    A44[i][j-ind]+=1;
                }
            }
            if(type44.includes(str.substring(1))){
                let t=loc4[type44.indexOf(str.substring(1))];
                for(let l=0;l<t.length;l++){
                    let ind=5-t[l];
                    A44[i][j-ind]+=1;
                }
            }
        }
    }
    //세로
    for(let j=0;j<N;j++){
        let str="";
        for(let i=0;i<N;i++){
            str+=(A[i][j]==num)?1:(A[i][j]?2:0);
            if(str.length>7)str=str.substring(1);
            if(type44.includes(str)){
                let t=loc4[type44.indexOf(str)];
                for(let l=0;l<t.length;l++){
                    let ind=6-t[l];
                    A44[i-ind][j]+=1;
                }
            }
            if(type44.includes(str.substring(1))){
                let t=loc4[type44.indexOf(str.substring(1))];
                for(let l=0;l<t.length;l++){
                    let ind=5-t[l];
                    A44[i-ind][j]+=1;
                }
            }
        }
    }
    //Diagonal
    for(let k=0;k<N;k++){
        let str="";
        for(let i=0,j=k;i<N&&j<N;i++,j++){
            str+=(A[i][j]==num)?1:(A[i][j]?2:0);
            if(str.length>7)str=str.substring(1);
            if(type44.includes(str)){
                let t=loc4[type44.indexOf(str)];
                for(let l=0;l<t.length;l++){
                    let ind=6-t[l];
                    A44[i-ind][j-ind]+=1;
                }
            }
            if(type44.includes(str.substring(1))){
                let t=loc4[type44.indexOf(str.substring(1))];
                for(let l=0;l<t.length;l++){
                    let ind=5-t[l];
                    A44[i-ind][j-ind]+=1;
                }
            }
        }
    }
    for(let k=1;k<N;k++){
        let str="";
        for(let i=k,j=0;i<N&&j<N;i++,j++){
            str+=(A[i][j]==num)?1:(A[i][j]?2:0);
            if(str.length>7)str=str.substring(1);
            if(type44.includes(str)){
                let t=loc4[type44.indexOf(str)];
                for(let l=0;l<t.length;l++){
                    let ind=6-t[l];
                    A44[i-ind][j-ind]+=1;
                }
            }
            if(type44.includes(str.substring(1))){
                let t=loc4[type44.indexOf(str.substring(1))];
                for(let l=0;l<t.length;l++){
                    let ind=5-t[l];
                    A44[i-ind][j-ind]+=1;
                }
            }
        }
    }
    //Anti Diagonal
    for(let k=0;k<N;k++){
        let str="";
        for(let i=0,j=k;i<N&&j>=0;i++,j--){
            str+=(A[i][j]==num)?1:(A[i][j]?2:0);
            if(str.length>7)str=str.substring(1);
            if(type44.includes(str)){
                let t=loc4[type44.indexOf(str)];
                for(let l=0;l<t.length;l++){
                    let ind=6-t[l];
                    A44[i-ind][j+ind]+=1;
                }
            }
            if(type44.includes(str.substring(1))){
                let t=loc4[type44.indexOf(str.substring(1))];
                for(let l=0;l<t.length;l++){
                    let ind=5-t[l];
                    A44[i-ind][j+ind]+=1;
                }
            }
        }
    }
    for(let k=1;k<N;k++){
        let str="";
        for(let i=k,j=N-1;i<N&&j>=0;i++,j--){
            str+=(A[i][j]==num)?1:(A[i][j]?2:0);
            if(str.length>7)str=str.substring(1);
            if(type44.includes(str)){
                let t=loc4[type44.indexOf(str)];
                for(let l=0;l<t.length;l++){
                    let ind=6-t[l];
                    A44[i-ind][j+ind]+=1;
                }
            }
            if(type44.includes(str.substring(1))){
                let t=loc4[type44.indexOf(str.substring(1))];
                for(let l=0;l<t.length;l++){
                    let ind=5-t[l];
                    A44[i-ind][j+ind]+=1;
                }
            }
        }
    }
}