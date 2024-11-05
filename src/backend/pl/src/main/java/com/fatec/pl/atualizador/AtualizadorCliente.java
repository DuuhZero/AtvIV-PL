package com.fatec.pl.atualizador;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fatec.pl.modelo.Cliente;
import com.fatec.pl.modelo.Telefone;
import com.fatec.pl.verificador.VerificadorEnderecoNulo;
import com.fatec.pl.verificador.VerificadorStringNula;
import com.fatec.pl.verificador.VerificadorTelefoneNulo;

@Component
public class AtualizadorCliente implements Atualizador<Cliente> {
    
    @Autowired
    private VerificadorStringNula verificadorString;
    
    @Autowired
    private VerificadorEnderecoNulo verificadorEndereco;
    
    @Autowired
    private AtualizadorEndereco atualizadorEndereco; // Supondo que esta classe já exista
    
    @Autowired
    private VerificadorTelefoneNulo verificadorTelefone;

    @Override
    public void atualizar(Cliente alvo, Cliente atualizacao) {
        if (alvo == null || atualizacao == null) {
            throw new IllegalArgumentException("Cliente alvo e atualizacao não podem ser nulos");
        }
        
        atualizarNome(alvo, atualizacao);
        atualizarEmail(alvo, atualizacao);
        atualizarNomeSocial(alvo, atualizacao);
        atualizarEndereco(alvo, atualizacao);
        atualizarTelefones(alvo, atualizacao);
    }

    private void atualizarNome(Cliente alvo, Cliente atualizacao) {
        if (!verificadorString.verificar(atualizacao.getNome())) {
            alvo.setNome(atualizacao.getNome());
        }
    }

    private void atualizarEmail(Cliente alvo, Cliente atualizacao) {
        if (!verificadorString.verificar(atualizacao.getEmail())) {
            alvo.setEmail(atualizacao.getEmail());
        }
    }

    private void atualizarNomeSocial(Cliente alvo, Cliente atualizacao) {
        if (!verificadorString.verificar(atualizacao.getNomeSocial())) {
            alvo.setNomeSocial(atualizacao.getNomeSocial());
        }
    }

    private void atualizarEndereco(Cliente alvo, Cliente atualizacao) {
        if (!verificadorEndereco.verificar(atualizacao.getEndereco())) {
            if (alvo.getEndereco() != null) {
                atualizadorEndereco.atualizar(alvo.getEndereco(), atualizacao.getEndereco());
            } else {
                alvo.setEndereco(atualizacao.getEndereco());
            }
        }
    }

    private void atualizarTelefones(Cliente alvo, Cliente atualizacao) {
        if (atualizacao.getTelefones() != null && !atualizacao.getTelefones().isEmpty()) {
            if (alvo.getTelefones() != null) {
                alvo.getTelefones().clear(); // Limpa a lista de telefones existentes
            }

            for (Telefone telefone : atualizacao.getTelefones()) {
                if (!verificadorTelefone.verificar(telefone)) {
                    Telefone telefoneNovo = new Telefone();
                    telefoneNovo.setDdd(telefone.getDdd());
                    telefoneNovo.setNumero(telefone.getNumero());
                    alvo.getTelefones().add(telefoneNovo);
                }
            }
        }
    }
}