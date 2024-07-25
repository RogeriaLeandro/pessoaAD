package com.example.pessoa.autenticacao.repository;

import com.example.pessoa.autenticacao.model.Pessoa;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PessoaRepository extends JpaRepository<Pessoa, Long> {
}
