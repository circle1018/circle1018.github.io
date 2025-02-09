let N=3;
let A=Array.from(Array(N),()=>Array(N).fill(0));
function win(){
    for (let i=0;i<N;i++){
        if(A[i][0]*A[i][1]*A[i][2]==1)return 1;
        if(A[0][i]*A[1][i]*A[2][i]==1)return 1;
        if(A[i][0]*A[i][1]*A[i][2]==8)return 2;
        if(A[0][i]*A[1][i]*A[2][i]==8)return 2;
    }
    if(A[0][0]*A[1][1]*A[2][2]==1)return 1;
    if(A[0][2]*A[1][1]*A[2][0]==1)return 1;
    if(A[0][0]*A[1][1]*A[2][2]==8)return 2;
    if(A[0][2]*A[1][1]*A[2][0]==8)return 2;
    return 0;
}