# Selecionar elementos no DOM

O objeto document possui o método querySelector que permite selecionar elementos na árvore DOM.

Por exemplo, considerando que temos a input abaixo, e queremos ler o valor digitado pelo usuário:
```html
<label>
  <input type='text' id='nome' placeholder='Digite seu nome'/>
</label>
```

Usando querySelector no javascript:
```javascript
let nomeUsuario = document.querySelector('#nome').value;
console.log(`nome do usuário: ${nomeUsuario}`);
```