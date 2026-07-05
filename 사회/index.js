let genes = [], generation;
function getRandom(s, e) {
    return Math.round(Math.random() * (e - s)) + s;
}
function init() {
    generation = 1;
    for (let i = 0; i < 16; i++) {
        genes.push({
            r: getRandom(90, 140),
            g: getRandom(65, 100),
            b: getRandom(50, 75)
        });
    }
    return;
}
function select() {
    genes.sort((a, b) => (b.r + b.g + b.b) - (a.r + a.g + a.b));
    return;
}
function generate() {
    let new_genes = [];
    for (let i = 0; i < 16; i++) {
        let a = getRandom(0, 3), b = getRandom(0, 3);
        let gene = { r: 0, g: 0, b: 0 };
        gene.r = genes[[a, b][getRandom(0, 1)]].r;
        gene.g = genes[[a, b][getRandom(0, 1)]].g;
        gene.b = genes[[a, b][getRandom(0, 1)]].b;
        if (getRandom(1, 100) <= 5) gene.r = getRandom(0, 255);
        if (getRandom(1, 100) <= 5) gene.g = getRandom(0, 255);
        if (getRandom(1, 100) <= 5) gene.b = getRandom(0, 255);
        new_genes.push(gene);
    }
    genes = new_genes, generation++;
}
function print() {
    let str = `Gene ${generation}\n`;
    for (let i = 0; i < 16; i++) {
        str += `(${genes[i].r}, ${genes[i].g}, ${genes[i].b}) `;
    }
    console.log(str);
    return;
}
init(); print();
for (let i = 1; i < 100; i++) {
    select();
    generate();
    print();
}