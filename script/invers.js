// Menambahkan style untuk input
const inputs = document.querySelectorAll('input');
inputs.forEach(input => {
    input.style.width = '100%';
    input.style.padding = '10px';
    input.style.margin = '8px 0';
    input.style.borderRadius = '4px';
    input.style.border = '1px solid #ddd';
    input.style.fontSize = '16px';
    input.style.transition = 'all 0.3s ease';

    // Efek hover dan focus
    input.addEventListener('mouseover', () => {
        input.style.borderColor = '#999';
    });
    input.addEventListener('mouseout', () => {
        if (!input.matches(':focus')) {
            input.style.borderColor = '#ddd';
        }
    });
    input.addEventListener('focus', () => {
        input.style.borderColor = '#4CAF50';
        input.style.boxShadow = '0 0 5px rgba(76,175,80,0.3)';
    });
    input.addEventListener('blur', () => {
        input.style.borderColor = '#ddd';
        input.style.boxShadow = 'none';
    });
});

// Menambahkan style untuk button
const buttons = document.querySelectorAll('button');
buttons.forEach(button => {
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.padding = '12px 20px';
    button.style.margin = '8px 4px';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '16px';
    button.style.transition = 'all 0.3s ease';

    // Efek hover
    button.addEventListener('mouseover', () => {
        button.style.backgroundColor = '#45a049';
        button.style.transform = 'scale(1.05)';
    });
    button.addEventListener('mouseout', () => {
        button.style.backgroundColor = '#4CAF50';
        button.style.transform = 'scale(1)';
    });
    
    // Efek klik
    button.addEventListener('mousedown', () => {
        button.style.transform = 'scale(0.95)';
    });
    button.addEventListener('mouseup', () => {
        button.style.transform = 'scale(1.05)';
    });
});

// Menambahkan style untuk result container
const resultContainer = document.getElementById('result');
resultContainer.style.backgroundColor = '#f9f9f9';
resultContainer.style.padding = '20px';
resultContainer.style.borderRadius = '8px';
resultContainer.style.marginTop = '20px';
resultContainer.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
resultContainer.style.transition = 'all 0.3s ease';

// Event listener untuk animasi result ketika berubah
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
            resultContainer.style.transform = 'scale(0.95)';
            resultContainer.style.opacity = '0.5';
            
            setTimeout(() => {
                resultContainer.style.transform = 'scale(1)';
                resultContainer.style.opacity = '1';
            }, 100);
        }
    });
});

observer.observe(resultContainer, {
    childList: true,
    subtree: true
});

document.getElementById("calculateInvers").addEventListener("click", () => {
    const fFunc = document.getElementById("f").value.trim();
    const gFunc = document.getElementById("g").value.trim();

    if (fFunc === '' || gFunc === '') {
        alert("Harap masukkan kedua fungsi f(x) dan g(x) yang valid.");
        return;
    }

    try {
        const inversF = calculateInverse(fFunc);
        const inversG = calculateInverse(gFunc);
        const domainF = calculateDomain(fFunc);
        const domainG = calculateDomain(gFunc);
        const rangeF = calculateRange(fFunc);
        const rangeG = calculateRange(gFunc);

        document.getElementById("result").innerHTML = `
            <h3>Fungsi f(x)</h3>
            <p>Fungsi awal: f(x) = ${fFunc}</p>
            <p>Langkah-langkah mencari invers f(x):</p>
            <ol>
                <li>Ganti f(x) dengan y: y = ${fFunc}</li>
                <li>Tukar x dan y</li>
                <li>Selesaikan persamaan untuk y</li>
                <li>Ganti y dengan x untuk mendapatkan f<sup>-1</sup>(x)</li>
            </ol>
            <p>Hasil invers f(x): f<sup>-1</sup>(x) = ${inversF}</p>
            <p>Domain: ${domainF}</p>
            <p>Range: ${rangeF}</p>

            <h3>Fungsi g(x)</h3>
            <p>Fungsi awal: g(x) = ${gFunc}</p>
            <p>Langkah-langkah mencari invers g(x):</p>
            <ol>
                <li>Ganti g(x) dengan y: y = ${gFunc}</li>
                <li>Tukar x dan y</li>
                <li>Selesaikan persamaan untuk y</li>
                <li>Ganti y dengan x untuk mendapatkan g<sup>-1</sup>(x)</li>
            </ol>
            <p>Hasil invers g(x): g<sup>-1</sup>(x) = ${inversG}</p>
            <p>Domain: ${domainG}</p>
            <p>Range: ${rangeG}</p>

            <h3>Analisis Sifat Fungsi</h3>
            ${analyzeFunctions(fFunc, gFunc)}
        `;
    } catch (error) {
        alert(`Terjadi kesalahan: ${error.message}`);
    }
});

function calculateInverse(f) {
    f = f.replace(/\s+/g, '').replace(/\*/g, '');
    
    const cubicMatch = f.match(/^([-+]?\d*)?x\^3([-+]?\d*)?x\^2?([-+]?\d*)?x?([-+]?\d*)?$/);
    const quadraticMatch = f.match(/^([-+]?\d*)?x\^2([-+]?\d*)?x?([-+]?\d*)?$/);
    const linearMatch = f.match(/^([-+]?\d*)?x([-+]?\d*)?$/);

    if (cubicMatch) {
        let [_, a = '1', b = '0', c = '0', d = '0'] = cubicMatch;
        [a, b, c, d] = normalizeCoefficients([a, b, c, d]);
        
        if (a === 0) throw new Error("Koefisien x^3 tidak boleh 0 untuk fungsi kubik");
        
        return `Untuk menyelesaikan persamaan: ${a}y^3 + ${b}y^2 + ${c}y + ${d} = x`;
        
    } else if (quadraticMatch) {
        let [_, a = '1', b = '0', c = '0'] = quadraticMatch;
        [a, b, c] = normalizeCoefficients([a, b, c]);

        if (a === 0) throw new Error("Koefisien x^2 tidak boleh 0 untuk fungsi kuadrat");

        const discriminant = Math.pow(b, 2) - 4 * a * c;
        if (discriminant < 0) {
            throw new Error("Fungsi kuadrat tidak memiliki solusi nyata.");
        }

        const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
        
        return `x = ±√((y - ${c})/${a}) - ${b}/(2*${a})
                dengan nilai x₁ = ${root1.toFixed(2)} dan x₂ = ${root2.toFixed(2)}`;

    } else if (linearMatch) {
        let [_, a = '1', b = '0'] = linearMatch;
        [a, b] = normalizeCoefficients([a, b]);

        if (a === 0) throw new Error("Koefisien x tidak boleh 0 untuk fungsi linear");

        return `(x - ${b}) / ${a}`;
    } else {
        throw new Error("Format fungsi tidak valid. Gunakan format: ax^3 + bx^2 + cx + d, ax^2 + bx + c, atau ax + b");
    }
}

function normalizeCoefficients(coefficients) {
    return coefficients.map(coef => {
        if (coef === '' || coef === '+') return 1;
        if (coef === '-') return -1;
        return parseFloat(coef) || 0;
    });
}

function calculateDomain(f) {
    return "ℝ (semua bilangan real)";
}

function calculateRange(f) {
    const type = determineFunctionType(f);
    switch(type) {
        case 'linear':
            return "ℝ (semua bilangan real)";
        case 'quadratic':
            const a = getLeadingCoefficient(f);
            return a > 0 ? "dari titik minimum ke atas (minimum, ∞)" : "dari titik maksimum ke bawah (-∞, maksimum)";
        case 'cubic':
            return "ℝ (semua bilangan real)";
        default:
            return "Tidak dapat menentukan range";
    }
}

function analyzeFunctions(f, g) {
    let analysis = "<p>Sifat-sifat fungsi:</p>";
    
    analysis += "<p><strong>Monotonitas:</strong></p>";
    analysis += `<p>${analyzeMonotonicity(f, 'f(x)')}</p>`;
    analysis += `<p>${analyzeMonotonicity(g, 'g(x)')}</p>`;
    
    analysis += "<p><strong>Titik Ekstrem:</strong></p>";
    analysis += `<p>${findExtremePoints(f, 'f(x)')}</p>`;
    analysis += `<p>${findExtremePoints(g, 'g(x)')}</p>`;
    
    return analysis;
}

function determineFunctionType(f) {
    f = f.replace(/\*/g, '');
    if (f.includes('x^3')) return 'cubic';
    if (f.includes('x^2')) return 'quadratic';
    if (f.includes('x') && !f.includes('^')) return 'linear';
    return 'unknown';
}

function analyzeMonotonicity(f, funcName) {
    const type = determineFunctionType(f);
    let result = `${funcName} adalah `;
    
    switch(type) {
        case 'linear':
            const a = getLeadingCoefficient(f);
            result += a > 0 ? "fungsi yang selalu naik" : "fungsi yang selalu turun";
            break;
        case 'quadratic':
            result += "fungsi yang memiliki titik balik (tidak selalu naik/turun)";
            break;
        case 'cubic':
            result += "fungsi yang memiliki dua titik belok";
            break;
        default:
            result += "tidak dapat ditentukan sifat kemonotonannya";
    }
    
    return result;
}

function findExtremePoints(f, funcName) {
    const type = determineFunctionType(f);
    if (type === 'linear') return `${funcName} tidak memiliki titik ekstrem (minimum/maksimum)`;
    
    if (type === 'quadratic') {
        const match = f.replace(/\*/g, '').match(/([+-]?\d*)?x\^2([+-]?\d*)?x?([+-]?\d*)?/);
        if (match) {
            let [_, a = '1', b = '0', c = '0'] = match;
            [a, b, c] = normalizeCoefficients([a, b, c]);
            const xVertex = -b / (2 * a);
            const yVertex = a * Math.pow(xVertex, 2) + b * xVertex + c;
            return `${funcName} memiliki titik ${a > 0 ? 'minimum' : 'maksimum'} di titik (${xVertex.toFixed(2)}, ${yVertex.toFixed(2)})`;
        }
    }
    
    return `Titik ekstrem ${funcName} tidak dapat ditentukan secara langsung`;
}

function getLeadingCoefficient(f) {
    f = f.replace(/\*/g, '');
    const match = f.match(/([+-]?\d*)?x/);
    if (match) {
        let coef = match[1];
        if (coef === '' || coef === '+') return 1;
        if (coef === '-') return -1;
        return parseFloat(coef);
    }
    return 0;
}

document.getElementById("calculateSum").addEventListener("click", () => {
    const fFunc = document.getElementById("f").value.trim();
    const gFunc = document.getElementById("g").value.trim();

    if (fFunc === '' || gFunc === '') {
        alert("Harap masukkan kedua fungsi f(x) dan g(x) yang valid.");
        return;
    }

    try {
        const sumFunc = addFunctions(fFunc, gFunc);
        const domainSum = calculateDomain(sumFunc);
        const rangeSum = calculateRange(sumFunc);

        document.getElementById("result").innerHTML = `
            <h3>Penjumlahan Fungsi</h3>
            <p>f(x) = ${fFunc}</p>
            <p>g(x) = ${gFunc}</p>
            <p>Langkah-langkah penjumlahan:</p>
            <ol>
                <li>Jumlahkan koefisien-koefisien yang sejenis</li>
                <li>Sederhanakan hasil penjumlahan</li>
            </ol>
            <p>Hasil: h(x) = f(x) + g(x) = ${sumFunc}</p>
            <p>Domain h(x): ${domainSum}</p>
            <p>Range h(x): ${rangeSum}</p>
            <h3>Analisis Fungsi Hasil:</h3>
            ${analyzeFunctions(sumFunc, '')}
        `;
    } catch (error) {
        alert(`Terjadi kesalahan: ${error.message}`);
    }
});

function addFunctions(f, g) {
    f = f.replace(/\s+/g, '').replace(/\*/g, '');
    g = g.replace(/\s+/g, '').replace(/\*/g, '');

    const typeF = determineFunctionType(f);
    const typeG = determineFunctionType(g);

    if (typeF !== typeG) {
        throw new Error("Kedua fungsi harus memiliki derajat yang sama");
    }

    let result = '';
    switch(typeF) {
        case 'cubic':
            result = addCubicFunctions(f, g);
            break;
        case 'quadratic':
            result = addQuadraticFunctions(f, g);
            break;
        case 'linear':
            result = addLinearFunctions(f, g);
            break;
        default:
            throw new Error("Format fungsi tidak didukung");
    }

    return simplifyFunction(result);
}

function addCubicFunctions(f, g) {
    const matchF = f.match(/([+-]?\d*)?x\^3([+-]?\d*)?x\^2([+-]?\d*)?x([+-]?\d*)?/);
    const matchG = g.match(/([+-]?\d*)?x\^3([+-]?\d*)?x\^2([+-]?\d*)?x([+-]?\d*)?/);
    
    if (!matchF || !matchG) throw new Error("Format fungsi kubik tidak valid");

    const coeffsF = normalizeCoefficients([matchF[1], matchF[2], matchF[3], matchF[4]]);
    const coeffsG = normalizeCoefficients([matchG[1], matchG[2], matchG[3], matchG[4]]);

    return `${coeffsF[0] + coeffsG[0]}x^3 + ${coeffsF[1] + coeffsG[1]}x^2 + ${coeffsF[2] + coeffsG[2]}x + ${coeffsF[3] + coeffsG[3]}`;
}

function addQuadraticFunctions(f, g) {
    const matchF = f.match(/([+-]?\d*)?x\^2([+-]?\d*)?x([+-]?\d*)?/);
    const matchG = g.match(/([+-]?\d*)?x\^2([+-]?\d*)?x([+-]?\d*)?/);
    
    if (!matchF || !matchG) throw new Error("Format fungsi kuadrat tidak valid");

    const coeffsF = normalizeCoefficients([matchF[1], matchF[2], matchF[3]]);
    const coeffsG = normalizeCoefficients([matchG[1], matchG[2], matchG[3]]);

    return `${coeffsF[0] + coeffsG[0]}x^2 + ${coeffsF[1] + coeffsG[1]}x + ${coeffsF[2] + coeffsG[2]}`;
}

function addLinearFunctions(f, g) {
    const matchF = f.match(/([+-]?\d*)?x([+-]?\d*)?/);
    const matchG = g.match(/([+-]?\d*)?x([+-]?\d*)?/);
    
    if (!matchF || !matchG) throw new Error("Format fungsi linear tidak valid");

    const coeffsF = normalizeCoefficients([matchF[1], matchF[2]]);
    const coeffsG = normalizeCoefficients([matchG[1], matchG[2]]);

    return `${coeffsF[0] + coeffsG[0]}x + ${coeffsF[1] + coeffsG[1]}`;
}

function simplifyFunction(f) {
    return f.replace(/\+ -/g, '- ')
            .replace(/^1x/, 'x')
            .replace(/\+ 0x?/g, '')
            .replace(/- 0x?/g, '')
            .replace(/\+ 1x/g, '+ x')
            .replace(/- 1x/g, '- x')
            .trim();
}
