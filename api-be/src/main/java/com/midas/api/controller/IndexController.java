package com.midas.api.controller;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;
import com.midas.api.model.Usuario;
import com.midas.api.repository.TelefoneRepository;
import com.midas.api.repository.UsuarioRepository;
import com.midas.api.util.CaracterUtil;

@RestController // Arquitetura REST
@RequestMapping(value = "/usuario")
public class IndexController {
	
	@Autowired
	private UsuarioRepository usuarioRp;
	
	@Autowired
	private TelefoneRepository telefoneRp;
	
	// METODO GET #################################################################################
	
	// Serviço restfull - consultar ID
	@GetMapping(value = "/{id}", produces = "application/json")
	public ResponseEntity<Usuario> init(@PathVariable(value="id") Long id) {
		
		Optional<Usuario> usuario = usuarioRp.findById(id);
		
		return new ResponseEntity<Usuario>(usuario.get(), HttpStatus.OK);
	}
	
	//Consulta todos os users
	@GetMapping(value = "/", produces = "application/json")
	@CacheEvict(value = "cacheusuarios", allEntries = true)
	@CachePut("cacheusuarios")
	public ResponseEntity<Page<Usuario>> usuario() throws InterruptedException {
		
		PageRequest page = PageRequest.of(0, 5, Sort.by("nome"));
		
		Page<Usuario> list = usuarioRp.findAll(page);
			
		return new ResponseEntity<Page<Usuario>>(list, HttpStatus.OK);
	}

	// Consulta todos os users
	@GetMapping(value = "/pagina/{pagina}", produces = "application/json")
	@CacheEvict(value = "cacheusuarios", allEntries = true)
	@CachePut("cacheusuarios")
	public ResponseEntity<Page<Usuario>> usuarioPagina(@PathVariable("pagina") int pagina) throws InterruptedException {
		
		PageRequest page = PageRequest.of(pagina, 5, Sort.by("nome"));
		
		Page<Usuario> list = usuarioRp.findAll(page);
			
		return new ResponseEntity<Page<Usuario>>(list, HttpStatus.OK);
	}
	
	//Consulta todos os users - busca
	@GetMapping(value = "/usuarioBusca/{busca}", produces = "application/json")
	@CacheEvict(value = "cacheusuarios", allEntries = true)
	@CachePut("cacheusuarios")
	public ResponseEntity<List<Usuario>> usuarioNome(@PathVariable("busca") String busca) throws InterruptedException {
		busca = CaracterUtil.buscaContexto(busca);
		List<Usuario> listUsuarios = (List<Usuario>) usuarioRp.findUserByBusca(busca);
	
		return new ResponseEntity<List<Usuario>>(listUsuarios, HttpStatus.OK);
	}
	
	// METODO POST ################################################################################
	
	@PostMapping(value = "/", produces = "application/json")
	public ResponseEntity<Usuario> cadastrar(@RequestBody Usuario usuario) throws Exception {
		
		// amarrar os telefones ao usuario
		for(int pos = 0; pos < usuario.getListTelefones().size(); pos++) {
			usuario.getListTelefones().get(pos).setUsuario(usuario);
		}
		
		if(usuario.getCep() != null) {
			// consumindo API externa
			URL url = new URL("https://viacep.com.br/ws/" + usuario.getCep() +"/json/");
			URLConnection connection = url.openConnection();
			InputStream is = connection.getInputStream();
			BufferedReader br = new BufferedReader(new InputStreamReader(is, "UTF-8"));
			
			String cep = "";
			StringBuilder jsonCep = new StringBuilder();
			while((cep = br.readLine()) != null) {
				jsonCep.append(cep);
			}
			
			System.out.println(jsonCep.toString());
			
			Usuario userAux = new Gson().fromJson(jsonCep.toString(), Usuario.class);
			
			usuario.setCep(userAux.getCep());
			usuario.setLogradouro(userAux.getLogradouro());
			usuario.setComplemento(userAux.getComplemento());
			usuario.setBairro(userAux.getBairro());
			usuario.setLocalidade(userAux.getLocalidade());
			usuario.setUf(userAux.getUf());
			
			// consumindo API externa - fim		
		}
		
		String senhacrypt = new BCryptPasswordEncoder().encode(usuario.getSenha());
		usuario.setSenha(senhacrypt);
		
		Usuario usuariosalvo = usuarioRp.save(usuario);
		
		return new ResponseEntity<Usuario>(usuariosalvo, HttpStatus.OK);
	}
	
	// METODO PUT #################################################################################
	
	@PutMapping(value = "/", produces = "application/json")
	public ResponseEntity<Usuario> atualizar(@RequestBody Usuario usuario){
		
		// amarrar os telefones ao usuario
		for(int pos = 0; pos < usuario.getListTelefones().size(); pos++) {
			usuario.getListTelefones().get(pos).setUsuario(usuario);
		}
		
		Usuario userTemporario = usuarioRp.findUserById(usuario.getId());
		
		if (!userTemporario.getSenha().equals(usuario.getSenha())) { // Senhas diferentes
			String senhacriptografada = new BCryptPasswordEncoder().encode(usuario.getSenha());
			usuario.setSenha(senhacriptografada);
		}
		
		Usuario usuarioatualiza = usuarioRp.save(usuario);
		
		return new ResponseEntity<Usuario>(usuarioatualiza, HttpStatus.OK);
	}
	
	// METODO DELETE ##############################################################################
	
	@DeleteMapping(value = "/{id}", produces = "application/json")
	public ResponseEntity<?> delete(@PathVariable("id") Long id) {
		usuarioRp.deleteById(id);
		return ResponseEntity.ok(HttpStatus.OK);
	}
	
	@DeleteMapping(value = "/deleteTelofone/{id}", produces = "application/json")
	public ResponseEntity<?> deleteTelefone(@PathVariable("id") Long id) {
		telefoneRp.deleteById(id);
		return ResponseEntity.ok(HttpStatus.OK);
	}
}
