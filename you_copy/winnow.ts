const HASHSIZE = Number.MAX_SAFE_INTEGER;

type Fingerprint = {
    hashes: number[];
    indices: number[];
} 
 
function FindMatchIndices(Array1:number[], Array2:number[]): number[] {
    let indices = [];

    for (let i = 0; i < Array1.length; i++) {
        let val = Array1[i];

        if (Array2.includes(val)) {
            indices.push(i);
        }
    }

    return indices
}


function FindMatchPositions(Fingerprint1:Fingerprint, Fingerprint2:Fingerprint): [number[], number[]] {
    let indices1 = FindMatchIndices(Fingerprint1.hashes, Fingerprint2.hashes);
    let p1 = Fingerprint1.indices.filter((_, index) => indices1.includes(index))

    let indices2 = FindMatchIndices(Fingerprint2.hashes, Fingerprint1.hashes);
    let p2 = Fingerprint2.indices.filter((_, index) => indices2.includes(index));

    return [p1, p2];
}

function RightMin(array: number[]): [number, number] {
    let min = Math.min(...array);
    let indices = array
        .map((val, idx) => val == min ? idx : -1)
        .filter(idx => idx !== -1);

    let rightMostIdx = indices.at(-1) || 0;
    return [min, rightMostIdx];
}


function createFingerprint(windows: number[][]): Fingerprint {
    let numWindows = windows.length;

    let fingerprint = {hashes: [], indices: []} as Fingerprint;

    for (let i = 0; i < numWindows; i++) {
        let window = windows[i];
        let [minHash, localIdx] = RightMin(window);

        let documentIdx = i+localIdx+1;

        if (!fingerprint.indices.includes(documentIdx)) {
            fingerprint.hashes.push(minHash);
            fingerprint.indices.push(documentIdx);
        }
    }

    return fingerprint;
}

function Hash31(unicodeArr: number[]): number {
    let hash = 0;

    for (let i = 0; i < unicodeArr.length; i++) {
        hash = unicodeArr[i] + 31*hash;
        
        hash = hash % HASHSIZE;
    }

    return hash;
}

function strToUnicodeArr(str: string): number[] {
    return str.split('').map((val, _) => val.charCodeAt(0));
}

function HashArr(strArr: string[]): number[] {
    let hashes = strArr.map(str => Hash31(strToUnicodeArr(str)) )
    return hashes;
}

function Kgram(k: number, str: string): string[] {
    let kgrams = [];

    let numKgrams = str.length - k + 1;

    for (let startIdx=0; startIdx < numKgrams; startIdx++) {
        let endIdx = startIdx+k;

        let kgram = str.slice(startIdx, endIdx);

        kgrams.push(kgram);
    }

    if (k > str.length) {
        kgrams = [str];
    }

    return kgrams;
}

function SimilarityScore(matches: number[], k: number, strlen: number): number {
    let scoreArray = Array(strlen).fill(0);

    for (let matchPos of matches) {
        let endIdx = matchPos-1+k;
        scoreArray.fill(1, matchPos-1, endIdx);
    }

    let sum = scoreArray.reduce((prev, curr) => prev + curr);
    let score = sum / strlen;

    return score;
}

function StripString(text: string): string {
    let strippedText = '';

    let unicodeArr = strToUnicodeArr(text);
    for (let i = 0; i < unicodeArr.length; i++) {
        let unicode = unicodeArr[i];

        if (unicode >= 33 && unicode <= 126) {
            strippedText += text[i];
        }
    } 

    return strippedText
}

function Windows(w: number, values: number[]): number[][] {
    let windows: number[][] = [];

    if (w > values.length) {
        windows = [values];
    } else {
        let numWindows = values.length - w + 1;

        for (let startIdx = 0; startIdx < numWindows; startIdx++) {
            let endIdx = startIdx+w;
            let window = values.slice(startIdx, endIdx);

            windows.push(window);
        }
    }

    return windows;
}

function FingerprintDocument(document: string,  k: number, guarantee: number): [Fingerprint, number] {
    let w = guarantee - k + 1;

    let stripped = StripString(document);
    let docLen = stripped.length;

    let kgrams = Kgram(k, stripped);
    let hashes = HashArr(kgrams);
    let windows = Windows(w, hashes);

    let fingerprint = createFingerprint(windows);

    return [fingerprint, docLen];
}

export function CompareDocuments(document1: string, document2:string) {
    let k = 4;
    let guarantee = 4; //gurantee must be >= to k

    let [fingerprint1, docLen1] = FingerprintDocument(document1, k, guarantee);
    let [fingerprint2, docLen2] = FingerprintDocument(document2, k, guarantee);

    let [matchPos1, a] = FindMatchPositions(fingerprint1, fingerprint2);
    let [matchPos2, b] = FindMatchPositions(fingerprint2, fingerprint1);

    let similarity1 = SimilarityScore(matchPos1, k, docLen1);
    let similarity2 = SimilarityScore(matchPos2, k, docLen2);

    let maxSimilarity = Math.max(similarity1, similarity2);

    return maxSimilarity*100;

}





