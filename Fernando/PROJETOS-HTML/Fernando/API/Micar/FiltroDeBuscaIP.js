async function detectarUsuario() {
    const token = "1df66eb6c0d0d3";

    try {
        const response = await fetch(`https://ipinfo.io/json?token=${token}`);

        if (!response.ok) {
            console.error("Erro na requisição:", response.status, response.statusText);
            return;
        }

        const data = await response.json();
        console.log("Dados do ipinfo:", data);

        // Exemplo: pegar cidade, estado, país
        const { ip, city, region, country } = data;
        console.log(`IP: ${ip}, Cidade: ${city}, Estado: ${region}, País: ${country}`);

    } catch (error) {
        console.error("Erro ao buscar dados no ipinfo:", error);
    }
}

detectarUsuario();
