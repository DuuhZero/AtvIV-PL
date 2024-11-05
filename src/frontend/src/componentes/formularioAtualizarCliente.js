import React, { useState, useEffect } from 'react';

export default function FormularioAtualizarCliente({ clienteData }) {
  const [cliente, setCliente] = useState({
    nome: '',
    email: '',
    nomeSocial: '',
    endereco: {
      rua: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: '',
      codigoPostal: '',
      informacoesAdicionais: '',
    },
  });

  const [clienteInicial, setClienteInicial] = useState(cliente);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alteracoes, setAlteracoes] = useState({});

  useEffect(() => {
    if (clienteData) {
      setCliente(clienteData);
      setClienteInicial(clienteData);
    }
  }, [clienteData]);

  useEffect(() => {
    const isChanged = JSON.stringify(cliente) !== JSON.stringify(clienteInicial);
    if (isChanged) {
      const updatedFields = {};
      for (const key in cliente) {
        if (JSON.stringify(cliente[key]) !== JSON.stringify(clienteInicial[key])) {
          updatedFields[key] = true;
        } else if (typeof cliente[key] === 'object') {
          for (const subKey in cliente[key]) {
            if (cliente[key][subKey] !== clienteInicial[key][subKey]) {
              updatedFields[key] = true;
              break;
            }
          }
        }
      }
      setAlteracoes(updatedFields);
    } else {
      setAlteracoes({});
    }
  }, [cliente, clienteInicial]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isChanged = JSON.stringify(cliente) !== JSON.stringify(clienteInicial);

    if (!isChanged) {
      alert("Nenhuma alteração foi feita.");
      return;
    }

    setIsSubmitting(true);
    console.log("Dados do cliente a serem enviados:", cliente);

    try {
      const response = await fetch('http://localhost:32831/cliente/atualizar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cliente),
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        alert(`Erro ao atualizar o cliente: ${errorMessage.error || response.statusText}`);
      } else {
        console.log("Cliente atualizado com sucesso:", cliente);
        setClienteInicial(cliente);
        setAlteracoes({});
      }
    } catch (error) {
      console.error("Erro de rede ou de conexão:", error);
      alert(`Erro ao atualizar o cliente: ${error.message || error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h2>Atualizar Cliente</h2>
        <form onSubmit={handleSubmit}>
          {Object.keys(cliente).map((key) => (
            <div className="form-group" key={key}>
              <label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
              {typeof cliente[key] === 'object' ? (
                Object.keys(cliente[key]).map((subKey) => (
                  <div key={subKey}>
                    <label htmlFor={subKey}>{subKey.charAt(0).toUpperCase() + subKey.slice(1)}:</label>
                    <input
                      type="text"
                      name={subKey}
                      value={cliente[key][subKey]}
                      onChange={(e) => setCliente({
                        ...cliente,
                        [key]: { ...cliente[key], [subKey]: e.target.value },
                      })}
                      className={`form-control ${alteracoes[key] ? 'border-danger' : ''}`}
                    />
                  </div>
                ))
              ) : (
                <input
                  type="text"
                  name={key}
                  value={cliente[key]}
                  onChange={(e) => setCliente({ ...cliente, [key]: e.target.value })}
                  className={`form-control ${alteracoes[key] ? 'border-danger' : ''}`}
                />
              )}
            </div>
          ))}
          <button type="submit" className="btn-verde2" disabled={isSubmitting}>
            {isSubmitting ? 'Atualizando...' : 'Atualizar Cliente'}
          </button>
        </form>
      </div>
    </div>
  );
}