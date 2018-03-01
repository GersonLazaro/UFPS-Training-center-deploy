'use strict'

class Config {
    constructor () {
      this.langs = ['Java', 'C++', 'Python']
      this.compilers = ['javac /files/{folder}/Main.java', 'g++ /files/{folder}/Main.cpp -std=c++11 -o /files/{folder}/Main', '']
      this.runners = ['javaRunner.sh', 'cppRunner.sh', 'pythonRunner.sh']
      this.containers = ['javaSandbox', 'cppSandbox', 'pythonSandbox']
      this.filename = ['Main.java', 'Main.cpp', 'Main.py']
      this.executionFilename = ['Main', 'Main', 'Main.py']
    }
}

module.exports = Config