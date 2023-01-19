'use strict';

const firebase = require('firebase');

class FirebaseUtil {
  constructor(options) {
    if (!global.firebaseConnect && typeof options !== 'object') return new TypeError('O dados tem que estar em objeto!');
    if (!global.firebaseConnect && !options.apiKey) return new TypeError('apiKey é obrigatória, defina ela!');
    if (!global.firebaseConnect && !options.databaseURL) return new TypeError('databaseURL é obrigatória, defina ela!');

    this.database = (() => {
      if (global.firebaseConnect) return firebase.database();
      if (!(firebase.apps.length)) {
        try {
          global.firebaseConnect = true;
          firebase.initializeApp(options);
          console.log("FirebaseUtil conectado ao banco de dados com sucesso !");
          return firebase.database();
        } catch (err) {
          return new Error('Erro ao conectar com o banco de dados. ' + err);
        }
      } else {
        global.firebaseConnect = true;
        return firebase.database();
      }
    })();
  }

  async ping() {
    if (!this.database) return new Error('O banco de dados não está conectado para executar esta ação!');
    let date = Date.now();
    try {
      return await this.database.ref('FirebaseUtil')
        .once('value').then(() => Date.now() - date);
    } catch (err) {
      return new Error(err);
    }
  }

  async add(path, valor) {
    if (!this.database) return new Error('O banco de dados não está conectado para executar esta ação!');
    if (!path) return new TypeError('Você não definiu um caminho!');
    if (!valor) return new TypeError('Você não definiu um valor!');
    if (typeof path !== 'string') return new TypeError('O caminho tem que ser string');
    if (typeof valor !== 'number') return new TypeError('O valor tem que ser um número');
    let db = await this.get(path);
    try {
      if (!db) return await this.set(path, valor);
      else return await this.set(path, db + valor);
    } catch (err) {
      return new Error(err);
    }
  }

  async subtrair(path, valor) {
    if (!this.database) return new Error('O banco de dados não está conectado para executar esta ação!');
    if (!path) return new TypeError('Você não definiu um caminho!');
    if (!valor) return new TypeError('Você não definiu um valor!');
    if (typeof path !== 'string') return new TypeError('O caminho tem que ser string');
    if (typeof valor !== 'number') return new TypeError('O valor tem que ser um número');
    let db = await this.get(path);
    try {
      if (!db) return await this.set(path, valor - (valor * 2));
      else return await this.set(path, db - valor);
    } catch (err) {
      return new Error(err);
    }
  }

  async get(path) {
    if (!this.database) return new Error('O banco de dados não está conectado para executar esta ação!');
    if (!path) return new TypeError('Você não definiu um caminho!');
    if (typeof path !== 'string') return new TypeError('O caminho tem que ser string');
    try {
      return await this.database.ref(path).once('value').then(i => i.val());
    } catch (err) {
      return new Error(err);
    }
  }

  async set(path, value) {
    if (!this.database) return new Error('O banco de dados não está conectado para executar esta ação!');
    if (!path) return new TypeError('Você não definiu um caminho!');
    if (typeof path !== 'string') return new TypeError('O caminho tem que ser string');
    if (!value && value !== 0) return new TypeError('Você não definiu um valor!');
    try {
      let db = await this.get(path);
      if (!db) {
        this.database.ref(path).set(value);
      } else {
        if (typeof value !== "object") return new TypeError("Para atualizar um campo, insira um objeto!");
        this.database.ref(path).update(value);
      }
      return value;
    } catch (err) {
      return new Error(err);
    }
  }

  async delete(path) {
    if (!this.database) return new Error('O banco de dados não está conectado para executar esta ação!');
    if (!path) return new TypeError('Você não definiu um caminho!');
    try {
      this.database.ref(path).remove();
      return true;
    } catch (err) {
      return new Error(err);
    }
  }


  async has(path) {
    if (!this.database) return new Error('O banco de dados não está conectado para executar esta ação!');
    if (!path) return new TypeError('Você não definiu um caminho!');
    if (typeof path !== 'string') return new TypeError('O caminho tem que ser string');
    try {
      let value = await this.get(path);
      if (!value) return false;
      else return true;
    } catch (err) {
      return new Error(err);
    }
  }


  async push(path, values) {
    if (!this.database) return new Error('O banco de dados não está conectado para executar esta ação!');
    if (!path) return new TypeError('Você não definiu um caminho!');
    if (typeof path !== 'string') return new TypeError('O caminho tem que ser string');
    if (!values) return new TypeError('Você não definiu um valor!');
    try {
      let val = await this.get(path);
      if (!Array.isArray(val)) val = [];
      values = Array.isArray(values) ? values : [values];
      val.push(...values);
      await this.set(path, val);
      return val;
    } catch (err) {
      return new Error(err);
    }
  }

  async entries(path) {
    if (!this.database) return new Error('O banco de dados não está conectado para executar esta ação!');
    if (!path) return new TypeError('Você não definiu um caminho!');
    if (typeof path !== 'string') return new TypeError('O caminho tem que ser string');
    try {
      return this.get(path).then(values => Object.entries(values ? values : {}));
    } catch (err) {
      return new Error(err);
    }
  }

  async keys(path) {
    if (!this.database) return new Error('O banco de dados não está conectado para executar esta ação!');
    if (!path) return new TypeError('Você não definiu um caminho!');
    if (typeof path !== 'string') return new TypeError('O caminho tem que ser string');
    try {
      return this.get(path).then(values => Object.keys(values ? values : {}));
    } catch (err) {
      return new Error(err);
    }
  }

  async values(path) {
    if (!this.database) return new Error('O banco de dados não está conectado para executar esta ação!');
    if (!path) return new TypeError('Você não definiu um caminho!');
    if (typeof path !== 'string') return new TypeError('O caminho tem que ser string');
    try {
      return this.get(path).then(values => Object.values(values ? values : {}));
    } catch (err) {
      return new Error(err);
    }
  }

  async toJSON(path) {
    if (!this.database) return new Error('O banco de dados não está conectado para executar esta ação!');
    if (!path) return new TypeError('Você não definiu um caminho!');
    if (typeof path !== 'string') return new TypeError('O caminho tem que ser string');
    try {
      return this.get(path).then(i => JSON.stringify(i ? i : {}));
    } catch (err) {
      return new Error(err);
    }
  }


  async value(path) {
    if (!this.database) return new Error('O banco de dados não está conectado para executar esta ação !');
    if (!path) return new TypeError(`Caminho Invalido !`);
    if (typeof path !== 'string') return new TypeError('O caminho tem que ser string');
    try {
      let db = await this.database.ref(path).once('value');
      return db.numChildren();
    } catch(error) {
      console.log(error);
    }
  }
  
}

module.exports = FirebaseUtil;