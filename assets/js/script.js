const valorRecibido = document.querySelector("#valorIngresado");
const valorResultado = document.querySelector("#resultado");
let valorEntregado = 0;
let data;
let myChart;

// Función para traer datos desde API
async function valoresMonedas() {
    try {
        const res = await fetch("https://mindicador.cl/api");
        return await res.json();
    } catch (error) {
        document.querySelector("#error").innerHTML = "¡Algo salió mal! Error: Failed to fetch";
    }
}

// Función para calcular valor de moneda
async function calcularMoneda() {
    if (!valorRecibido.value) {
        valorResultado.innerHTML = 'Por favor ingresar monto';
        return;
    }

    if (!data) {
        data = await valoresMonedas();
    }
    const moneda = document.querySelector("#monedas").value;
    const valor = data[moneda]?.valor || empty;
    valorEntregado = valorRecibido.value / valor;
    valorResultado.innerHTML = `Valor actual:<div id="valorRetornado"><strong>${valorEntregado.toFixed(2)}</div></strong>`;
}

// Función para crear gráfico
async function crearGrafico(moneda) {
    const res = await fetch(`https://mindicador.cl/api/${moneda}/2024`);
    const cambios = await res.json();
    const info = cambios.serie.slice(0, 10).reverse();

    const labels = info.map(cambio => cambio.fecha.split("T")[0].split('-').reverse().join('-'));
    const data = info.map(cambio => cambio.valor);

    return {
        labels,
        datasets: [{
            label: "Cambio",
            borderColor: "rgb(100, 99, 132)",
            backgroundColor: "rgba(255, 255, 255, 1)",
            data,
        }],
    };
}

// Función para renderizar gráfico
async function renderGrafica() {
    const moneda = document.querySelector("#monedas").value;
    const data = await crearGrafico(moneda);

    if (myChart) {
        myChart.destroy();
    }

    const ctx = document.getElementById("myChart").getContext("2d");
    ctx.canvas.style.backgroundColor = "white";
    myChart = new Chart(ctx, { type: "line", data });
}

// Función activadora de eventos al hacer clic
async function realizarCambio() {
    await calcularMoneda();
    await renderGrafica();
}

document.querySelector("#validar").addEventListener("click", realizarCambio);
