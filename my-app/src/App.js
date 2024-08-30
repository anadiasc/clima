import React, { useState } from 'react';

// Componente que exibe o resultado da busca
function Resultado({ dados, clima }) {
  // Estilização inline para o resultado
  const estiloResultado = {
    marginTop: '20px',
    textAlign: 'center',
  };

  // Verifica se os dados estão disponíveis
  if (!dados) return null;

  // Exibe a cidade, o estado e o clima obtidos da API
  return (
    <div style={estiloResultado}>
      <h2>Resultado</h2>
      <p>Cidade: {dados.localidade}</p>
      <p>Estado: {dados.uf}</p>
      {clima && (
        <>
          <p>Temperatura: {clima.temp_c}°C</p>
          <p>Condições: {clima.condition.text}</p>
        </>
      )}
    </div>
  );
}

// Componente principal do aplicativo
function App() {
  // Define os estados para o CEP, os dados recebidos da API ViaCEP e do clima
  const [cep, setCep] = useState("");
  const [dados, setDados] = useState(null);
  const [clima, setClima] = useState(null);

  // Função que busca os dados da API ViaCEP
  const buscarDados = async () => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      setDados(data);

      // Verifica se o CEP é válido e busca a previsão do tempo
      if (data.localidade) {
        buscarPrevisao(data.localidade);
      } else {
        setClima(null); // Resetar o clima caso o CEP seja inválido
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      setDados(null);
      setClima(null);
    }
  };

  // Função que busca as informações de clima na API WeatherAPI
  const buscarPrevisao = async (cidade) => {
    try {
      const apiKey = "5447b867f18249b2853205250243008";
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cidade}&lang=pt`
      );
      const data = await response.json();
      if (data.current) {
        setClima({
          temp_c: data.current.temp_c,
          condition: data.current.condition,
        });
      } else {
        setClima(null); // tornar o valor nulo caso não haja informações
      }
    } catch (error) {
      console.error("Erro ao buscar clima:", error.message);
      setClima(null);
    }
  };

  // Estilização inline para os elementos principais
  const estiloContainer = {
    textAlign: 'center',
    marginTop: '50px',
  };
  const estiloInput = {
    padding: '10px',
    fontSize: '16px',
  };
  const estiloBotao = {
    padding: '10px 20px',
    fontSize: '16px',
    marginLeft: '10px',
  };

  // Renderização dos elementos da interface
  return (
    <div style={estiloContainer}>
      <h1>Busca por CEP</h1>
      <input
        type="text"
        placeholder="Digite o CEP"
        value={cep}
        onChange={(e) => setCep(e.target.value)} // Atualiza o valor do CEP
        style={estiloInput}
      />
      <button onClick={buscarDados} style={estiloBotao}>
        Buscar
      </button>
      {/* Componente Resultado recebe os dados e clima como props */}
      <Resultado dados={dados} clima={clima} />
    </div>
  );
}

export default App;
