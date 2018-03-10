'use babel';

import SortTextsView from './sort-texts-view';
import { CompositeDisposable } from 'atom';

export default {

  sortTextsView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.sortTextsView = new SortTextsView(state.sortTextsViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.sortTextsView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'Nimil:sort': () => this.toggle(),
      'Nimil:beautify': () => this.beautify(true),
      'Nimil:simplify': () => this.beautify(false)
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.sortTextsView.destroy();
  },

  serialize() {
    return {
      sortTextsViewState: this.sortTextsView.serialize()
    };
  },

  toggle() {
    let editor
    if(editor = atom.workspace.getActiveTextEditor()){
      let selection = editor.getSelectedText(),selected = true
      console.log('->'+selection)
      if(selection === ''){
        selection = editor.getText()
        selected=false
      }
      let reversed = selection.split('\n').sort().join('\n')
      if(selected){
        editor.insertText(reversed)
      }else {
        editor.setText(reversed)
      }
    }

  },
  beautify(beautify) {
    let editor
    if(editor = atom.workspace.getActiveTextEditor()){
      let selection, json,selected
      if(editor.getSelectedText() !== ''){
        selected=true
        selection = JSON.parse(editor.getSelectedText())
      }else{
        selection = JSON.parse(editor.getText())
      }

      if(beautify){
       json = JSON.stringify(selection,null,4)
     }else {
        json = JSON.stringify(selection)
      }
      if(selected){
        editor.insertText(json)
      }else
      editor.setText(json)
    }
  }

};
