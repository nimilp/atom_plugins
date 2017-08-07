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
      'sort-texts:toggle': () => this.toggle(),
      'sort-texts:beautify': () => this.beautify(true),
      'sort-texts:simplify': () => this.beautify(false)
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
      let selection = editor.getSelectedText()
      let reversed = selection.split('\n').sort().join('\n')
      editor.insertText(reversed)
    }
    // console.log('SortTexts was toggled!');
    // return (
    //   this.modalPanel.isVisible() ?
    //   this.modalPanel.hide() :
    //   this.modalPanel.show()
    // );
  },
  beautify(beautify) {
    let editor
    if(editor = atom.workspace.getActiveTextEditor()){
      let selection = JSON.parse(editor.getText())
      let json
      if(beautify){
       json = JSON.stringify(selection,null,4)
     }else {
        json = JSON.stringify(selection)
      }
      editor.setText(json)
    }
  }

};
