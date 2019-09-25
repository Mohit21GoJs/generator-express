import { BaseGeneratorClass } from '@helpers/baseClass';


export = class extends BaseGeneratorClass {
  constructor(args, opts){
    super(args, opts);
  }

  __askFor(){
    // ask for package json questions
  }
  async prompting(){
    // call prompts
  }
  
  writing() {
    const pkg = this._readPkg();
    // update package json and write it
    this._writePkg(pkg);
  }
}